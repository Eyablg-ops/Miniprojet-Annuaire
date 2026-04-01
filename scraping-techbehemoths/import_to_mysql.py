# import_to_mysql.py
import pandas as pd
import mysql.connector

# Connexion à MAMP MySQL
conn = mysql.connector.connect(
    host="127.0.0.1",
    port=8889,          # Port par défaut MAMP
    user="root",
    password="root",    # Mot de passe par défaut MAMP
    database="internship_db"
)
cursor = conn.cursor()

# Charger le CSV propre
df = pd.read_csv("companies_clean.csv")

# Insérer chaque ligne
inserted = 0
for _, row in df.iterrows():
    sql = """
        INSERT INTO annuaire_company (name, city, country, description, services, status)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (
        row["name"],
        row["city"],
        row["country"],
        row["description"],
        row["services"],
        str(row["status"]).upper()
    )
    try:
        cursor.execute(sql, values)
        inserted += 1
    except Exception as e:
        print(f"⚠️  Erreur pour {row['name']} : {e}")

conn.commit()
cursor.close()
conn.close()

print(f"✅ {inserted} entreprises importées dans MySQL !")