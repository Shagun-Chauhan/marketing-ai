import os
import logging
from datetime import datetime
from pathlib import Path
from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load .env from the Backend root (explicit path so it works regardless of import order)
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_env_path, override=True)

logger = logging.getLogger("caption_storage")

# ──────────────────────────────────────────────────────────────────
# MongoDB Atlas connection — isolated to the Caption module
# ──────────────────────────────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "marketing_ai")

if not MONGO_URI:
    raise RuntimeError(
        "MONGO_URI environment variable is not set. "
        "Please add your MongoDB Atlas connection string to the .env file. "
        "Example: MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/marketing_ai"
    )

# Motor async client with Atlas-compatible settings
_client = AsyncIOMotorClient(
    MONGO_URI,
    tls=True,                       # Required for Atlas SRV connections
    tlsAllowInvalidCertificates=False,
    retryWrites=True,
    retryReads=True,
    serverSelectionTimeoutMS=10000,  # 10 s timeout for Atlas connectivity
    connectTimeoutMS=10000,
    socketTimeoutMS=20000,
)

_db = _client[DATABASE_NAME]
advertisement_collection = _db.advertisement_content


# ──────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────
def _serialize_doc(doc: dict) -> dict:
    """Convert a MongoDB document to a JSON-serializable dict.

    Handles ObjectId and datetime fields recursively at the top level.
    """
    if doc is None:
        return doc
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    # Ensure datetime fields are ISO strings for JSON
    for key in ("created_at", "updated_at"):
        if key in doc and isinstance(doc[key], datetime):
            doc[key] = doc[key].isoformat()
    return doc


# ──────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────
async def save_generated_ad_content(
    business_context: dict,
    campaign: str,
    generated_content: dict,
) -> dict:
    """
    Save a complete generated advertisement result to MongoDB Atlas.

    Parameters
    ----------
    business_context : dict
        Keys: business_type, target_audience, platform, tone, location, marketing_goal
    campaign : str
        Campaign or topic name.
    generated_content : dict
        Full generated output including caption, cta, hashtags,
        advertisement_blueprint, why_this_will_work, poster_layout.

    Returns
    -------
    dict — The saved document with stringified _id.

    Raises
    ------
    ConnectionError
        If the Atlas cluster is unreachable.
    RuntimeError
        If the insert operation fails.
    """
    now = datetime.utcnow()
    document = {
        "business_context": business_context,
        "campaign": campaign,
        "generated_content": generated_content,
        "created_at": now,
        "updated_at": now,
    }

    try:
        result = await advertisement_collection.insert_one(document)
    except Exception as e:
        logger.error("Failed to save advertisement to Atlas: %s", e)
        raise ConnectionError(
            f"Could not save to MongoDB Atlas. Please check your connection. Error: {e}"
        ) from e

    document["_id"] = str(result.inserted_id)
    document["created_at"] = now.isoformat()
    document["updated_at"] = now.isoformat()
    return document


async def get_saved_ad_content(limit: int = 20) -> list:
    """
    Return a summarised list of previously generated advertisement content
    from MongoDB Atlas, sorted newest-first.

    Returns
    -------
    list[dict] — Each dict has: _id, campaign, platform, created_at
    """
    try:
        cursor = advertisement_collection.find(
            {},
            {
                "_id": 1,
                "campaign": 1,
                "business_context.platform": 1,
                "created_at": 1,
            },
        ).sort("created_at", -1).limit(limit)

        results = []
        async for doc in cursor:
            results.append({
                "_id": str(doc["_id"]),
                "campaign": doc.get("campaign", ""),
                "platform": doc.get("business_context", {}).get("platform", ""),
                "created_at": doc["created_at"].isoformat()
                             if isinstance(doc.get("created_at"), datetime)
                             else doc.get("created_at"),
            })
        return results

    except Exception as e:
        logger.error("Failed to fetch history from Atlas: %s", e)
        raise ConnectionError(
            f"Could not fetch history from MongoDB Atlas. Error: {e}"
        ) from e


async def get_ad_content_by_id(doc_id: str) -> dict | None:
    """
    Retrieve a full advertisement content document by its _id from Atlas.

    Parameters
    ----------
    doc_id : str — The stringified ObjectId.

    Returns
    -------
    dict | None — The full document, or None if not found / invalid id.
    """
    # Validate ObjectId format
    try:
        oid = ObjectId(doc_id)
    except (InvalidId, Exception):
        logger.warning("Invalid ObjectId received: %s", doc_id)
        return None

    try:
        doc = await advertisement_collection.find_one({"_id": oid})
    except Exception as e:
        logger.error("Failed to fetch document %s from Atlas: %s", doc_id, e)
        raise ConnectionError(
            f"Could not fetch from MongoDB Atlas. Error: {e}"
        ) from e

    if doc is None:
        return None
    return _serialize_doc(doc)
