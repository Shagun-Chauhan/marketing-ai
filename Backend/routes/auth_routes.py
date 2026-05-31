from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import random, time, smtplib, os, secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from passlib.context import CryptContext
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "brandpilot-secret-key")
ALGORITHM = "HS256"

otp_store = {}
user_store = {}
reset_token_store = {}  # { email: { token, expires_at } }

class EmailPasswordRequest(BaseModel):
    email: EmailStr
    password: str

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

def generate_otp():
    return str(random.randint(100000, 999999))

def create_token(email):
    payload = {"sub": email, "exp": datetime.utcnow() + timedelta(days=7)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def send_otp_email(to_email, otp):
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")
    if not EMAIL_USER or not EMAIL_PASS:
        print(f"\n{'='*40}\nOTP for {to_email}: {otp}\n{'='*40}\n")
        return
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your BrandPilot AI OTP"
    msg["From"] = f"BrandPilot AI <{EMAIL_USER}>"
    msg["To"] = to_email
    msg.attach(MIMEText(f"<h2>Your OTP: {otp}</h2><p>Valid for 10 minutes.</p>", "html"))
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, to_email, msg.as_string())

# ── Signup ───────────────────────────────────────────────────────────────────

@router.post("/signup/send-otp")
def signup_send_otp(req: EmailPasswordRequest):
    email = req.email.lower()
    if email in user_store:
        raise HTTPException(status_code=409, detail="Account already exists. Please login.")
    otp = generate_otp()
    otp_store[email] = {
        "otp": otp,
        "expires_at": time.time() + 600,
        "pending_password": pwd_context.hash(req.password)
    }
    try:
        send_otp_email(email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")
    return {"message": "OTP sent. Please verify your email."}

@router.post("/signup/verify-otp")
def signup_verify_otp(req: OtpRequest):
    email = req.email.lower()
    record = otp_store.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="No OTP found.")
    if time.time() > record["expires_at"]:
        otp_store.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP expired.")
    if record["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP.")
    user_store[email] = record["pending_password"]
    otp_store.pop(email, None)
    return {"message": "Account created.", "token": create_token(email), "email": email}

# ── Login ────────────────────────────────────────────────────────────────────

@router.post("/login/send-otp")
def login_send_otp(req: EmailPasswordRequest):
    email = req.email.lower()
    if email not in user_store:
        raise HTTPException(status_code=404, detail="Account not found. Please sign up.")
    if not pwd_context.verify(req.password, user_store[email]):
        raise HTTPException(status_code=401, detail="Incorrect password.")
    otp = generate_otp()
    otp_store[email] = {"otp": otp, "expires_at": time.time() + 600}
    try:
        send_otp_email(email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")
    return {"message": "OTP sent to your email."}

@router.post("/login/verify-otp")
def login_verify_otp(req: OtpRequest):
    email = req.email.lower()
    record = otp_store.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="No OTP found.")
    if time.time() > record["expires_at"]:
        otp_store.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP expired.")
    if record["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP.")
    otp_store.pop(email, None)
    return {"message": "Login successful.", "token": create_token(email), "email": email}

# ── Resend OTP ───────────────────────────────────────────────────────────────

@router.post("/resend-otp")
def resend_otp(req: ResendRequest):
    email = req.email.lower()
    otp = generate_otp()
    otp_store[email] = {**otp_store.get(email, {}), "otp": otp, "expires_at": time.time() + 600}
    try:
        send_otp_email(email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resend OTP: {str(e)}")
    return {"message": "OTP resent."}

# ── Forgot Password ──────────────────────────────────────────────────────────

@router.post("/forgot-password/send-otp")
def forgot_password_send_otp(req: ForgotPasswordRequest):
    email = req.email.lower()
    # THE FIX: check user_store, same as login does
    if email not in user_store:
        raise HTTPException(status_code=404, detail="No account found with this email.")
    otp = generate_otp()
    otp_store[email] = {"otp": otp, "expires_at": time.time() + 600}
    try:
        send_otp_email(email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")
    return {"message": "Password reset OTP sent to your email."}

@router.post("/forgot-password/verify-otp")
def forgot_password_verify_otp(req: OtpRequest):
    email = req.email.lower()
    record = otp_store.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="No OTP found. Please request a new one.")
    if time.time() > record["expires_at"]:
        otp_store.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")
    if record["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP.")
    otp_store.pop(email, None)
    # Generate a short-lived reset token
    reset_token = secrets.token_urlsafe(32)
    reset_token_store[email] = {
        "token": reset_token,
        "expires_at": time.time() + 600  # 10 minutes
    }
    return {"message": "OTP verified.", "reset_token": reset_token}

@router.post("/forgot-password/reset")
def forgot_password_reset(req: ResetPasswordRequest):
    email = req.email.lower()
    if email not in user_store:
        raise HTTPException(status_code=404, detail="Account not found.")
    record = reset_token_store.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="No reset token found. Please start over.")
    if time.time() > record["expires_at"]:
        reset_token_store.pop(email, None)
        raise HTTPException(status_code=400, detail="Reset token expired. Please start over.")
    if record["token"] != req.reset_token:
        raise HTTPException(status_code=400, detail="Invalid reset token.")
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    # Update password
    user_store[email] = pwd_context.hash(req.new_password)
    reset_token_store.pop(email, None)
    return {"message": "Password reset successful. You can now log in."}