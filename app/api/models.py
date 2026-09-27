import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from database import Base
import datetime


class Watershed(Base):
    __tablename__ = "watersheds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True, nullable=False)
    state = Column(String, index=True, nullable=True)
    district = Column(String, index=True, nullable=True)
    block = Column(String, nullable=True)
    geometry = Column(Geometry('POLYGON', srid=4326), nullable=False)
    area_sqkm = Column(Float, nullable=True)
    perimeter_km = Column(Float, nullable=True)
    elevation_min = Column(Float, nullable=True)
    elevation_max = Column(Float, nullable=True)
    slope_avg = Column(Float, nullable=True)
    drainage_density = Column(Float, nullable=True)
    source = Column(String, nullable=True)
    version = Column(String, nullable=True)
    ndvi_current = Column(Float, nullable=True)
    ndwi_current = Column(Float, nullable=True)
    landcover_dominant = Column(String, nullable=True)
    population = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    images = relationship("ImageObservation", back_populates="watershed")
    interventions = relationship("Intervention", back_populates="watershed")


class ImageObservation(Base):
    __tablename__ = "images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    object_uri = Column(String, nullable=False)
    captured_at = Column(DateTime, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    geom = Column(Geometry('POINT', srid=4326), nullable=True)
    watershed_id = Column(UUID(as_uuid=True), ForeignKey("watersheds.id"), nullable=True)
    quality_status = Column(String, default="pending")  # pending, good, poor, failed
    quality_score = Column(Float, nullable=True)
    privacy_status = Column(String, default="private")
    ai_tags = Column(JSONB, nullable=True)  # {"vegetation": 0.9, "water": 0.3, ...}
    intervention_type = Column(String, nullable=True)
    camera_model = Column(String, nullable=True)
    altitude = Column(Float, nullable=True)
    bearing = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    watershed = relationship("Watershed", back_populates="images")


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    type = Column(String, nullable=False)  # check_dam, farm_pond, contour, drainage, plantation, etc.
    geom = Column(Geometry('POINT', srid=4326), nullable=False)
    watershed_id = Column(UUID(as_uuid=True), ForeignKey("watersheds.id"), nullable=True)
    observed_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="proposed")  # proposed, observed, verified, needs_review, archived
    source = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    cost_estimate = Column(Float, nullable=True)
    beneficiaries = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    watershed = relationship("Watershed", back_populates="interventions")


class SatelliteScene(Base):
    __tablename__ = "satellite_scenes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider = Column(String, nullable=False)  # SRISHTI-DRISHTI, Landsat, Sentinel
    sensor = Column(String, nullable=True)
    acquisition_time = Column(DateTime, nullable=False)
    footprint = Column(Geometry('POLYGON', srid=4326), nullable=True)
    cloud_cover = Column(Float, nullable=True)
    resolution_m = Column(Float, nullable=True)
    source_uri = Column(String, nullable=True)
    processing_level = Column(String, nullable=True)
    crs = Column(String, default="EPSG:4326")
    bands = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class RasterAsset(Base):
    __tablename__ = "raster_assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scene_id = Column(UUID(as_uuid=True), ForeignKey("satellite_scenes.id"), nullable=True)
    name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False)  # ndvi, ndwi, lulc, dem, slope, change
    band_set = Column(JSONB, nullable=True)
    crs = Column(String, default="EPSG:4326")
    resolution_m = Column(Float, nullable=True)
    uri = Column(String, nullable=True)
    bounds = Column(JSONB, nullable=True)  # [west, south, east, north]
    stats = Column(JSONB, nullable=True)  # {min, max, mean, std, histogram}
    checksum = Column(String, nullable=True)
    version = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String, nullable=False)  # spectral_index, landcover, change_detect, zonal_stats
    input_refs = Column(JSONB, nullable=True)
    model_version = Column(String, nullable=True)
    status = Column(String, default="queued")  # queued, running, succeeded, failed, cancelled
    stage = Column(String, nullable=True)  # validating, preprocessing, computing, publishing
    progress = Column(Float, nullable=True)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    result_summary = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("analysis_jobs.id"), nullable=False)
    geometry = Column(Geometry('POLYGON', srid=4326), nullable=True)
    metrics = Column(JSONB, nullable=True)
    confidence = Column(Float, nullable=True)
    provenance = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ChangeEvent(Base):
    __tablename__ = "change_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    watershed_id = Column(UUID(as_uuid=True), ForeignKey("watersheds.id"), nullable=True)
    area_geom = Column(Geometry('POLYGON', srid=4326), nullable=True)
    from_date = Column(DateTime, nullable=False)
    to_date = Column(DateTime, nullable=False)
    metric = Column(String, nullable=False)  # ndvi_change, water_change, lulc_change
    delta = Column(Float, nullable=True)
    from_value = Column(Float, nullable=True)
    to_value = Column(Float, nullable=True)
    confidence = Column(Float, nullable=True)
    severity = Column(String, nullable=True)  # low, medium, high, critical
    provenance = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(String, nullable=False)
    action = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)
    resource_id = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    request_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    metadata_info = Column(JSONB, nullable=True)
