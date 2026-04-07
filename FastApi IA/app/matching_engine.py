import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict
import re
from app.config import Config

class EnhancedMatchingEngine:
    def __init__(self):
        self.skills_weight = Config.SKILLS_WEIGHT
        self.education_weight = Config.EDUCATION_WEIGHT
        self.experience_weight = Config.EXPERIENCE_WEIGHT
        self.location_weight = Config.LOCATION_WEIGHT
        self.projects_weight = Config.PROJECTS_WEIGHT
        self.certifications_weight = Config.CERTIFICATIONS_WEIGHT
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        
    def extract_skills_from_student(self, student) -> List[str]:
        """Extract skills from student profile"""
        skills = []
        if hasattr(student, 'skills') and student.skills:
            skills = [skill.skillName.lower() for skill in student.skills]
        return skills
    
    def extract_skills_from_internship(self, internship) -> List[str]:
        """Extract required skills from internship"""
        skills = []
        if hasattr(internship, 'requiredSkills') and internship.requiredSkills:
            skill_items = re.split(r'[,;\n]', internship.requiredSkills.lower())
            skills = [s.strip() for s in skill_items if s.strip()]
        return skills
    
    def calculate_skills_match(self, student_skills: List[str], internship_skills: List[str]) -> float:
        """Advanced skills matching with synonyms and partial matching"""
        if not student_skills or not internship_skills:
            return 0.0
        
        skill_synonyms = {
            'javascript': ['js', 'ecmascript'],
            'python': ['python3', 'python 3'],
            'java': ['java8', 'java 8', 'java11'],
            'react': ['reactjs', 'react.js'],
            'nodejs': ['node', 'node.js'],
            'mongodb': ['mongo', 'mongo db'],
            'spring': ['spring boot', 'spring framework'],
            'aws': ['amazon web services', 'ec2', 's3'],
            'docker': ['container', 'docker container'],
            'kubernetes': ['k8s', 'kube']
        }
        
        match_score = 0
        total_required = len(internship_skills)
        
        for required_skill in internship_skills:
            best_match = 0
            
            if required_skill in student_skills:
                best_match = 1.0
            else:
                for student_skill in student_skills:
                    if required_skill in student_skill or student_skill in required_skill:
                        best_match = max(best_match, 0.7)
                    if required_skill in skill_synonyms:
                        for synonym in skill_synonyms[required_skill]:
                            if synonym in student_skill:
                                best_match = max(best_match, 0.8)
            
            match_score += best_match
        
        return match_score / total_required if total_required > 0 else 0
    
    def calculate_education_match(self, student, internship) -> float:
        """Improved education matching with better level recognition"""
        # Safely get internship text
        internship_text = ""
        if hasattr(internship, 'title'):
            internship_text += internship.title or ""
        if hasattr(internship, 'description'):
            internship_text += " " + (internship.description or "")
        if hasattr(internship, 'requiredSkills'):
            internship_text += " " + (internship.requiredSkills or "")
        internship_text = internship_text.lower()
        
        # Education level mapping
        education_levels = {
            "Bachelor": 1,
            "Engineering": 4,
            "Master": 3,
            "PhD": 5,
            "Licence": 1,
            "Baccalaureate": 0
        }
        
        student_level = education_levels.get(student.educationLevel, 1)
        
        # Level score based on education level
        if student_level >= 4:
            level_score = 1.0
        elif student_level >= 3:
            level_score = 0.9
        elif student_level >= 1:
            level_score = 0.7
        else:
            level_score = 0.4
        
        # Major relevance
        major_relevance = 0.6
        if hasattr(student, 'major') and student.major:
            major_lower = student.major.lower()
            
            if major_lower in internship_text:
                major_relevance = 1.0
            elif 'computer' in major_lower or 'software' in major_lower:
                if any(tech in internship_text for tech in ['developer', 'programming', 'coding']):
                    major_relevance = 0.95
            elif 'data' in major_lower or 'science' in major_lower:
                if any(tech in internship_text for tech in ['data', 'analytics', 'ml', 'ai']):
                    major_relevance = 0.95
        
        return level_score * major_relevance
    
    def calculate_experience_match(self, student, internship=None) -> float:
        """Calculate experience match based on projects and graduation year"""
        from datetime import datetime
        current_year = datetime.now().year
        
        projects_score = 0.4
        if hasattr(student, 'projects') and student.projects:
            relevant_projects = 0
            if internship:
                internship_text = f"{internship.title} {internship.description} {internship.requiredSkills or ''}".lower()
                for project in student.projects[:5]:
                    project_lower = project.lower()
                    if any(tech in project_lower for tech in internship_text.split()[:20]):
                        relevant_projects += 1
            projects_score = min(0.4 + (relevant_projects * 0.15), 1.0)
        
        grad_score = 0.5
        if hasattr(student, 'graduationYear') and student.graduationYear:
            years_until_graduation = student.graduationYear - current_year
            if years_until_graduation <= 0:
                grad_score = 1.0
            elif years_until_graduation <= 1:
                grad_score = 0.9
            elif years_until_graduation <= 2:
                grad_score = 0.7
            elif years_until_graduation <= 3:
                grad_score = 0.5
            else:
                grad_score = 0.3
        
        return (projects_score + grad_score) / 2
    
    def calculate_location_match(self, student, internship) -> float:
        """Calculate location match"""
        return 0.9
    
    def calculate_projects_match(self, student, internship) -> float:
        """Calculate match based on student projects"""
        if not hasattr(student, 'projects') or not student.projects:
            return 0.3
        
        internship_text = f"{internship.title} {internship.description} {internship.requiredSkills or ''}".lower()
        
        keywords = set()
        for word in internship_text.split():
            if len(word) > 3:
                keywords.add(word)
        
        relevance_score = 0
        for project in student.projects[:3]:
            project_text = project.lower()
            matching_keywords = sum(1 for kw in keywords if kw in project_text)
            if matching_keywords > 0:
                relevance_score += min(matching_keywords / len(keywords), 0.5)
        
        return min(relevance_score, 1.0)
    
    def calculate_certifications_match(self, student, internship) -> float:
        """Calculate match based on certifications"""
        if not hasattr(student, 'certifications') or not student.certifications:
            return 0.3
        
        internship_text = f"{internship.title} {internship.description} {internship.requiredSkills or ''}".lower()
        
        relevance_score = 0
        for cert in student.certifications[:3]:
            cert_text = cert.lower()
            if any(tech in internship_text for tech in cert_text.split()[:5]):
                relevance_score += 0.35
        
        return min(relevance_score, 1.0)
    
    def calculate_overall_score(self, student, internship) -> Dict:
        """Calculate overall compatibility score with all factors"""
        student_skills = self.extract_skills_from_student(student)
        internship_skills = self.extract_skills_from_internship(internship)
        
        skills_score = self.calculate_skills_match(student_skills, internship_skills)
        education_score = self.calculate_education_match(student, internship)
        experience_score = self.calculate_experience_match(student, internship)
        location_score = self.calculate_location_match(student, internship)
        projects_score = self.calculate_projects_match(student, internship)
        certifications_score = self.calculate_certifications_match(student, internship)
        
        total_weight = (self.skills_weight + self.education_weight + 
                       self.experience_weight + self.location_weight + 
                       self.projects_weight + self.certifications_weight)
        
        overall_score = (
            skills_score * self.skills_weight +
            education_score * self.education_weight +
            experience_score * self.experience_weight +
            location_score * self.location_weight +
            projects_score * self.projects_weight +
            certifications_score * self.certifications_weight
        ) / total_weight
        
        match_percentage = int(overall_score * 100)
        
        return {
            "overall_score": overall_score,
            "match_percentage": match_percentage,
            "details": {
                "skills_match": round(skills_score * 100, 1),
                "education_match": round(education_score * 100, 1),
                "experience_match": round(experience_score * 100, 1),
                "location_match": round(location_score * 100, 1),
                "projects_match": round(projects_score * 100, 1),
                "certifications_match": round(certifications_score * 100, 1)
            }
        }
    
    def recommend_internships_for_student(self, student, internships: List, limit: int = 10) -> List:
        """Recommend internships for a student with full details"""
        recommendations = []
        
        for internship in internships:
            score_data = self.calculate_overall_score(student, internship)
            if score_data["match_percentage"] >= Config.MIN_MATCH_SCORE:
                recommendations.append({
                    "item_id": internship.id,
                    "score": score_data["overall_score"],
                    "match_percentage": score_data["match_percentage"],
                    "details": score_data["details"],
                    # Add internship details
                    "title": internship.title,
                    "description": internship.description[:200] + "..." if internship.description and len(internship.description) > 200 else internship.description,
                    "required_skills": internship.requiredSkills,
                    "location": internship.location,
                    "duration_months": internship.durationMonths,
                    "start_date": internship.startDate,
                    # Add company details
                    "company_id": internship.company.id if hasattr(internship, 'company') else None,
                    "company_name": internship.company.name if hasattr(internship, 'company') else "Unknown Company",
                    "company_city": internship.company.city if hasattr(internship, 'company') else None,
                    "company_country": internship.company.country if hasattr(internship, 'company') else None
                })
        
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        return recommendations[:limit]
    
    def recommend_students_for_company(self, company, students: List, limit: int = 10) -> List:
        """Recommend students for a company based on company profile"""
        recommendations = []
        
        for student in students:
            # Create a proper internship-like object with required attributes
            class CompanyInternship:
                def __init__(self, company):
                    self.id = company.id
                    self.title = company.name
                    self.description = f"{company.description or ''} {company.services or ''}"
                    self.requiredSkills = company.services or ''
                    self.location = company.city or ''
            
            temp_internship = CompanyInternship(company)
            score_data = self.calculate_overall_score(student, temp_internship)
            
            if score_data["match_percentage"] >= Config.MIN_MATCH_SCORE:
                recommendations.append({
                    "item_id": student.id,
                    "score": score_data["overall_score"],
                    "match_percentage": score_data["match_percentage"],
                    "details": score_data["details"],
                    "student_name": f"{student.firstName} {student.lastName}",
                    "student_major": student.major or 'N/A'
                })
        
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        return recommendations[:limit]
    
    def recommend_companies_for_student(self, student, companies: List, limit: int = 10) -> List:
        """Recommend companies for a student based on their profile"""
        recommendations = []
        
        # Extract student skills
        student_skills = self.extract_skills_from_student(student)
        student_major = student.major.lower() if student.major else ""
        
        print(f"\n{'='*60}")
        print(f"Student {student.id}: {student.firstName} {student.lastName}")
        print(f"Major: {student.major}")
        print(f"Skills ({len(student_skills)}): {', '.join(student_skills[:10])}")
        print(f"{'='*60}")
        
        for company in companies:
            # Parse company services for skill keywords
            company_skills = set()
            if company.services:
                service_text = company.services.lower()
                # Split by common separators
                for separator in [',', ';', '\n']:
                    service_text = service_text.replace(separator, ' ')
                
                # Extract individual words
                words = service_text.split()
                for word in words:
                    word = word.strip()
                    if len(word) > 2 and word not in ['and', 'the', 'for', 'with', 'development', 'services']:
                        company_skills.add(word)
            
            # Calculate skills match
            skills_score = 0
            matched_skills = []
            
            if student_skills:
                for student_skill in student_skills:
                    student_skill_lower = student_skill.lower()
                    for company_skill in company_skills:
                        # Check for matches (exact or partial)
                        if (student_skill_lower == company_skill or 
                            student_skill_lower in company_skill or 
                            company_skill in student_skill_lower):
                            skills_score += 1
                            matched_skills.append(student_skill)
                            break
                
                skills_score = min(skills_score / len(student_skills), 1.0)
            
            # Only process if there's some skill match potential
            if skills_score == 0 and not any(tech in company.services.lower() for tech in ['software', 'development', 'web', 'mobile', 'ai', 'data']):
                continue
            
            # Calculate tech relevance
            tech_keywords = ['software', 'development', 'web', 'mobile', 'java', 'python', 'react', 
                            'node', 'javascript', 'spring', 'ai', 'data', 'cloud', 'devops', 
                            'security', 'docker', 'kubernetes', 'aws', 'machine learning', 'tensorflow']
            
            relevance_score = 0.2
            company_text = f"{company.name} {company.description or ''} {company.services or ''}".lower()
            for tech in tech_keywords:
                if tech in company_text:
                    relevance_score += 0.1
            relevance_score = min(relevance_score, 1.0)
            
            # Calculate domain match
            domain_score = 0.3
            if 'computer' in student_major or 'software' in student_major:
                if any(term in company_text for term in ['software', 'development', 'web', 'mobile', 'java', 'python']):
                    domain_score = 0.9
            elif 'data' in student_major or 'science' in student_major or 'ai' in student_major:
                if any(term in company_text for term in ['data', 'ai', 'machine learning', 'analytics', 'intelligence']):
                    domain_score = 0.9
            elif 'cyber' in student_major or 'security' in student_major:
                if any(term in company_text for term in ['security', 'cyber', 'protection']):
                    domain_score = 0.9
            
            # Calculate other scores
            class TempMatch:
                def __init__(self, company):
                    self.title = company.name
                    self.description = company.description or ''
                    self.requiredSkills = company.services or ''
            
            temp_match = TempMatch(company)
            education_score = self.calculate_education_match(student, temp_match)
            experience_score = self.calculate_experience_match(student, None)
            location_score = 0.9
            
            # Calculate final score
            overall_score = (
                skills_score * 0.50 +      # Skills match (most important)
                domain_score * 0.20 +      # Domain match
                relevance_score * 0.15 +   # Tech relevance
                education_score * 0.05 +   # Education
                experience_score * 0.05 +  # Experience
                location_score * 0.05      # Location
            )
            
            match_percentage = int(overall_score * 100)
            
            # Only include if there's meaningful match
            if match_percentage >= Config.MIN_MATCH_SCORE:
                recommendations.append({
                    "item_id": company.id,
                    "score": overall_score,
                    "match_percentage": match_percentage,
                    "details": {
                        "skills_match": round(skills_score * 100, 1),
                        "domain_match": round(domain_score * 100, 1),
                        "tech_relevance": round(relevance_score * 100, 1),
                        "education_match": round(education_score * 100, 1),
                        "experience_match": round(experience_score * 100, 1),
                        "location_match": round(location_score * 100, 1),
                        "matched_skills": matched_skills[:5]
                    },
                    "company_name": company.name,
                    "company_city": company.city or 'N/A',
                    "company_services": company.services[:150] if company.services else ''
                })
        
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        
        print(f"\nFound {len(recommendations)} recommendations for student {student.id}")
        for rec in recommendations[:5]:
            print(f"  - {rec['company_name']}: {rec['match_percentage']}% (Skills: {rec['details']['skills_match']}%)")
        
        return recommendations[:limit]

matching_engine = EnhancedMatchingEngine()