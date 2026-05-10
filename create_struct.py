import os

structure = {
    "backend": {
        "app": {
            "main.py": "",
            "database.py": "",
            "config.py": "",
            "models": {
                "__init__.py": "",
                "user.py": "",
                "trip.py": "",
                "stop.py": "",
                "city.py": "",
                "activity.py": "",
                "trip_activity.py": "",
                "budget.py": "",
                "packing.py": "",
                "note.py": "",
                "saved_destination.py": "",
                "collaborator.py": ""
            },
            "schemas": {
                "__init__.py": "",
                "user.py": "",
                "trip.py": "",
                "stop.py": "",
                "city.py": "",
                "activity.py": "",
                "trip_activity.py": "",
                "budget.py": "",
                "packing.py": "",
                "note.py": "",
                "auth.py": "",
                "dashboard.py": "",
                "itinerary.py": "",
                "admin.py": ""
            },
            "routers": {
                "__init__.py": "",
                "auth.py": "",
                "dashboard.py": "",
                "trips.py": "",
                "stops.py": "",
                "cities.py": "",
                "activities.py": "",
                "budget.py": "",
                "packing.py": "",
                "notes.py": "",
                "itinerary.py": "",
                "shared.py": "",
                "profile.py": "",
                "admin.py": ""
            },
            "services": {
                "__init__.py": "",
                "auth_service.py": "",
                "trip_service.py": "",
                "stop_service.py": "",
                "city_service.py": "",
                "activity_service.py": "",
                "budget_service.py": "",
                "packing_service.py": "",
                "note_service.py": "",
                "itinerary_service.py": "",
                "dashboard_service.py": "",
                "upload_service.py": "",
                "email_service.py": "",
                "admin_service.py": ""
            },
            "dependencies": {
                "__init__.py": "",
                "auth.py": "",
                "db.py": ""
            },
            "utils": {
                "__init__.py": "",
                "security.py": "",
                "token.py": "",
                "pagination.py": ""
            }
        },
        "alembic": {
            "env.py": "",
            "script.py.mako": "",
            "versions": {
                ".gitkeep": ""
            }
        },
        "tests": {
            "__init__.py": "",
            "conftest.py": "",
            "test_auth.py": "",
            "test_trips.py": "",
            "test_stops.py": "",
            "test_cities.py": "",
            "test_activities.py": "",
            "test_budget.py": "",
            "test_packing.py": "",
            "test_notes.py": "",
            "test_itinerary.py": "",
            "test_profile.py": "",
            "test_admin.py": ""
        },
        "seeds": {
            "seed_cities.py": "",
            "seed_activities.py": ""
        },
        "uploads": {
            "profiles": {},
            "trips": {}
        },
        ".env": "",
        ".env.example": "",
        ".gitignore": "",
        "requirements.txt": "",
        "alembic.ini": "",
        "README.md": ""
    }
}

def create_structure(base_path, struct):
    for name, content in struct.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            with open(path, "w") as f:
                f.write(content)

create_structure(".", structure)
print("Directory structure created successfully.")
