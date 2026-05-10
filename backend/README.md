# Travel Loop Backend

Travel Loop is a complete travel planning backend system designed to help users create, manage, and share customized multi-city itineraries. 

This repository contains the backend architecture and API built to support dynamic user interfaces, complex relational data, and a seamless travel planning experience.

## Problem Statement

Design and develop a complete travel planning application where users can:
- Create customized multi-city itineraries
- Assign travel dates, activities, and budgets
- Discover activities and destinations through search
- Receive cost breakdowns and visual calendars
- Share their plans publicly or with friends

The application demonstrates proper use of relational databases to store and retrieve complex travel data such as user-specific itineraries, stops, activities, and estimated expenses. The system also supports dynamic user interfaces that adapt to each user's trip flow.

## Tech Stack

The backend is built with a modern, high-performance, asynchronous Python stack:

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High performance, async, auto-docs)
- **Server**: Uvicorn
- **Database ORM**: Tortoise ORM (Asynchronous ORM inspired by Django)
- **Database Engine**: SQLite (for development) / PostgreSQL (via `asyncpg` for production)
- **Migrations**: Aerich
- **Data Validation**: Pydantic v2
- **Authentication**: JWT (JSON Web Tokens) via `python-jose` and `passlib[bcrypt]`
- **Testing**: `pytest` and `pytest-asyncio`

## Database Schema (Relational Architecture)

The system is built on a highly relational database architecture:
- **Users**: Core user profiles and preferences.
- **Trips**: Top-level itineraries belonging to a User.
- **Stops**: Day-to-day timeline and city stopovers within a Trip.
- **Cities & Activities**: Global directory of destinations and things to do.
- **Trip_Activities**: Specific activities scheduled during a Trip Stop.
- **Budget_Items**: Granular cost tracking (transport, accommodation, etc.) tied to a Trip.
- **Packing_Items**: Checklist items for trip preparation.
- **Trip_Notes**: Journal entries and reminders per trip.
- **Saved_Destinations**: Bookmarked cities for future inspiration.
- **Collaborators**: Trip sharing permissions (Viewer/Editor) and share tokens.

## Application Features

The API endpoints support the following frontend features:

- **Login / Signup**: JWT-secured authentication flow.
- **Dashboard**: Central hub showing upcoming trips, budget alerts, and travel statistics.
- **Trip Management (CRUD)**: Create, list, edit, and delete trips. Includes cover photo uploads.
- **Itinerary Builder**: Add cities, dates, and order stops. Assign specific activities to each stop.
- **Discovery Search**: Browse global Cities and Activities, with filtering and categorization.
- **Trip Budget & Cost Breakdown**: Track estimated vs actual costs, categorized expenses, and view total budget summaries.
- **Packing Checklist**: Interactive checklist to ensure essential items are packed before the journey.
- **Shared / Public Itineraries**: Generate unique share tokens to allow read-only or collaborative access to friends.
- **Trip Notes / Journal**: A built-in journal for saving booking references, addresses, or daily thoughts.
- **User Profile**: Manage account details, passwords, and saved destination wishlists.
- **Admin Dashboard**: Admin-only analytics to track user growth, top destinations, and platform usage.

## Setup & Installation

### 1. Prerequisites
- Python 3.12+

### 2. Clone and Setup Environment
```bash
git clone https://github.com/aayushbagul/travel_loop.git
cd travel_loop/backend
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
# Note: Ensure passlib and bcrypt versions are compatible
pip install -r requirements.txt
pip install pydantic-settings bcrypt==3.2.2
```

### 4. Configuration
Create a `.env` file in the `backend/` directory (or use the defaults in `config.py`):
```env
DATABASE_URL=sqlite://db.sqlite3
SECRET_KEY=supersecretkey_change_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

### 5. Running the Server
Start the development server using Uvicorn:
```bash
uvicorn app.main:app --reload
```
- API is available at: `http://127.0.0.1:8000`
- Interactive Swagger UI Docs: `http://127.0.0.1:8000/docs`

## Testing

The project includes an automated test suite covering core functionalities using an in-memory SQLite database.

```bash
pytest tests/
```

## API Modules

The application is structured into domain-driven routers:
- `/auth`: User registration, login, JWT issuance.
- `/trips`: Trip CRUD, Stop management, Budget tracking, Packing lists, Notes, and Sharing logic.
- `/cities` & `/activities`: Global read-only endpoints for discovery.
- `/users/me`: Profile management and saved destinations.
- `/dashboard`: Analytics and budget alerts for the current user.
- `/admin`: Global platform statistics and user management.
