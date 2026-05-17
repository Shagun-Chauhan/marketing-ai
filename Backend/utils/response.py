from typing import Any, Optional
from fastapi.responses import JSONResponse

def success_response(data: Any, message: str = "Operation successful"):
    """Standard success response format"""
    return {
        "status": "success",
        "message": message,
        "data": data
    }

def error_response(message: str = "Operation failed", status_code: int = 400):
    """Standard error response format"""
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "error",
            "message": message
        }
    )