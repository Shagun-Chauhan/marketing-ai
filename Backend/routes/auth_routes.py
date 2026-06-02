from fastapi import APIRouter
from models.auth_schemas import (
    SignupRequest, OtpRequest, ResendRequest,
    ForgotPasswordRequest, ResetPasswordRequest,
    EmailPasswordRequest, DirectLoginRequest
)
from services.auth_service import (
    service_signup_send_otp, service_signup_verify_otp,
    service_direct_login,
    service_login_send_otp, service_login_verify_otp,
    service_resend_otp,
    service_forgot_send_otp, service_forgot_verify_otp,
    service_reset_password
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup/send-otp")
def signup_send_otp(req: SignupRequest):
    return service_signup_send_otp(req.name, req.email.lower(), req.password)

@router.post("/signup/verify-otp")
def signup_verify_otp(req: OtpRequest):
    return service_signup_verify_otp(req.email.lower(), req.otp)

@router.post("/login")
def direct_login(req: DirectLoginRequest):
    return service_direct_login(req.email.lower(), req.password)

@router.post("/login/send-otp")
def login_send_otp(req: EmailPasswordRequest):
    return service_login_send_otp(req.email.lower(), req.password)

@router.post("/login/verify-otp")
def login_verify_otp(req: OtpRequest):
    return service_login_verify_otp(req.email.lower(), req.otp)

@router.post("/resend-otp")
def resend_otp(req: ResendRequest):
    return service_resend_otp(req.email.lower())

@router.post("/forgot-password/send-otp")
def forgot_password_send_otp(req: ForgotPasswordRequest):
    return service_forgot_send_otp(req.email.lower())

@router.post("/forgot-password/verify-otp")
def forgot_password_verify_otp(req: OtpRequest):
    return service_forgot_verify_otp(req.email.lower(), req.otp)

@router.post("/forgot-password/reset")
def forgot_password_reset(req: ResetPasswordRequest):
    return service_reset_password(req.email.lower(), req.reset_token, req.new_password)