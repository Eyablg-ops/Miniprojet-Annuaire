# 🎓 ISSAT Sousse - Plateforme de Gestion de Stages

## 📋 Vue d'ensemble

La plateforme **ISSAT Sousse - Gestion de Stages** est une solution complète qui connecte les étudiants, les entreprises et les enseignants pour faciliter la recherche et la gestion des stages. Elle intègre un **moteur de recommandation intelligent basé sur l'IA** pour proposer des offres personnalisées.

---

## 🎯 Objectifs du projet

- ✅ Faciliter la mise en relation entre étudiants et entreprises
- ✅ Automatiser le suivi des candidatures et des stages
- ✅ Proposer des recommandations intelligentes et personnalisées
- ✅ Centraliser la gestion des offres, des utilisateurs et des candidatures
- ✅ Fournir une interface moderne et intuitive pour chaque type d'utilisateur

---

## 👥 Types d'utilisateurs

### 🎓 Étudiant
- Création et gestion de profil
- Upload de CV et photo de profil
- Ajout de compétences
- Consultation des offres de stage
- Candidature aux offres
- Suivi des candidatures (statut : en attente, acceptée, rejetée)
- Recommandations IA d'offres et d'entreprises

### 🏢 Recruteur / Entreprise
- Gestion du profil entreprise
- Publication d'offres de stage
- Consultation des candidatures reçues
- Gestion des statuts des candidatures
- Recherche de talents par compétences
- Accès aux recommandations IA

### 👨‍🏫 Enseignant
- Consultation des étudiants et des stages
- Suivi pédagogique (à venir)
- Évaluation des rapports de stage (à venir)

### 👑 Administrateur
- Gestion des utilisateurs (activation/désactivation/suppression)
- Gestion des entreprises
- Consultation de toutes les offres et candidatures
- Supervision globale de la plateforme

---

## 🧠 Moteur de Recommandation IA

### Modèle utilisé

**Système de recommandation hybride basé sur le contenu** combinant :

| Technique | Description |
|-----------|-------------|
| **TF-IDF** | Transformation du texte en vecteurs numériques |
| **Cosine Similarity** | Calcul de similarité entre profils |
| **Keyword Extraction** | Extraction automatique des compétences |
| **Synonym Matching** | Reconnaissance des variations de termes |
| **Weighted Scoring** | Score global pondéré |

### Formule de calcul

Overall Score =
(Skills × 0.45) +
(Education × 0.20) +
(Experience × 0.15) +
(Location × 0.05) +
(Projects × 0.10) +
(Certifications × 0.05)

### Types de recommandations

| Endpoint | Description |
|----------|-------------|
| `/recommend/student-to-offers` | Recommandation d'offres pour un étudiant |
| `/recommend/student-to-companies` | Recommandation d'entreprises pour un étudiant |
| `/recommend/company-to-students` | Recommandation d'étudiants pour une entreprise |

---

## 🛠️ Technologies utilisées

### Frontend
| Technologie | Utilisation |
|-------------|-------------|
| **React 18** | Bibliothèque UI |
| **Ant Design** | Composants d'interface |
| **Axios** | Requêtes HTTP |
| **React Router DOM** | Navigation |
| **CSS3** | Styles et animations |

### Backend (Spring Boot)
| Technologie | Utilisation |
|-------------|-------------|
| **Java 11/17** | Langage principal |
| **Spring Boot** | Framework backend |
| **Spring Security** | Authentification JWT |
| **Spring Data JPA** | ORM |
| **MySQL** | Base de données |
| **Maven** | Gestion des dépendances |

### Moteur IA (Python)
| Technologie | Utilisation |
|-------------|-------------|
| **Python 3.9+** | Langage principal |
| **FastAPI** | Framework API |
| **scikit-learn** | TF-IDF, Cosine Similarity |
| **PyPDF2 / pdfplumber** | Extraction de CV |
| **spaCy** | NLP (traitement du texte) |
| **Uvicorn** | Serveur ASGI |

---

## 📊 Structure de la base de données

### Principales tables

| Table | Description |
|-------|-------------|
| `users` | Authentification et comptes utilisateurs |
| `students` | Profils étudiants (formation, compétences) |
| `recruiters` | Profils recruteurs (entreprise associée) |
| `enseignants` | Profils enseignants (encadrement) |
| `companies` | Annuaire des entreprises |
| `offers` | Offres de stage (PFE, PFA, stage été) |
| `postulations` | Candidatures des étudiants |
| `skills` | Compétences des étudiants |


## 📈 Améliorations futures
- 🤖 Amélioration du modèle IA (deep learning)
- 📊 Dashboard analytique avancé
- 📱 Application mobile
- 🌐 Internationalisation (anglais/arabe)
- 🔔 Notifications en temps réel
- 📧 Envoi d'emails automatiques
- 🎯 Matching avancé par CV parsé


## 👥 Équipe projet
- Chef de projet - Coordination et supervision
- Développeur Backend - Spring Boot, API REST, JWT
- Développeur Frontend - React, Ant Design
- Ingénieur IA - FastAPI, scikit-learn, NLP