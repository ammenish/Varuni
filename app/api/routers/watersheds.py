from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Watershed
from pydantic import BaseModel
from typing import List
import uuid

router = APIRouter(
    prefix="/api/v1/watersheds",
    tags=["watersheds"]
)

class WatershedCreate(BaseModel):
    name: str
    area: float = None
    source: str = None
    version: str = None

class WatershedResponse(WatershedCreate):
    id: uuid.UUID
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[WatershedResponse])
def get_watersheds(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    watersheds = db.query(Watershed).offset(skip).limit(limit).all()
    return watersheds

@router.post("/", response_model=WatershedResponse)
def create_watershed(watershed: WatershedCreate, db: Session = Depends(get_db)):
    # Note: For this simplified endpoint, we omit geometry handling from the payload
    # In production, geometry should be accepted as GeoJSON and converted
    db_watershed = Watershed(
        name=watershed.name,
        area=watershed.area,
        source=watershed.source,
        version=watershed.version,
        geometry="SRID=4326;POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))" # Dummy geometry for initialization
    )
    db.add(db_watershed)
    db.commit()
    db.refresh(db_watershed)
    return db_watershed
