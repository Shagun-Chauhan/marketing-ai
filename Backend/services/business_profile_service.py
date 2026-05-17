from schemas.business_profile_schema import BusinessProfileCreate, BusinessProfileUpdate
from datetime import datetime

class BusinessProfileService:
    _mock_storage = None

    @staticmethod
    async def get_profile():
        return BusinessProfileService._mock_storage

    @staticmethod
    async def create_or_update_profile(profile_data: BusinessProfileCreate):
        profile_dict = profile_data.dict()
        profile_dict["updated_at"] = datetime.utcnow()
        
        BusinessProfileService._mock_storage = profile_dict
        return profile_dict

    @staticmethod
    async def update_partial_profile(profile_data: BusinessProfileUpdate):
        if BusinessProfileService._mock_storage is None:
            BusinessProfileService._mock_storage = {}
            
        update_data = {k: v for k, v in profile_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        BusinessProfileService._mock_storage.update(update_data)
        return await BusinessProfileService.get_profile()