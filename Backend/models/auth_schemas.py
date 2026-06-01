from pydantic import BaseModel, EmailStr

class EmailPasswordRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class OtpRequest(BaseModel):
    email: EmailStr
    otp: str

class ResendRequest(BaseModel):
    email: EmailStr

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    reset_token: str
    new_password: str

class DirectLoginRequest(BaseModel):
    email: EmailStr
    password: str