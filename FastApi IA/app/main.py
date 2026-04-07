from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import httpx
from datetime import datetime
import logging

from app.config import Config
from app.schemas import *
from app.matching_engine import matching_engine

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=Config.API_TITLE,
    version=Config.API_VERSION
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HTTP client for Spring Boot API
client = httpx.AsyncClient(timeout=30.0)

async def fetch_student_data(student_id: int):
    """Fetch student data from Spring Boot API"""
    try:
        url = f"{Config.SPRING_BOOT_API_URL}/recommendation/student/{student_id}"
        logger.info(f"Fetching student from: {url}")
        response = await client.get(url)
        logger.info(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"Student found: {data.get('firstName', 'Unknown')}")
            return data
        else:
            logger.error(f"Student not found: {response.status_code}")
            return None
    except Exception as e:
        logger.error(f"Error fetching student data: {e}")
        return None

async def fetch_all_internships():
    """Fetch all internships from Spring Boot API"""
    try:
        url = f"{Config.SPRING_BOOT_API_URL}/recommendation/internships"
        response = await client.get(url)
        if response.status_code == 200:
            data = response.json()
            logger.info(f"Fetched {len(data)} internships")
            return data
        return []
    except Exception as e:
        logger.error(f"Error fetching internships: {e}")
        return []

async def fetch_all_companies():
    """Fetch all companies from Spring Boot API"""
    try:
        url = f"{Config.SPRING_BOOT_API_URL}/recommendation/companies"
        response = await client.get(url)
        if response.status_code == 200:
            data = response.json()
            logger.info(f"Fetched {len(data)} companies")
            return data
        return []
    except Exception as e:
        logger.error(f"Error fetching companies: {e}")
        return []

async def fetch_all_students():
    """Fetch all students from Spring Boot API"""
    try:
        url = f"{Config.SPRING_BOOT_API_URL}/recommendation/students"
        response = await client.get(url)
        if response.status_code == 200:
            data = response.json()
            logger.info(f"Fetched {len(data)} students")
            return data
        return []
    except Exception as e:
        logger.error(f"Error fetching students: {e}")
        return []

async def fetch_company_data(company_id: int):
    """Fetch company data from Spring Boot API"""
    try:
        url = f"{Config.SPRING_BOOT_API_URL}/recommendation/company/{company_id}"
        response = await client.get(url)
        if response.status_code == 200:
            data = response.json()
            logger.info(f"Company found: {data.get('name', 'Unknown')}")
            return data
        return None
    except Exception as e:
        logger.error(f"Error fetching company data: {e}")
        return None

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    logger.info("AI Recommendation Engine Started")
    # Test connection
    try:
        test_response = await client.get(f"{Config.SPRING_BOOT_API_URL}/public/companies")
        if test_response.status_code == 200:
            logger.info("✅ Connected to Spring Boot backend")
        else:
            logger.warning("⚠️ Cannot connect to Spring Boot backend")
    except Exception as e:
        logger.error(f"❌ Failed to connect to Spring Boot: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    await client.aclose()

@app.get("/")
async def root():
    return {
        "service": "InternMatch AI Recommendation Engine",
        "version": Config.API_VERSION,
        "status": "running"
    }

@app.post("/recommend/student-to-internships")
async def recommend_internships_for_student(request: MatchRequest):
    """Recommend internships for a student"""
    try:
        logger.info(f"Processing request for student {request.student_id}")
        
        # Fetch student data
        student_data = await fetch_student_data(request.student_id)
        if not student_data:
            raise HTTPException(status_code=404, detail=f"Student {request.student_id} not found")
        
        # Fetch all internships
        internships_data = await fetch_all_internships()
        if not internships_data:
            return {
                "student_id": request.student_id,
                "recommendations": [],
                "timestamp": datetime.now().isoformat()
            }
        
        # Convert to Pydantic models (camelCase support)
        student = Student(**student_data)
        internships = [Internship(**inv) for inv in internships_data]
        
        # Get recommendations
        recommendations = matching_engine.recommend_internships_for_student(
            student, internships, request.limit
        )
        
        logger.info(f"Found {len(recommendations)} recommendations")
        
        return {
            "student_id": request.student_id,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in recommend_internships: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/student-to-companies")
async def recommend_companies_for_student(request: MatchRequest):
    """Recommend companies for a student"""
    try:
        logger.info(f"Processing company recommendations for student {request.student_id}")
        
        student_data = await fetch_student_data(request.student_id)
        if not student_data:
            raise HTTPException(status_code=404, detail=f"Student {request.student_id} not found")
        
        companies_data = await fetch_all_companies()
        if not companies_data:
            return {
                "student_id": request.student_id,
                "recommendations": [],
                "timestamp": datetime.now().isoformat()
            }
        
        student = Student(**student_data)
        companies = [Company(**comp) for comp in companies_data]
        
        recommendations = matching_engine.recommend_companies_for_student(
            student, companies, request.limit
        )
        
        logger.info(f"Found {len(recommendations)} company recommendations")
        
        return {
            "student_id": request.student_id,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in recommend_companies: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/company-to-students")
async def recommend_students_for_company(request: CompanyMatchRequest):
    """Recommend students for a company"""
    try:
        logger.info(f"Processing student recommendations for company {request.company_id}")
        
        company_data = await fetch_company_data(request.company_id)
        if not company_data:
            raise HTTPException(status_code=404, detail=f"Company {request.company_id} not found")
        
        students_data = await fetch_all_students()
        if not students_data:
            return {
                "student_id": request.company_id,
                "recommendations": [],
                "timestamp": datetime.now().isoformat()
            }
        
        company = Company(**company_data)
        students = [Student(**stu) for stu in students_data]
        
        recommendations = matching_engine.recommend_students_for_company(
            company, students, request.limit
        )
        
        logger.info(f"Found {len(recommendations)} student recommendations")
        
        return {
            "company_id": request.company_id,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in recommend_students: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)