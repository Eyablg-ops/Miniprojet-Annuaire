# debug_scraper.py — pour comprendre la structure HTML
from bs4 import BeautifulSoup

with open("page1.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

articles = soup.find_all("article")
print(f"Total articles : {len(articles)}")
print("\n--- Analyse du 1er article ---")

if articles:
    first = articles[0]
    print("Texte complet :")
    print(first.get_text(strip=True)[:500])  # 500 premiers caractères
    print("\nClasses de l'article :", first.get("class"))
    print("\nTous les tags h2/h3/h4 :")
    for tag in first.find_all(["h2","h3","h4"]):
        print(f"  <{tag.name} class='{tag.get('class')}'> : {tag.get_text(strip=True)}")
    print("\nTous les <p> :")
    for p in first.find_all("p"):
        print(f"  <p class='{p.get('class')}'> : {p.get_text(strip=True)[:100]}")