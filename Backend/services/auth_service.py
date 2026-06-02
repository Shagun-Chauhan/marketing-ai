import random, time, smtplib, os, secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import HTTPException
from passlib.context import CryptContext
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta

# ✅ Import DB helpers instead of using a dictionary
from database import (
    db_user_exists, db_create_user,
    db_get_user, db_update_password
)

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "brandpilot-secret-key")
ALGORITHM = "HS256"

# These stay in-memory — they are temporary/session data (OTPs expire in 10min anyway)
otp_store = {}
reset_token_store = {}


# ── Helpers ──────────────────────────────────────────────────────────────────

def generate_otp():
    return str(random.randint(100000, 999999))

def create_token(email):
    payload = {"sub": email, "exp": datetime.utcnow() + timedelta(days=7)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def send_otp_email(to_email, otp):
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")
    if not EMAIL_USER or not EMAIL_PASS:
        # No email credentials — print OTP to console for development
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

def service_signup_send_otp(name, email, password):
    # ✅ Check DB instead of dictionary
    if db_user_exists(email):
        raise HTTPException(status_code=409, detail="Account already exists. Please login.")

    otp = generate_otp()
    otp_store[email] = {
        "otp": otp,
        "expires_at": time.time() + 600,
        "pending_password": pwd_context.hash(password),
        "pending_name": name
    }
    try:
        send_otp_email(email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")
    return {"message": "OTP sent. Please verify your email."}

def service_signup_verify_otp(email, otp):
    record = otp_store.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="No OTP found.")
    if time.time() > record["expires_at"]:
        otp_store.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP expired.")
    if record["otp"] != otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP.")

    # ✅ Save to SQLite database (persists across restarts!)
    db_create_user(
        email=email,
        name=record.get("pending_name", ""),
        hashed_password=record["pending_password"]
    )
    otp_store.pop(email, None)
    return {"message": "Account created.", "token": create_token(email), "email": email}


# ── Login ────────────────────────────────────────────────────────────────────

def service_direct_login(email, password):
    # ✅ Fetch from DB
    user = db_get_user(email)
    if not user:
        raise HTTPException(status_code=404, detail="Account not found. Please sign up.")
    if not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password.")
    return {
        "message": "Login successful.",
        "token": create_token(email),
        "email": email,
        "name": user["name"]
    }

def service_login_send_otp(email, password):
    user = db_get_user(email)
    if not user:
        raise HTTPException(status_code=404, detail="Account not found. Please sign up.")
    if not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password.")
    otp = generate_otp()
    otp_store[email] = {"otp": otp, "expires_at": time.time() + 600}
    try:
        send_otp_email(email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")
    return {"message": "OTP sent to your email."}

def service_login_verify_otp(email, otp):
    record = otp_store.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="No OTP found.")
    if time.time() > record["expires_at"]:
        otp_store.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP expired.")
    if record["otp"] != otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP.")
    otp_store.pop(email, None)
    user = db_get_user(email)
    return {
        "message": "Login successful.",
        "token": create_token(email),
        "email": email,
        "name": user["name"] if user else ""
    }


# ── Resend OTP ───────────────────────────────────────────────────────────────

def service_resend_otp(email):
    otp = generate_otp()
    otp_store[email] = {**otp_store.get(email, {}), "otp": otp, "expires_at": time.time() + 600}
    try:
        send_otp_email(email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resend OTP: {str(e)}")
    return {"message": "OTP resent."}


# ── Forgot Password ──────────────────────────────────────────────────────────

def service_forgot_send_otp(email):
    # ✅ Check DB
    if not db_user_exists(email):
        raise HTTPException(status_code=404, detail="No account found with this email.")
    otp = generate_otp()
    otp_store[email] = {"otp": otp, "expires_at": time.time() + 600}
    try:
        send_otp_email(email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")
    return {"message": "Password reset OTP sent to your email."}

def service_forgot_verify_otp(email, otp):
    record = otp_store.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="No OTP found. Please request a new one.")
    if time.time() > record["expires_at"]:
        otp_store.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")
    if record["otp"] != otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP.")
    otp_store.pop(email, None)
    reset_token = secrets.token_urlsafe(32)
    reset_token_store[email] = {
        "token": reset_token,
        "expires_at": time.time() + 600
    }
    return {"message": "OTP verified.", "reset_token": reset_token}

def service_reset_password(email, reset_token, new_password):
    # ✅ Check DB
    if not db_user_exists(email):
        raise HTTPException(status_code=404, detail="Account not found.")
    record = reset_token_store.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="No reset token found. Please start over.")
    if time.time() > record["expires_at"]:
        reset_token_store.pop(email, None)
        raise HTTPException(status_code=400, detail="Reset token expired. Please start over.")
    if record["token"] != reset_token:
        raise HTTPException(status_code=400, detail="Invalid reset token.")
    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    # ✅ Update password in DB
    db_update_password(email, pwd_context.hash(new_password))
    reset_token_store.pop(email, None)
    return {"message": "Password reset successful. You can now log in."}