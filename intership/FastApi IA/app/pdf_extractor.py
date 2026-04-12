import PyPDF2
import pdfplumber
import re
from typing import Dict, List, Optional
import spacy
from pathlib import Path

nlp = spacy.load("en_core_web_sm")

class CVExtractor:
    def __init__(self):
        self.skill_keywords = {
            'programming_languages': ['Python', 'Java', 'JavaScript', 'C++', 'C#', 'Ruby', 'Go', 'Swift', 'Kotlin', 'PHP', 'TypeScript', 'Scala', 'R'],
            'frameworks': ['React', 'Angular', 'Vue.js', 'Django', 'Spring Boot', 'Flask', 'Express.js', 'Node.js', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
            'databases': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Cassandra', 'Oracle', 'SQL Server', 'Firebase'],
            'cloud': ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Heroku', 'DigitalOcean', 'Kubernetes', 'Docker'],
            'devops': ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Prometheus', 'Grafana'],
            'methodologies': ['Agile', 'Scrum', 'Kanban', 'Waterfall', 'CI/CD', 'DevOps', 'TDD'],
            'languages': ['Arabic', 'English', 'French', 'German', 'Spanish', 'Italian']
        }
        
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
        except:
            try:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    for page in reader.pages:
                        text += page.extract_text() or ""
            except Exception as e:
                print(f"Error extracting text from {pdf_path}: {e}")
        
        return text
    
    def extract_name(self, text: str) -> str:
        """Extract name from CV text"""
        lines = text.split('\n')[:10] 
        for line in lines:
            if re.match(r'^[A-Z]{2,}(?:\s+[A-Z]{2,})+$', line.strip()):
                return line.strip()
            if re.match(r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$', line.strip()):
                return line.strip()
        return "Unknown"
    
    def extract_email(self, text: str) -> str:
        """Extract email from CV text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else ""
    
    def extract_phone(self, text: str) -> str:
        """Extract phone number from CV text"""
        phone_pattern = r'(\+?\d{2,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}'
        phones = re.findall(phone_pattern, text)
        return phones[0] if phones else ""
    
    def extract_skills(self, text: str) -> List[Dict]:
        """Extract skills from CV text"""
        skills_found = []
        text_lower = text.lower()
        
        for category, skills in self.skill_keywords.items():
            for skill in skills:
                if skill.lower() in text_lower:
                    level = self._determine_skill_level(text, skill)
                    skills_found.append({
                        "skillName": skill,
                        "skillLevel": level,
                        "category": category
                    })
        
        unique_skills = {}
        for skill in skills_found:
            if skill["skillName"] not in unique_skills:
                unique_skills[skill["skillName"]] = skill
        
        return list(unique_skills.values())
    
    def _determine_skill_level(self, text: str, skill: str) -> str:
        """Determine skill level based on context words"""
        context_window = 200  
        skill_index = text.lower().find(skill.lower())
        
        if skill_index == -1:
            return "INTERMEDIATE"
        
        start = max(0, skill_index - context_window)
        end = min(len(text), skill_index + context_window)
        context = text[start:end].lower()
        
        if any(word in context for word in ['expert', 'advanced', 'proficient', 'master', 'fluent']):
            return "ADVANCED"
        elif any(word in context for word in ['beginner', 'basic', 'learning', 'novice']):
            return "BEGINNER"
        else:
            return "INTERMEDIATE"
    
    def extract_education(self, text: str) -> Dict:
        """Extract education information"""
        education = {
            "university": "",
            "major": "",
            "degree": "",
            "graduation_year": None,
            "gpa": None
        }
        
        university_pattern = r'(?:University|Institute|School|College)\s+of\s+([A-Za-z\s]+)'
        universities = re.findall(university_pattern, text, re.IGNORECASE)
        if universities:
            education["university"] = universities[0].strip()
        
        major_pattern = r'(?:Major|Degree|Program|Field|Study)[:\s]+([A-Za-z\s]+(?:Engineering|Science|Technology|Development))'
        majors = re.findall(major_pattern, text, re.IGNORECASE)
        if majors:
            education["major"] = majors[0].strip()
        
        year_pattern = r'(?:Graduation|Class of|Expected|20\d{2})\s*[:\-]?\s*(20\d{2})'
        years = re.findall(year_pattern, text)
        if years:
            education["graduation_year"] = int(years[0])
        
        gpa_pattern = r'GPA[:\s]*(\d+\.\d+)'
        gpas = re.findall(gpa_pattern, text, re.IGNORECASE)
        if gpas:
            education["gpa"] = float(gpas[0])
        
        return education
    
    def extract_projects(self, text: str) -> List[str]:
        """Extract project descriptions"""
        projects = []
        
        project_section = re.search(r'(?:Projects|Portfolio|Work Samples)(.*?)(?:Certifications|Education|Skills|$)', 
                                   text, re.IGNORECASE | re.DOTALL)
        
        if project_section:
            project_text = project_section.group(1)
            project_items = re.split(r'[\n•\-*]\s*', project_text)
            projects = [p.strip() for p in project_items if len(p.strip()) > 20][:5]
        
        return projects
    
    def extract_certifications(self, text: str) -> List[str]:
        """Extract certifications"""
        certs = []
        
        cert_pattern = r'(?:Certified|Certificate|Certification)[:\s]+([A-Za-z\s]+(?:Certificate|Certification|Course))'
        certs_found = re.findall(cert_pattern, text, re.IGNORECASE)
        
        if certs_found:
            certs = [c.strip() for c in certs_found]
        
        return certs
    
    def extract_languages(self, text: str) -> List[str]:
        """Extract languages and proficiency"""
        languages = []
        
        for lang in self.skill_keywords['languages']:
            if lang.lower() in text.lower():
                level = self._determine_skill_level(text, lang)
                languages.append(f"{lang}: {level}")
        
        return languages
    
    def extract_achievements(self, text: str) -> List[str]:
        """Extract achievements and awards"""
        achievements = []
        
        achievement_pattern = r'(?:Award|Achievement|Winner|Rank|Position|Recognition)[:\s]+([^\n]+)'
        achievements_found = re.findall(achievement_pattern, text, re.IGNORECASE)
        
        if achievements_found:
            achievements = [a.strip() for a in achievements_found][:5]
        
        return achievements
    
    def parse_cv(self, pdf_path: str) -> Dict:
        """Complete CV parsing"""
        print(f"Parsing: {pdf_path}")
        
        text = self.extract_text_from_pdf(pdf_path)
        
        if not text:
            print(f"Warning: No text extracted from {pdf_path}")
            return {}
        
        cv_data = {
            "name": self.extract_name(text),
            "email": self.extract_email(text),
            "phone": self.extract_phone(text),
            "skills": self.extract_skills(text),
            "education": self.extract_education(text),
            "projects": self.extract_projects(text),
            "certifications": self.extract_certifications(text),
            "languages": self.extract_languages(text),
            "achievements": self.extract_achievements(text),
            "raw_text": text[:500]
        }
        
        return cv_data

def batch_extract_cvs(cv_directory: str = "cvs") -> Dict:
    """Extract data from all CVs in directory"""
    extractor = CVExtractor()
    cv_data = {}
    
    cv_files = Path(cv_directory).glob("*.pdf")
    
    for cv_file in cv_files:
        student_id = cv_file.stem.replace('cv_', '')
        cv_data[student_id] = extractor.parse_cv(str(cv_file))
    
    return cv_data

if __name__ == "__main__":
    extractor = CVExtractor()
    
    all_cv_data = batch_extract_cvs("cvs")
    
    for student_id, data in all_cv_data.items():
        print(f"\n{'='*60}")
        print(f"Student: {student_id}")
        print(f"{'='*60}")
        print(f"Name: {data.get('name', 'N/A')}")
        print(f"Email: {data.get('email', 'N/A')}")
        print(f"Phone: {data.get('phone', 'N/A')}")
        print(f"University: {data.get('education', {}).get('university', 'N/A')}")
        print(f"Major: {data.get('education', {}).get('major', 'N/A')}")
        print(f"Graduation Year: {data.get('education', {}).get('graduation_year', 'N/A')}")
        print(f"\nSkills Found ({len(data.get('skills', []))}):")
        for skill in data.get('skills', [])[:10]:
            print(f"  - {skill['skillName']} ({skill['skillLevel']})")
        print(f"\nProjects: {len(data.get('projects', []))}")
        print(f"Certifications: {len(data.get('certifications', []))}")
        print(f"Languages: {len(data.get('languages', []))}")