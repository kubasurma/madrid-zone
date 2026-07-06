import requests
from config import API_KEY, GNEWS_API_KEY, DB_CONFIG
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewsCreate(BaseModel):
    title: str
    category: str
    image: str

class NewsUpdate(BaseModel):
    title: str
    category: str
    image: str

class LoginData(BaseModel):
    username: str
    password: str

@app.get("/")
def home():
    return {"message": "MadridZone API działa!"}


@app.get("/news")
def get_news():
    conn = psycopg2.connect(**DB_CONFIG)

    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, title, category, image
        FROM news
        ORDER BY id
    """)

    rows = cursor.fetchall()

    news = []

    for row in rows:
        news.append({
            "id": row[0],
            "title": row[1],
            "category": row[2],
            "image": row[3]
        })

    cursor.close()
    conn.close()

    return news


@app.post("/news")
def create_news(news: NewsCreate):
    conn = psycopg2.connect(**DB_CONFIG)

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO news (title, category, image)
        VALUES (%s, %s, %s)
        """,
        (news.title, news.category, news.image)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "News dodany!"}


@app.delete("/news/{news_id}")
def delete_news(news_id: int):
    conn = psycopg2.connect(**DB_CONFIG)

    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM news
        WHERE id = %s
        """,
        (news_id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "News usunięty!"}


@app.get("/players")
def get_players():
    conn = psycopg2.connect(**DB_CONFIG)

    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, position, number, image
        FROM players
        ORDER BY id
    """)

    rows = cursor.fetchall()

    players = []

    for row in rows:
        players.append({
            "id": row[0],
            "name": row[1],
            "position": row[2],
            "number": row[3],
            "image": row[4]
        })

    cursor.close()
    conn.close()

    return players


@app.put("/news/{news_id}")
def update_news(news_id: int, news: NewsUpdate):

    conn = psycopg2.connect(**DB_CONFIG)

    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE news
        SET title = %s,
            category = %s,
            image = %s
        WHERE id = %s
        """,
        (
            news.title,
            news.category,
            news.image,
            news_id
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "News zaktualizowany!"}


@app.get("/matches")
def get_matches():
    conn = psycopg2.connect(**DB_CONFIG)

    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, opponent, match_date, competition, stadium, logo
        FROM matches
        ORDER BY id
    """)

    rows = cursor.fetchall()

    matches = []

    for row in rows:
        matches.append({
            "id": row[0],
            "opponent": row[1],
            "match_date": row[2],
            "competition": row[3],
            "stadium": row[4],
            "logo": row[5]
        })

    cursor.close()
    conn.close()

    return matches



@app.post("/login")
def login(data: LoginData):

    conn = psycopg2.connect(**DB_CONFIG)

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE username = %s
        AND password = %s
        """,
        (data.username, data.password)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return {
            "token": "madridzone-admin-token"
        }

    return {
        "message": "Nieprawidłowy login lub hasło"
    }


@app.get("/real-matches")
def get_real_matches():
    url = "https://api.football-data.org/v4/teams/86/matches"

    headers = {
        "X-Auth-Token": API_KEY
    }

    response = requests.get(url, headers=headers)

    data = response.json()

    return data


@app.get("/laliga-standings")
def get_laliga_standings():
    url = "https://api.football-data.org/v4/competitions/PD/standings?season=2026"

    headers = {
        "X-Auth-Token": API_KEY
    }

    response = requests.get(url, headers=headers)

    data = response.json()

    return data

@app.get("/real-squad")
def get_real_squad():
    url = "https://api.football-data.org/v4/teams/86"

    headers = {
        "X-Auth-Token": API_KEY
    }

    response = requests.get(url, headers=headers)

    return response.json()


@app.get("/players/{player_id}")
def get_player(player_id: int):
    conn = psycopg2.connect(**DB_CONFIG)

    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, position, number, image
        FROM players
        WHERE id = %s
    """, (player_id,))

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Nie znaleziono zawodnika"
        )

    return {
        "id": row[0],
        "name": row[1],
        "position": row[2],
        "number": row[3],
        "image": row[4]
    }


@app.get("/players/{player_id}/external")
def get_external_player(player_id: int):
    conn = psycopg2.connect(**DB_CONFIG)

    cursor = conn.cursor()

    cursor.execute("""
        SELECT name
        FROM players
        WHERE id = %s
    """, (player_id,))

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Nie znaleziono zawodnika"
        )

    player_name = row[0]

    url = "https://www.thesportsdb.com/api/v1/json/123/searchplayers.php"

    response = requests.get(
        url,
        params={"p": player_name}
    )

    data = response.json()

    external_players = data.get("player", [])
    external_player = None

    for candidate in external_players:
        if candidate.get("strTeam") == "Real Madrid":
            external_player = candidate
            break

    if external_player is None and external_players:
        external_player = external_players[0]

    if external_player is None:
        return {
            "found": False,
            "nationality": None,
            "birth_date": None,
            "external_position": None,
            "status": None,
            "thumb": None,
            "cutout": None
        }

    return {
        "found": True,
        "nationality": external_player.get("strNationality"),
        "birth_date": external_player.get("dateBorn"),
        "external_position": external_player.get("strPosition"),
        "status": external_player.get("strStatus"),
        "thumb": external_player.get("strThumb"),
        "cutout": external_player.get("strCutout")
    }


@app.get("/real-news")
def get_real_news():
    url = "https://gnews.io/api/v4/search"

    params = {
        "q": "Real Madrid",
        "lang": "es",
        "country": "es",
        "max": 10,
        "sortby": "publishedAt",
        "apikey": GNEWS_API_KEY
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Nie udało się pobrać newsów"
        )

    data = response.json()

    news = []

    for article in data.get("articles", []):
        news.append({
            "title": article.get("title"),
            "description": article.get("description"),
            "url": article.get("url"),
            "image": article.get("image"),
            "published_at": article.get("publishedAt"),
            "source": article.get("source", {}).get("name")
        })

    return news