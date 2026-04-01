# clean_data.py — VERSION ADAPTÉE
import pandas as pd

df = pd.read_csv("companies_raw.csv")
print(f"Avant nettoyage : {len(df)} entreprises")

# ── 1. Nettoyer la colonne services ───────────────────────────
# Problème : "ZetaBoxVerified Company, Sfax, Tunisia, Web Development..."
# On veut garder seulement ce qui vient APRÈS "Tunisia, "

def clean_services(services_raw):
    if pd.isna(services_raw) or services_raw == "":
        return ""
    # Supprimer tout ce qui est avant "Tunisia, "
    if "Tunisia," in services_raw:
        services_raw = services_raw.split("Tunisia,", 1)[1].strip()
    # Supprimer "Verified Company"
    services_raw = services_raw.replace("Verified Company", "").strip()
    # Nettoyer les virgules doubles
    parts = [s.strip() for s in services_raw.split(",") if s.strip()]
    return ", ".join(parts)

df["services"] = df["services"].apply(clean_services)

# ── 2. Nettoyer le nom ────────────────────────────────────────
df["name"] = df["name"].str.replace("Verified Company", "").str.strip()

# ── 3. Supprimer les doublons ─────────────────────────────────
df = df.drop_duplicates(subset=["name"])

# ── 4. Remplir les valeurs manquantes ────────────────────────
df["description"] = df["description"].fillna("").str.strip()
df["services"]    = df["services"].fillna("")
df["city"]        = df["city"].fillna("Tunisie")
df["country"]     = "Tunisie"
df["status"]      = "active"

# ── 5. Garder seulement les colonnes utiles ───────────────────
df = df[["name", "city", "country", "description", "services", "team_size", "status"]]

print(f"Après nettoyage : {len(df)} entreprises")
print("\nAperçu propre :")
print(df[["name", "city", "services"]].to_string())

df.to_csv("companies_clean.csv", index=False, encoding="utf-8")
print("\n✅ Sauvegardé : companies_clean.csv")