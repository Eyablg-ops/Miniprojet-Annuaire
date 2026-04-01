# scraper.py — VERSION FINALE CORRIGÉE
from bs4 import BeautifulSoup
import pandas as pd
import os

HTML_FILES = ["page1.html", "page2.html"]

# Villes tunisiennes qu'on veut garder
VILLES_TUNISIE = [
    "Tunis", "Sfax", "Ariana", "Sousse",
    "Nabeul", "Ben Arous", "Bizerte",
    "Kairouan", "Manouba"
]

def scrape_local_file(filepath):
    print(f"\n📄 Lecture de : {filepath}")

    with open(filepath, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    # On cible uniquement les articles avec la classe co-box
    cards = soup.find_all("article", class_="co-box")
    print(f"  → {len(cards)} cartes entreprises trouvées")

    companies = []

    for card in cards:
        company = {}

        # ── Nom ────────────────────────────────────────────────
        name_tag = card.find("p", class_="co-box__name")
        if not name_tag:
            continue
        # Enlever le texte "Verified Company" qui colle au nom
        name_text = name_tag.get_text(strip=True)
        name_text = name_text.replace("Verified Company", "").strip()
        company["name"] = name_text

        # ── Localisation ───────────────────────────────────────
        loc_tag = card.find("p", class_="co-box__loc")
        location_full = loc_tag.get_text(strip=True) if loc_tag else ""

        # Nettoyer : "Tunis,TunisiaHead office in:Nigeria" → "Tunis, Tunisia"
        # On prend seulement la partie avant "Head office"
        if "Head office" in location_full:
            location_full = location_full.split("Head office")[0].strip()

        company["location"] = location_full

        # Extraire la ville
        city = location_full.split(",")[0].strip() if "," in location_full else location_full
        company["city"] = city
        company["country"] = "Tunisie"

        # ── FILTRE : garder seulement les entreprises tunisiennes ──
        is_tunisian = any(ville in location_full for ville in VILLES_TUNISIE)
        if not is_tunisian:
            print(f"  ⏭️  Ignoré (pas tunisien) : {company['name']} — {location_full}")
            continue

        # ── Description ────────────────────────────────────────
        desc_tag = card.find("p", class_="co-box__descr")
        company["description"] = desc_tag.get_text(strip=True) if desc_tag else ""

        # ── Services ───────────────────────────────────────────
        # Les services sont dans des liens <a> après le titre "Services:"
        srv_title = card.find("p", class_="co-box__srv-title")
        services = []
        if srv_title:
            # Chercher tous les liens <a> qui suivent dans la même section
            for a_tag in card.find_all("a"):
                txt = a_tag.get_text(strip=True)
                # Ignorer les liens de navigation ("View profile", "Contact", etc.)
                if txt and txt not in ["View profile", "Contact", "+ See more", "See more"]:
                    services.append(txt)
        company["services"] = ", ".join(services)

        # ── Team size & Hourly Rate ────────────────────────────
        # Chercher les valeurs dans les divs/spans de la carte
        card_text = card.get_text(separator="|", strip=True)
        
        # Team size
        team_size = ""
        if "Team size" in card_text:
            parts = card_text.split("Team size")
            if len(parts) > 1:
                team_size = parts[1].split("|")[1].strip() if "|" in parts[1] else ""
        company["team_size"] = team_size

        companies.append(company)
        print(f"  ✅ {company['name']} — {company['city']}")

    return companies


def main():
    all_companies = []

    for html_file in HTML_FILES:
        if os.path.exists(html_file):
            companies = scrape_local_file(html_file)
            all_companies.extend(companies)
        else:
            print(f"⚠️  Fichier introuvable : {html_file}")

    if all_companies:
        df = pd.DataFrame(all_companies)
        # Supprimer les doublons par nom
        df = df.drop_duplicates(subset=["name"])
        df.to_csv("companies_raw.csv", index=False, encoding="utf-8")
        print(f"\n🎉 {len(all_companies)} entreprises tunisiennes → companies_raw.csv")
        print("\nAperçu :")
        print(df[["name", "city", "services"]].to_string())
    else:
        print("\n❌ Aucune entreprise tunisienne trouvée")


if __name__ == "__main__":
    main()