import os
import re
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def diagnosticar_similitud(perfil_texto, habilidades_estudiante, vacantes_lista):
    """
    Script de diagnóstico para imprimir y analizar los valores de similitud coseno,
    métricas de habilidades (match_score) y las salidas crudas de las reglas lógicas.
    Inspecciona si el texto basura está inflando los valores semánticos.
    """
    print("=" * 80)
    print("   SISTEMA DE DIAGNÓSTICO DE AFINIDAD Y ANÁLISIS DE TEXTO BASURA (PIVIPP)")
    print("=" * 80)
    
    def limpiar_texto(texto):
        if not isinstance(texto, str):
            return ""
        texto = texto.lower()
        texto = re.sub(re.compile(r'[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]'), ' ', texto)
        texto = re.sub(r'\s+', ' ', texto).strip()
        return texto

    # 1. Limpieza y preparación local
    usr_limpio = limpiar_texto(perfil_texto)
    print(f"\n[ESTUDIANTE] Texto Original: '{perfil_texto}'")
    print(f"[ESTUDIANTE] Texto Limpio:   '{usr_limpio}'")
    print(f"[ESTUDIANTE] Habilidades:    {habilidades_estudiante}")
    
    print("\n[NLP] Inicializando SentenceTransformer para verificación de embeddings...")
    from sentence_transformers import SentenceTransformer
    try:
        model = SentenceTransformer("all-MiniLM-L6-v2")
    except Exception as e:
        print(f"Error cargando el modelo de embeddings: {e}")
        return

    emb_usuario = model.encode([usr_limpio], convert_to_numpy=True, normalize_embeddings=True)[0]
    skills_usr_set = set([s.lower() for s in habilidades_estudiante])

    print("\n" + "-" * 80)
    print(f"{'ID':<4} | {'Título Vacante':<25} | {'Cos Sim':<8} | {'M. Score':<8} | {'Análisis de Reglas / Ruido'}")
    print("-" * 80)

    for v in vacantes_lista:
        v_id = v.get('vacante_id', 0)
        titulo = v.get('titulo', 'Sin título')[:24]
        
        # Construcción del texto de la vacante
        habs_vac_lista = v.get('skills', [])
        texto_v = f"{v.get('titulo', '')} {v.get('area', '')} {v.get('descripcion', '')} {v.get('requisitos', '')} {' '.join(habs_vac_lista)}"
        v_limpio = limpiar_texto(texto_v)
        
        # Inferencia e Vectorización
        emb_v = model.encode([v_limpio], convert_to_numpy=True, normalize_embeddings=True)[0]
        sim_coseno = float(cosine_similarity([emb_usuario], [emb_v])[0][0])
        
        # Coincidencias de habilidades duras de la base de datos
        habs_vac_set = set([s.lower() for s in habs_vac_lista])
        match_score = (len(skills_usr_set.intersection(habs_vac_set)) / max(1, len(habs_vac_set))) * 100
        
        # Evaluación de las Reglas Críticas del Componente del Backend
        alerta_ruido = ""
        regla_applied = "Consenso Estándar"
        
        if sim_coseno < 0.38:
            regla_applied = "R1: Similitud < 0.38 (Posible Basura)"
            if match_score == 0:
                alerta_ruido = "⚠️ TEXTO BASURA DETECTADO (Castigo Drástico del 60%)"
            else:
                alerta_ruido = "💡 Baja semántica pero comparte Skills de BD."
        elif sim_coseno <= 0.48:
            regla_applied = f"R2: Sim <= 0.48 (Rango Controlado)"
            alerta_ruido = "✅ Filtrado correcto o candidato especialista latente."
        elif sim_coseno > 0.48:
            regla_applied = "R_Alta: Sim > 0.48 (Similitud Alta)"
            if match_score < 15.0:
                alerta_ruido = "🚨 ¡ALERTA DE INFLACIÓN! Similitud muy alta provocada por ruido/basura sin habilidades cruzadas."
            else:
                alerta_ruido = "🔥 Coincidencia semántica real legítima."

        print(f"{v_id:<4} | {titulo:<25} | {sim_coseno:.4f}  | {match_score:.1f}%  | {regla_applied} -> {alerta_ruido}")

if __name__ == '__main__':
    # Datos semilla de prueba que simulan tu problema real
    perfil_ejemplo = "Estudiante de Software interesado en desarrollo web y base de datos relacionales"
    skills_ejemplo = ["Python", "PostgreSQL", "React"]
    
    vacantes_prueba = [
        {
            "vacante_id": 1,
            "titulo": "Desarrollador Backend Junior",
            "area": "Tecnología",
            "descripcion": "Buscamos pasante para desarrollo backend con Python, Flask y base de datos PostgreSQL de la Universidad de Guayaquil.",
            "requisitos": "Conocimientos en SQL y Git.",
            "skills": ["Python", "PostgreSQL"]
        },
        {
            "vacante_id": 2,
            "titulo": "Texto Basura Inflado",
            "area": "Cualquier cosa",
            "descripcion": "droi dr dp rojdpojr xckutgtuigto ctriu0 xy4 kk ajhjkaja  a sip",
            "requisitos": "Ninguno, solo palabras repetidas.",
            "skills": ["Ventas", "Atención al cliente"]
        },
        {
            "vacante_id": 3,
            "titulo": "Pasantía de Testing QA",
            "area": "Sistemas",
            "descripcion": "Pruebas de software unitarias y de integración.",
            "requisitos": "Conocimiento básico de desarrollo.",
            "skills": ["QA", "Testing"]
        }
    ]
    
    diagnosticar_similitud(perfil_ejemplo, skills_ejemplo, vacantes_prueba)