import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "brandpilot.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Run on import — creates table if it doesn't exist yet
init_db()


# ── User helpers ──────────────────────────────────────────────────────────────

def db_user_exists(email: str) -> bool:
    conn = get_db()
    row = conn.execute("SELECT 1 FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    return row is not None

def db_create_user(email: str, name: str, hashed_password: str):
    conn = get_db()
    conn.execute(
        "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
        (email, name, hashed_password)
    )
    conn.commit()
    conn.close()

def db_get_user(email: str):
    """Returns dict with keys: email, name, password — or None if not found."""
    conn = get_db()
    row = conn.execute(
        "SELECT email, name, password FROM users WHERE email = ?", (email,)
    ).fetchone()
    conn.close()
    if row is None:
        return None
    return {"email": row["email"], "name": row["name"], "password": row["password"]}

def db_update_password(email: str, hashed_password: str):
    conn = get_db()
    conn.execute(
        "UPDATE users SET password = ? WHERE email = ?",
        (hashed_password, email)
    )
    conn.commit()
    conn.close()