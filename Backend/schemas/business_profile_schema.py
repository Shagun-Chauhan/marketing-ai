from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

class BusinessProfileBase(BaseModel):
    business_name: str = Field(..., example="The Daily Grind")
    business_type: str = Field(..., example="Cafe")
    business_description: str = Field(..., example="A cozy neighborhood cafe focused on specialty coffee.")
    years_in_business: str = Field(..., example="3-5 Years")
    target_audience: List[str] = Field(default=[], example=["Students", "Freelancers"])
    business_goals: List[str] = Field(default=[], example=["Increase Sales", "Brand Awareness"])
    platforms: List[str] = Field(default=[], example=["Instagram", "Facebook"])
    location: str = Field(..., example="New York")
    tone: List[str] = Field(default=[], example=["Friendly", "Modern"])
    website: Optional[str] = None
    contact_email: Optional[EmailStr] = None

class BusinessProfileCreate(BusinessProfileBase):
    pass

class BusinessProfileUpdate(BaseModel):
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    business_description: Optional[str] = None
    years_in_business: Optional[str] = None
    target_audience: Optional[List[str]] = None
    business_goals: Optional[List[str]] = None
    platforms: Optional[List[str]] = None
    location: Optional[str] = None
    tone: Optional[List[str]] = None
    website: Optional[str] = None

class BusinessProfileResponse(BusinessProfileBase):
    pass