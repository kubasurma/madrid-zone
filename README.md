# MadridZone

MadridZone is a full-stack fan portal for Real Madrid.

The application displays upcoming matches, La Liga standings, current news and player profiles. It uses external APIs together with a FastAPI backend and a PostgreSQL database.

## Features

- Upcoming Real Madrid matches with team crests, dates, times and match status
- La Liga standings for the 2026/27 season
- Real Madrid player list divided by positions
- Individual player profiles with additional data from an external API
- Latest Real Madrid news fetched automatically from external sources
- Responsive layout for desktop and mobile devices
- Basic login and admin CRUD prototype created during development

## Technologies

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Python
- FastAPI
- PostgreSQL
- Psycopg2

### External APIs

- football-data.org — matches and La Liga standings
- GNews — current Real Madrid news
- TheSportsDB — player profile data

## Project structure

```text
madrid-zone/
│
├── main.py
├── config.example.py
├── requirements.txt
├── index.html
├── index.js
├── news.html
├── matches.html
├── standings.html
├── players.html
├── player.html
├── style.css
└── images/