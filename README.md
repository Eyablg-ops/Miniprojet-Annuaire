# Miniprojet - Annuaire Sociétés & Administration
voici le contenu que je dois mettre # 🏢 Annuaire Sociétés & Administration — Person 4

## 📌 Description
Module d'annuaire des sociétés tech tunisiennes avec interface 
d'administration, développé dans le cadre d'un mini-projet de 
plateforme de stages.

## 🛠️ Stack Technique
| Composant | Technologie |
|-----------|-------------|
| Scraping | Python, BeautifulSoup, Selenium |
| Nettoyage | Pandas |
| Base de données | MySQL (MAMP) |
| Back-end | Spring Boot 3.5, Java 25, JPA/Hibernate |
| Front-end | React, Ant Design, Axios |


## 🚀 Lancement

### Prérequis
- Python 3.9+
- Java 25
- Node.js 18+
- MAMP (MySQL port 8889)

### 1. Base de données
```sql
CREATE DATABASE internship_db;
```

### 2. Scraping et import
```bash
cd scraping-techbehemoths
source venv/bin/activate
python3 scraper.py
python3 clean_data.py
python3 import_to_mysql.py
```

### 3. Back-end Spring Boot
```bash
cd annuaire-service
./mvnw spring-boot:run
# API disponible sur http://localhost:8082
```

### 4. Front-end React
```bash
cd annuaire-frontend
npm install
npm start
# App disponible sur http://localhost:3000
```

## 🌐 Endpoints API
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | /api/annuaire/companies | Toutes les entreprises |
| GET | /api/annuaire/companies?name=X&city=Y | Recherche filtrée |
| GET | /api/annuaire/companies/{id} | Une entreprise |
| POST | /api/annuaire/companies | Créer |
| PUT | /api/annuaire/companies/{id} | Modifier |
| DELETE | /api/annuaire/companies/{id} | Supprimer |
| GET | /api/annuaire/stats | Statistiques |

## 📊 Données
- **Source** : TechBehemoths.com
- **32 entreprises** tunisiennes collectées


## 👤 Auteur
Eya Bouallegue  — ING A2 — 2026
