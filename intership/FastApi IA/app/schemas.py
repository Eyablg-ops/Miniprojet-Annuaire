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

class Offer(BaseModel):
    id: int
    company: Company
    title: str
    description: Optional[str] = None
    requiredSkills: Optional[str] = Field(None, alias="requiredSkills")
    location: Optional[str] = None
    duration: Optional[int] = None  # Changed from durationMonths to duration
    type: Optional[str] = None  # "PFE", "PFA", "Stage été"
    domain: Optional[str] = None
    deadline: Optional[str] = None
    status: Optional[str] = None
    
    @property
    def companyId(self) -> int:
        return self.company.id
    
    @property
    def duration_months(self) -> Optional[int]:
        return self.duration
    
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