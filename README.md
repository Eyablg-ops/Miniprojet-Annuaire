# 🤖 InternMatch AI Recommendation Engine

## 📋 Overview

The InternMatch AI Recommendation Engine is a **hybrid content-based recommendation system** that intelligently matches students with internships and companies, and vice versa.

It combines:
- Machine Learning (TF-IDF + cosine similarity)
- Rule-based scoring
- NLP techniques

to provide **accurate, fast, and explainable recommendations**.

The system analyzes multiple dimensions such as **skills, education, experience, projects, certifications, and location** to compute a global compatibility score between entities.

---

## 🎯 Features

### Core Capabilities
- **Student → Internship Recommendations**
- **Student → Company Recommendations**
- **Company → Student Recommendations**

### Key Features
- 🔍 Skills-based matching with synonym recognition  
- 📊 Weighted multi-factor scoring  
- 📝 NLP using TF-IDF + cosine similarity  
- ⚡ Real-time recommendations (no training needed)  
- 📖 Explainable results (detailed breakdown)  
- 🎨 Easily customizable  

---

## 🎯 Objectives

- Improve internship matching accuracy  
- Automate candidate selection  
- Provide explainable recommendations  
- Enable real-time decision support  

---

## 🧠 AI Model Description

The system uses a **hybrid content-based recommendation model**, which integrates:

- **Text-based similarity (TF-IDF + cosine similarity)**  
- **Rule-based scoring system**  
- **Skill normalization using synonym matching**  

Unlike collaborative filtering systems, this model does **not depend on user interaction history**, making it suitable for cold-start scenarios (new students or companies).

---

## ⚙️ Algorithms & Techniques

### 1. Text Vectorization (TF-IDF)
Transforms textual data (skills, descriptions, profiles) into numerical vectors representing term importance.

### 2. Cosine Similarity
Measures the similarity between two vectors (e.g., student profile vs internship description).

### 3. Keyword Extraction
Identifies relevant skills and concepts from:
- CVs
- Internship descriptions
- Company requirements

### 4. Synonym Matching
Handles variations in skill naming:
- Example: *"React" = "React.js"*

### 5. Weighted Scoring System
Combines multiple criteria into a final score.

---

## 📊 Scoring Weights

```python
SKILLS_WEIGHT = 0.45
EDUCATION_WEIGHT = 0.20
EXPERIENCE_WEIGHT = 0.15
LOCATION_WEIGHT = 0.05
PROJECTS_WEIGHT = 0.10
CERTIFICATIONS_WEIGHT = 0.05
```

## 🧮 Scoring Formula
Overall Score =
(Skills × 0.45) +
(Education × 0.20) +
(Experience × 0.15) +
(Location × 0.05) +
(Projects × 0.10) +
(Certifications × 0.05)

## 🏗️ System Integration
The AI engine is part of a larger system:
- Frontend (React): User interface & dashboards
- Backend (Spring Boot): Data management & APIs
- AI Engine (FastAPI): Recommendation logic

## 🔄 Recommendation Flow
Retrieve student/company/internship data
Extract and normalize features (skills, education, etc.)
Convert text into vectors (TF-IDF)
Compute similarity scores
Apply weighted scoring
Rank results
Return top recommendations

## 🚀 Installation
Prerequisites
Python 3.9+
pip
Spring Boot backend (port 8080)

## 📦 Dependencies
fastapi
uvicorn
pydantic
scikit-learn
numpy
httpx
PyPDF2
pdfplumber
spacy