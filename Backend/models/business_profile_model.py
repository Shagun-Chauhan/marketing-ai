from typing import List, Optional
from datetime import datetime

class BusinessProfileModel:
    """Representation of the Business Profile document in MongoDB"""
    def __init__(self, **kwargs):
        self.business_name: str = kwargs.get("business_name")
        self.business_type: str = kwargs.get("business_type")
        self.business_description: str = kwargs.get("business_description")
        self.years_in_business: str = kwargs.get("years_in_business")
        self.target_audience: List[str] = kwargs.get("target_audience", [])
        self.business_goals: List[str] = kwargs.get("business_goals", [])
        self.platforms: List[str] = kwargs.get("platforms", [])
        self.location: str = kwargs.get("location")
        self.tone: List[str] = kwargs.get("tone", [])
        self.website: Optional[str] = kwargs.get("website")
        self.contact_email: Optional[str] = kwargs.get("contact_email")
        self.updated_at: datetime = kwargs.get("updated_at", datetime.utcnow())