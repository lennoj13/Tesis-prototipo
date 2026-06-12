import sys
import os
import joblib
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean, cityblock
import psycopg2
from psycopg2.extras import RealDictCursor

# Configuramos BD (Modifica si cambiaste las credenciales)
DB_CONFIG = {
    "dbname": "matching_db",
    "user": "postgres",
    "password": "jonnel01",
    "host": "localhost",
    "port": "5432"
}

def limpiar_texto(texto):
    import re
    if not isinstance(texto, str): return ""
    texto = texto.lower()
    texto = re.sub(re.compile(r'[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]'), ' ', texto)
    return re.sub(r'\s+', ' ', texto).strip()

def probar_hibrido_consola():
    print("=== INICIANDO MOTOR HÍBRIDO (XGBoost + SVR) EN CONSOLA ===")
    
    base_dir = r"c:\Users\Usuario\Desktop\Tesis prototipo\nlp_engine\modelos_entrenados"
    
    print("[1/3] Cargando modelos...")
    # XGBoost
    xgb_model = joblib.load(os.path.join(base_dir, "xgboost", "pivipp_xgboost.pkl"))
    xgb_scaler = joblib.load(os.path.join(base_dir, "xgboost", "pivipp_xgboost_scaler.pkl"))
    
    # SVR
    svr_model = joblib.load(os.path.join(base_dir, "svr", "pivipp_svr.pkl"))
    svr_scaler = joblib.load(os.path.join(base_dir, "svr", "pivipp_svr_scaler.pkl"))
    
    # Transformer
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    
    print("[2/3] Extrayendo datos de la Base de Datos...")
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Vacantes
    cur.execute("SELECT vacante_id, titulo, area, descripcion, requisitos FROM vacantes WHERE activo = true")
    vacantes = cur.fetchall()
    
    cur.execute("""
        SELECT hv.vacante_id, h.nombre FROM habilidades_vacante hv
        JOIN habilidades h ON hv.habilidad_id = h.habilidad_id
    """)
    habs_vac_all = cur.fetchall()
    
    hab_map = {}
    for r in habs_vac_all:
        hab_map.setdefault(r['vacante_id'], []).append(r['nombre'])
    
    # Obtener algunos perfiles de estudiante para probar (Ej. 3 estudiantes distintos)
    cur.execute("""
        SELECT pe.usuario_id, pe.perfil_id, pe.resumen_experiencia, pe.intereses, c.nombre as carrera,
               u.nombre, u.apellido
        FROM perfiles_estudiante pe
        LEFT JOIN carreras c ON pe.carrera_id = c.carrera_id
        JOIN usuarios u ON pe.usuario_id = u.usuario_id
        ORDER BY pe.perfil_id ASC LIMIT 3
    """)
    perfiles = cur.fetchall()
    if not perfiles:
        print("No se encontraron estudiantes.")
        return
        
    for perfil in perfiles:
        print(f"\n\n{'='*110}")
        print(f"ESTUDIANTE: {perfil['nombre']} {perfil['apellido']} (ID: {perfil['usuario_id']})")
        print(f"{'='*110}")
        
        cur.execute("""
            SELECT h.nombre FROM habilidades_estudiante he
            JOIN habilidades h ON he.habilidad_id = h.habilidad_id
            WHERE he.estudiante_id = %s
        """, (perfil['perfil_id'],))
        habs_est = [r['nombre'] for r in cur.fetchall()]
        
        texto_est = f"{perfil['carrera']} {perfil['resumen_experiencia']} {perfil['intereses']} {' '.join(habs_est)}"
        emb_est = embedding_model.encode([limpiar_texto(texto_est)], convert_to_numpy=True, normalize_embeddings=True)[0]
        
        resultados = []
        skills_est_set = set([s.lower() for s in habs_est])
        
        for v in vacantes:
            v_id = v['vacante_id']
            h_vac = hab_map.get(v_id, [])
            
            texto_v = f"{v['titulo']} {v['area']} {v['descripcion']} {v['requisitos']} {' '.join(h_vac)}"
            emb_v = embedding_model.encode([limpiar_texto(texto_v)], convert_to_numpy=True, normalize_embeddings=True)[0]
            
            sim_coseno = cosine_similarity([emb_est], [emb_v])[0][0]
            diff_vectorial = np.abs(emb_est - emb_v)
            dist_euclidiana = euclidean(emb_est, emb_v)
            dist_manhattan = cityblock(emb_est, emb_v)
            
            h_vac_set = set([s.lower() for s in h_vac])
            match_score = (len(skills_est_set.intersection(h_vac_set)) / max(1, len(h_vac_set))) * 100
            comp_score = (len(h_vac_set.difference(skills_est_set)) / max(1, len(h_vac_set))) * 100
            
            vector = np.concatenate([
                [sim_coseno], diff_vectorial, [dist_euclidiana, dist_manhattan], [match_score, comp_score]
            ])
            X_inf = np.array([vector], dtype=np.float32)
            
            # Inferencia Híbrida
            p_xgb = float(xgb_model.predict(xgb_scaler.transform(X_inf))[0])
            p_svr = float(svr_model.predict(svr_scaler.transform(X_inf))[0])
            
            p_xgb = max(0.0, min(100.0, p_xgb))
            p_svr = max(0.0, min(100.0, p_svr))
            
            # === REGLAS LÓGICAS (ENRUTAMIENTO INTELIGENTE V3) ===
            if p_xgb >= 60.0 and sim_coseno >= 0.40:
                p_hibrido = p_xgb
                regla = "XGBoost (Mantiene el Pico)"
            elif p_xgb >= 60.0 and sim_coseno < 0.40:
                p_hibrido = p_svr
                regla = "SVR (Castigo por Trampa)"
            elif p_xgb < 40.0 and p_svr >= 40.0:
                p_hibrido = p_svr
                regla = "SVR (Salva por Buen Texto)"
            else:
                p_hibrido = (p_xgb + p_svr) / 2.0
                regla = "Promedio Híbrido"
            
            resultados.append({
                'vacante_id': v_id,
                'titulo': v['titulo'],
                'xgb': p_xgb,
                'svr': p_svr,
                'hibrido': p_hibrido,
                'coseno': sim_coseno,
                'regla': regla
            })
            
        resultados.sort(key=lambda x: x['hibrido'], reverse=True)
        
        print(f"{'VACANTE':<35} | {'XGBOOST':<8} | {'SVR':<8} | {'FINAL':<8} | {'COSENO':<6} | {'REGLA APLICADA'}")
        print("-" * 125)
        for r in resultados: # Mostrar todas las vacantes
            print(f"ID {r['vacante_id']:<2} - {r['titulo'][:28]:<28} | {r['xgb']:>7.2f}% | {r['svr']:>7.2f}% | {r['hibrido']:>7.2f}% | {r['coseno']:>6.2f} | {r['regla']}")

if __name__ == '__main__':
    probar_hibrido_consola()
