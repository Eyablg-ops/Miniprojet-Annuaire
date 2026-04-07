class Config:
    API_VERSION = "v1"
    API_TITLE = "InternMatch AI Recommendation Engine"
    
    SKILLS_WEIGHT = 0.45      
    EDUCATION_WEIGHT = 0.20   
    EXPERIENCE_WEIGHT = 0.15  
    LOCATION_WEIGHT = 0.05    
    PROJECTS_WEIGHT = 0.10    
    CERTIFICATIONS_WEIGHT = 0.05
    
    MIN_MATCH_SCORE = 20  
    
    SPRING_BOOT_API_URL = "http://localhost:8080/api"