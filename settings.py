import os

try:
    from config import API_KEY as LOCAL_API_KEY
    from config import GNEWS_API_KEY as LOCAL_GNEWS_API_KEY
    from config import DB_CONFIG as LOCAL_DB_CONFIG
except ModuleNotFoundError:
    LOCAL_API_KEY = None
    LOCAL_GNEWS_API_KEY = None
    LOCAL_DB_CONFIG = None


API_KEY = os.getenv("API_KEY") or LOCAL_API_KEY
GNEWS_API_KEY = os.getenv("GNEWS_API_KEY") or LOCAL_GNEWS_API_KEY
DATABASE_URL = os.getenv("DATABASE_URL")
DB_CONFIG = LOCAL_DB_CONFIG