import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Use environment variables or default to the docker-compose setup
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://watershed_user:watershed_password@localhost:5432/watershed_db"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
