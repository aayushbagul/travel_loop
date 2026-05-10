import asyncio
import random
from faker import Faker
from fastapi import FastAPI
from app.database import init_db, close_db
from app.models.city import City
from app.models.activity import Activity
from app.models.user import User
from app.models.post import Post
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

fake = Faker()

POPULAR_CITIES = [
    {"name": "Paris", "country": "France", "image_url": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a"},
    {"name": "Tokyo", "country": "Japan", "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf"},
    {"name": "New York City", "country": "United States", "image_url": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9"},
    {"name": "Rome", "country": "Italy", "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5"},
    {"name": "London", "country": "United Kingdom", "image_url": "https://images.unsplash.com/photo-1513635269975-59693e0cd8ce"},
]

ACTIVITY_TYPES = ["Sightseeing", "Food", "Adventure", "Culture", "Relaxation"]

async def seed_all():
    app = FastAPI()
    await init_db(app)

    print("Seeding admin user...")
    admin_user = await User.get_or_none(email="admin@example.com")
    if not admin_user:
        hashed_password = pwd_context.hash("admin123")
        await User.create(
            email="admin@example.com",
            name="Super Admin",
            hashed_password=hashed_password,
            is_admin=True
        )
        print("Admin user created (admin@example.com / admin123).")
    else:
        print("Admin user already exists.")

    print("Seeding cities...")
    cities = await City.all()
    if not cities:
        cities_to_create = [City(name=c["name"], country=c["country"], description=fake.paragraph(), image_url=c["image_url"]) for c in POPULAR_CITIES]
        await City.bulk_create(cities_to_create)
        cities = await City.all()
        print(f"Seeded {len(cities)} cities.")
    else:
        print("Cities already exist.")

    print("Seeding activities...")
    activities = await Activity.all()
    if not activities:
        acts_to_create = []
        for city in cities:
            for _ in range(10):
                acts_to_create.append(Activity(
                    city=city,
                    name=f"{fake.catch_phrase()} Tour",
                    type=random.choice(ACTIVITY_TYPES),
                    description=fake.paragraph(),
                    image_url=f"https://picsum.photos/seed/{fake.uuid4()}/800/600",
                    duration_minutes=random.choice([60, 120, 180]),
                    price_estimate=round(random.uniform(20.0, 100.0), 2)
                ))
        await Activity.bulk_create(acts_to_create)
        print(f"Seeded {len(acts_to_create)} activities.")
    else:
        print("Activities already exist.")

    print("Seeding community posts...")
    posts = await Post.all()
    if not posts:
        dummy_posts = [
            Post(user=admin_user, content="Just finished an amazing 14-day itinerary across Tokyo! Highly recommend the JR Pass.", likes_count=124, comments_count=18),
            Post(user=admin_user, content="Does anyone know the best affordable hostels near the colosseum in Rome? Looking for a good vibe.", likes_count=45, comments_count=32),
            Post(user=admin_user, content="Canggu is crowded, but the coworking spaces are top tier.", likes_count=89, comments_count=5),
            Post(user=admin_user, content="The W Trek in Patagonia was the most rewarding experience of my life. Pack layers!", likes_count=210, comments_count=42),
        ]
        await Post.bulk_create(dummy_posts)
        print("Seeded 4 community posts.")
    else:
        print("Posts already exist.")

    await close_db()

if __name__ == "__main__":
    asyncio.run(seed_all())
