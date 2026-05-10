from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db, close_db
from app.routers import auth, cities, activities, trips, stops, profile, dashboard, budget, packing, notes, admin, itinerary

app = FastAPI(title="Travel Loop API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db(app)

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()

# Include routers
app.include_router(auth.router)
app.include_router(cities.router)
app.include_router(activities.router)
app.include_router(trips.router)
app.include_router(stops.router)
app.include_router(profile.router)
app.include_router(dashboard.router)
app.include_router(budget.router)
app.include_router(packing.router)
app.include_router(notes.router)
app.include_router(admin.router)
app.include_router(itinerary.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Travel Loop API"}
