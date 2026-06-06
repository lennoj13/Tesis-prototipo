import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import joblib as joblib

# 1. Reconstruir la lista exacta de nombres de columnas en el mismo orden que tu vector
# Tu vector de entrada tiene: [sim_coseno] + [384 de diff_vectorial] + [9 extra_features]
nombres_extra_features = [
    "skill_match_score", 
    "skill_complementarity_score", 
    "network_value_a_to_b", 
    "network_value_b_to_a", 
    "career_alignment_score", 
    "experience_gap", 
    "industry_match", 
    "geographic_score", 
    "seniority_match"
]

# all-MiniLM-L6-v2 genera vectores de 384 dimensiones
dimensiones_embedding = 384 
nombres_diff_vectorial = [f"diff_emb_{i}" for i in range(dimensiones_embedding)]

# Lista maestra de características en orden secuencial
todas_las_columnas = ["sim_coseno"] + nombres_diff_vectorial + nombres_extra_features

# 2. Extraer importancias del RandomForest
# Cambia 'model' por la variable donde tengas cargado tu RandomForest entrenado
model = joblib.load("modelo_recomendacion.pkl")
importancias = model.feature_importances_

# 3. Crear un DataFrame para analizar los resultados con facilidad
df_importancia = pd.DataFrame({
    'Característica': todas_las_columnas,
    'Importancia': importancias
})

# Agrupar las 384 dimensiones de la diferencia vectorial para ver el panorama general
importancia_sim_coseno = df_importancia[df_importancia['Característica'] == 'sim_coseno']['Importancia'].sum()
importancia_diff_vectorial = df_importancia[df_importancia['Característica'].str.startswith('diff_emb_')]['Importancia'].sum()

# Filtrar las extra_features individuales
lineas_extra = df_importancia[df_importancia['Característica'].isin(nombres_extra_features)].copy()

# Crear un resumen ejecutivo resumido
resumen_datos = pd.DataFrame([
    {'Grupo': 'Similitud Coseno (BERT)', 'Importancia Total': importancia_sim_coseno},
    {'Grupo': 'Diferencia Vectorial (BERT)', 'Importancia Total': importancia_diff_vectorial}
])

for idx, row in lineas_extra.iterrows():
    resumen_datos = pd.concat([resumen_datos, pd.DataFrame([{'Grupo': row['Característica'], 'Importancia Total': row['Importancia']}])], ignore_index=True)

resumen_datos = resumen_datos.sort_values(by='Importancia Total', ascending=False)

# 4. Imprimir el diagnóstico en la consola
print("\n==================================================")
print("DIAGNÓSTICO DE IMPORTANCIA DE VARIABLES (PIVIPP)")
print("==================================================")
for idx, row in resumen_datos.iterrows():
    print(f"{row['Grupo']:<30} | {row['Importancia Total']*100:.2f}% de peso")
print("--------------------------------------------------")