from fastapi import APIRouter, HTTPException, status
from schemas.business_profile_schema import BusinessProfileCreate, BusinessProfileUpdate, BusinessProfileResponse
from services.business_profile_service import BusinessProfileService

router = APIRouter(prefix="/api/business-profile", tags=["Business Profile"])

@router.get("/", response_model=BusinessProfileResponse)
async def get_profile():
    """Get the current business profile context"""
    profile = await BusinessProfileService.get_profile()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Business profile not found. Please create one."
        )
    return profile

@router.post("/", response_model=BusinessProfileResponse)
async def save_profile(profile: BusinessProfileCreate):
    """Create or update the business profile"""
    return await BusinessProfileService.create_or_update_profile(profile)

@router.patch("/", response_model=BusinessProfileResponse)
async def update_profile(profile: BusinessProfileUpdate):
    """Partially update the business profile"""
    updated_profile = await BusinessProfileService.update_partial_profile(profile)
    if not updated_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return updated_profile