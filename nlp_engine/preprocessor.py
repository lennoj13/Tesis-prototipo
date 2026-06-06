import pandas as pd
import numpy as np
import re
import json
import nltk
import spacy
import warnings
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score
)
import joblib
warnings.filterwarnings("ignore")

#####################################################
# DESCARGAS NLP
#####################################################
nltk.download("stopwords")
stop_words = set(stopwords.words("english"))
nlp = spacy.load(
    "en_core_web_sm", disable= ["parser", "ner"]
)

#####################################################
# CARGA DE DATOS
#####################################################
print("\nCargando datasets...\n")
#datasets:
profiles = pd.read_csv("data/profiles.csv")
pairs = pd.read_csv("data/compatibility_pairs.csv")
print("Profiles shape:", profiles.shape)
print("Pairs shape:", pairs.shape)

#####################################################
# SAMPLING INTELIGENTE
#####################################################

MAX_PAIRS = 200000
if len(pairs) > MAX_PAIRS:
    print(
        f"\nReduciendo dataset de {len(pairs):,} "
        f"a {MAX_PAIRS:,} pares..."
    )
    pairs = pairs.sample(n=MAX_PAIRS, random_state=42)

#####################################################
# EXPLORACION
#####################################################
print("\n==============================")
print("NULOS")
print("==============================")
print(profiles.isnull().sum())
print(pairs.isnull().sum())

print("\n==============================")
print("DUPLICADOS")
print("==============================")
print("Profiles duplicados:", profiles.duplicated().sum())
print("Pairs duplicados:", pairs.duplicated().sum())

#####################################################
# LIMPIEZA DE DUPLICADOS
#####################################################

profiles = profiles.drop_duplicates()
pairs = pairs.drop_duplicates()

# Crear un acceso rápido a los metadatos de los perfiles para la fase de recomendación
profiles_indexed = profiles.set_index("profile_id")

#####################################################
# FUNCIONES NLP
#####################################################

def limpiar_texto(texto):
    if pd.isnull(texto):
        return ""

    texto = str(texto).lower()
    texto = re.sub(r"http\S+", "", texto)
    texto = re.sub(r"[^a-zA-Z\s]", " ", texto)
    texto = re.sub(r"\s+", " ", texto)

    doc = nlp(texto)
    tokens = []

    for token in doc:
        if (
            token.text not in stop_words
            and not token.is_punct
            and len(token.text) > 2
        ):
            tokens.append(token.lemma_)
    return " ".join(tokens)

#####################################################
# PARSEO JSON
#####################################################
def parse_json_column(data):
    try:
        if pd.isnull(data):
            return ""

        parsed = json.loads(data)
        if isinstance(parsed, list):
            textos = []
            for item in parsed:
                if isinstance(item, dict):
                    textos.extend(
                        [str(v) for v in item.values()]
                    )
                else:
                    textos.append(str(item))
            return " ".join(textos)
        return str(parsed)
    except:
        return ""

#####################################################
# TRANSFORMACION DE COLUMNAS
#####################################################
print("\nProcesando texto NLP...\n")

text_columns = [
    "current_role",
    "current_company",
    "industry",
    "seniority_level"
]

for col in text_columns:
    profiles[col] = profiles[col].fillna("")

#####################################################
# COLUMNAS JSON
#####################################################

json_columns = [
    "skills",
    "experience",
    "education",
    "goals",
    "needs",
    "can_offer"
]

for col in json_columns:
    profiles[col + "_text"] = profiles[col].apply(parse_json_column)

#####################################################
# CREACION PERFIL COMPLETO
#####################################################

profiles["perfil_texto"] = (
    profiles["current_role"] + " " +
    profiles["current_company"] + " " +
    profiles["industry"] + " " +
    profiles["seniority_level"] + " " +
    profiles["skills_text"] + " " +
    profiles["experience_text"] + " " +
    profiles["education_text"] + " " +
    profiles["goals_text"] + " " +
    profiles["needs_text"] + " " +
    profiles["can_offer_text"]
)

#####################################################
# LIMPIEZA NLP
#####################################################

profiles["perfil_limpio"] = profiles["perfil_texto"].apply(
    limpiar_texto
)

print("\nTexto procesado correctamente.")
#####################################################
# EMBEDDINGS
#####################################################

print("\nGenerando embeddings semánticos...\n")
embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

embeddings = embedding_model.encode(
    profiles["perfil_limpio"].tolist(),
    batch_size=64,
    show_progress_bar=True,
    convert_to_numpy=True,
    normalize_embeddings=True
)
# Aseguramos que los embeddings sean de tipo float32 para eficiencia
embeddings = embeddings.astype(np.float32)

print("Embeddings shape:", embeddings.shape)

#####################################################
# DICCIONARIO ID -> EMBEDDING
#####################################################

profile_embedding_dict = {}

for idx, row in profiles.iterrows():
    profile_embedding_dict[
        row["profile_id"]
    ] = embeddings[idx]

#####################################################
# FEATURE ENGINEERING
#####################################################

print("\nConstruyendo features...\n")

features = []
targets = []

for idx, row in pairs.iterrows():
    id_a = row["profile_a_id"]
    id_b = row["profile_b_id"]

    if (
        id_a not in profile_embedding_dict
        or
        id_b not in profile_embedding_dict
    ):
        continue

    emb_a = profile_embedding_dict[id_a]
    emb_b = profile_embedding_dict[id_b]

    #################################################
    # SIMILITUD COSENO
    #################################################
    sim = cosine_similarity(
        [emb_a], [emb_b]
    )[0][0]

    #################################################
    # DIFERENCIA VECTORIAL
    #################################################
    diff = np.abs(emb_a - emb_b)

    #################################################
    # FEATURES NUMERICAS
    #################################################
    feature_vector = np.concatenate([
        [sim],
        diff,
        [
            row["skill_match_score"],
            row["skill_complementarity_score"],
            row["network_value_a_to_b"],
            row["network_value_b_to_a"],
            row["career_alignment_score"],
            row["experience_gap"],
            row["industry_match"],
            row["geographic_score"],
            row["seniority_match"]
        ]
    ])

    features.append(feature_vector)
    targets.append(
        row["compatibility_score"]
    )


#Construimos matrices numpy para entrenamiento
X = np.array(features, dtype=np.float32)
y = np.array(targets, dtype=np.float32)

print("X shape:", X.shape)
print("y shape:", y.shape)

#####################################################
# ESCALADO
#####################################################

print("\nEscalando datos...\n")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

#####################################################
# TRAIN TEST SPLIT
#####################################################

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

#####################################################
# ENTRENAMIENTO
#####################################################

print("\nEntrenando modelo...\n")
model = RandomForestRegressor(
    n_estimators=50,
    max_depth=12,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

#####################################################
# PREDICCIONES
#####################################################
print("\nRealizando predicciones...\n")
preds = model.predict(X_test)

#####################################################
# EVALUACION
#####################################################
print("\nEvaluacion ")
mse = mean_squared_error(y_test, preds)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)

print("\n==============================")
print("RESULTADOS")
print("==============================")

print(f"MSE  : {mse:.4f}")
print(f"RMSE : {rmse:.4f}")
print(f"MAE  : {mae:.4f}")
print(f"R2   : {r2:.4f}")

#####################################################
# GUARDAR MODELO
#####################################################

print("\nGuardando modelo...\n")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(model, "modelo_recomendacion.pkl")

print("\nModelo guardado correctamente.")