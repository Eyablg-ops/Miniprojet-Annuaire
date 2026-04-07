from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Skill(BaseModel):
    id: int
    skillName: str = Field(..., alias="skillName")
    skillLevel: str = Field(..., alias="skillLevel")
    
    class Config:
        populate_by_name = True

class Student(BaseModel):
    id: int
    firstName: str = Field(..., alias="firstName")
    lastName: str = Field(..., alias="lastName")
    major: Optional[str] = None
    university: Optional[str] = None
    graduationYear: Optional[int] = Field(None, alias="graduationYear")
    educationLevel: Optional[str] = Field(None, alias="educationLevel")
    skills: List[Skill] = []
    
    class Config:
        populate_by_name = True

class Company(BaseModel):
    id: int
    name: str
    city: Optional[str] = None
    country: Optional[str] = None
    description: Optional[str] = None
    services: Optional[str] = None

class Internship(BaseModel):
    id: int
    company: Company
    title: str
    description: Optional[str] = None
    requiredSkills: Optional[str] = Field(None, alias="requiredSkills")
    location: Optional[str] = None
    durationMonths: Optional[int] = Field(None, alias="durationMonths")
    startDate: Optional[str] = Field(None, alias="startDate")
    
    @property
    def companyId(self) -> int:
        return self.company.id
    
    class Config:
        populate_by_name = True
        extra = "ignore"

class MatchRequest(BaseModel):
    student_id: int
    limit: Optional[int] = 10

class CompanyMatchRequest(BaseModel):
    company_id: int
    limit: Optional[int] = 10

class MatchScore(BaseModel):
    item_id: int
    score: float
    match_percentage: int
    details: dict

class RecommendationResponse(BaseModel):
    student_id: int
    recommendations: List[MatchScore]
    timestamp: datetime