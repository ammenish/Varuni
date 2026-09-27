"""Pydantic schemas for API request/response validation."""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid


# ─── Watershed ────────────────────────────────────────────
class WatershedBase(BaseModel):
    name: str
    state: Optional[str] = None
    district: Optional[str] = None
    block: Optional[str] = None
    area_sqkm: Optional[float] = None
    perimeter_km: Optional[float] = None
    elevation_min: Optional[float] = None
    elevation_max: Optional[float] = None
    slope_avg: Optional[float] = None
    drainage_density: Optional[float] = None
    source: Optional[str] = None
    version: Optional[str] = None

class WatershedCreate(WatershedBase):
    geometry_geojson: Optional[Dict[str, Any]] = None

class WatershedResponse(WatershedBase):
    id: uuid.UUID
    ndvi_current: Optional[float] = None
    ndwi_current: Optional[float] = None
    landcover_dominant: Optional[str] = None
    population: Optional[int] = None
    created_at: Optional[datetime] = None
    geometry_geojson: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class WatershedSummary(BaseModel):
    id: uuid.UUID
    name: str
    state: Optional[str] = None
    district: Optional[str] = None
    area_sqkm: Optional[float] = None
    ndvi_current: Optional[float] = None
    ndwi_current: Optional[float] = None
    centroid: Optional[List[float]] = None  # [lon, lat]

    class Config:
        from_attributes = True


# ─── Image ────────────────────────────────────────────────
class ImageBase(BaseModel):
    object_uri: str
    captured_at: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    intervention_type: Optional[str] = None

class ImageCreate(ImageBase):
    watershed_id: Optional[uuid.UUID] = None

class ImageResponse(ImageBase):
    id: uuid.UUID
    watershed_id: Optional[uuid.UUID] = None
    quality_status: str = "pending"
    quality_score: Optional[float] = None
    ai_tags: Optional[Dict[str, Any]] = None
    camera_model: Optional[str] = None
    altitude: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Intervention ─────────────────────────────────────────
class InterventionBase(BaseModel):
    name: Optional[str] = None
    type: str
    status: str = "proposed"
    source: Optional[str] = None
    description: Optional[str] = None
    cost_estimate: Optional[float] = None
    beneficiaries: Optional[int] = None

class InterventionCreate(InterventionBase):
    latitude: float
    longitude: float
    watershed_id: Optional[uuid.UUID] = None

class InterventionResponse(InterventionBase):
    id: uuid.UUID
    watershed_id: Optional[uuid.UUID] = None
    observed_at: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Satellite Scene ─────────────────────────────────────
class SatelliteSceneBase(BaseModel):
    provider: str
    sensor: Optional[str] = None
    acquisition_time: datetime
    cloud_cover: Optional[float] = None
    resolution_m: Optional[float] = None
    processing_level: Optional[str] = None

class SatelliteSceneCreate(SatelliteSceneBase):
    source_uri: Optional[str] = None

class SatelliteSceneResponse(SatelliteSceneBase):
    id: uuid.UUID
    source_uri: Optional[str] = None
    crs: str = "EPSG:4326"
    bands: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Analysis ─────────────────────────────────────────────
class AnalysisJobCreate(BaseModel):
    type: str
    input_refs: Optional[Dict[str, Any]] = None
    model_version: Optional[str] = None

class AnalysisJobResponse(BaseModel):
    id: uuid.UUID
    type: str
    status: str
    stage: Optional[str] = None
    progress: Optional[float] = None
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result_summary: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Change Event ─────────────────────────────────────────
class ChangeEventResponse(BaseModel):
    id: uuid.UUID
    watershed_id: Optional[uuid.UUID] = None
    from_date: datetime
    to_date: datetime
    metric: str
    delta: Optional[float] = None
    from_value: Optional[float] = None
    to_value: Optional[float] = None
    confidence: Optional[float] = None
    severity: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Audit ────────────────────────────────────────────────
class AuditEventResponse(BaseModel):
    id: uuid.UUID
    actor_id: str
    action: str
    resource_type: str
    resource_id: str
    timestamp: Optional[datetime] = None
    metadata_info: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


# ─── Dashboard/Analytics ─────────────────────────────────
class DashboardStats(BaseModel):
    total_watersheds: int
    total_images: int
    total_interventions: int
    total_analyses: int
    avg_ndvi: Optional[float] = None
    avg_ndwi: Optional[float] = None
    total_water_area_sqkm: Optional[float] = None
    recent_changes: List[ChangeEventResponse] = []
    quality_alerts: int = 0

class WatershedGeoJSON(BaseModel):
    type: str = "FeatureCollection"
    features: List[Dict[str, Any]] = []

class HeatmapData(BaseModel):
    points: List[Dict[str, Any]] = []  # [{lat, lon, intensity}]
    metric: str
    bounds: Optional[List[float]] = None

class TimeSeriesPoint(BaseModel):
    date: str
    value: float
    label: Optional[str] = None

class TimeSeriesData(BaseModel):
    metric: str
    unit: str
    data: List[TimeSeriesPoint] = []
