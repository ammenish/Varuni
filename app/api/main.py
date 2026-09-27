"""
Watershed Geospatial Intelligence API — Complete FastAPI Backend
Serves all endpoints using generated demo data. In production, swap
seed_data calls for PostGIS/SQLAlchemy queries.
"""
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import seed_data

app = FastAPI(
    title="Watershed Geospatial Intelligence API",
    description="Backend API for watershed visualization, geospatial analysis, NDVI/NDWI heatmaps, interventions, satellite imagery, and decision support.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Cache generated data at startup ─────────────────────
import urllib.request
import json
import sys

# Try fetching real Indian geospatial boundaries, with a short timeout for local dev
_watersheds_geojson = None
try:
    print("Fetching real Indian geospatial boundaries from Github...", flush=True)
    req = urllib.request.Request("https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson", headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as response:
        _real_geojson = json.loads(response.read().decode())
    
    # Pick a few districts to map to our 4 watersheds
    _watersheds_geojson = {"type": "FeatureCollection", "features": []}
    for idx, ws in enumerate(seed_data.INDIAN_WATERSHEDS[:4]):
        feat = _real_geojson["features"][idx * 15 + 12] 
        feat["id"] = ws["id"]
        feat["properties"] = {**feat["properties"], **ws}
        _watersheds_geojson["features"].append(feat)
    print("Loaded real geospatial data!", flush=True)
except Exception as e:
    print(f"Failed to fetch real data, falling back to mock: {e}", flush=True)
    _watersheds_geojson = seed_data.generate_watershed_geojson()
_interventions = seed_data.generate_interventions()
_ndvi_heatmap = seed_data.generate_ndvi_heatmap()
_ndwi_heatmap = seed_data.generate_ndwi_heatmap()
_landcover = seed_data.generate_landcover_data()
_time_series = seed_data.generate_time_series()
_change_events = seed_data.generate_change_events()
_satellite_scenes = seed_data.generate_satellite_scenes()
_analysis_jobs = seed_data.generate_analysis_jobs()
_quality_alerts = seed_data.generate_quality_alerts()
_dashboard_stats = seed_data.get_dashboard_stats()


# ═══════════════════════════════════════════════════════════
# HEALTH
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "service": "watershed-api", "version": "1.0.0"}


@app.get("/")
def root():
    return {"message": "Watershed Geospatial Intelligence API", "docs": "/docs"}


# ═══════════════════════════════════════════════════════════
# DASHBOARD
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/dashboard/stats")
def get_dashboard_stats():
    """Aggregated KPI statistics for the overview dashboard."""
    return _dashboard_stats


@app.get("/api/v1/dashboard/recent-changes")
def get_recent_changes(limit: int = Query(10, ge=1, le=50)):
    """Most recent change detection events."""
    sorted_events = sorted(_change_events, key=lambda x: x["to_date"], reverse=True)
    return sorted_events[:limit]


@app.get("/api/v1/dashboard/quality-alerts")
def get_quality_alerts(limit: int = Query(15, ge=1, le=50)):
    """Active data quality alerts."""
    return _quality_alerts[:limit]


# ═══════════════════════════════════════════════════════════
# WATERSHEDS
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/watersheds")
def get_watersheds(
    state: Optional[str] = None,
    district: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """List all watersheds with optional filtering."""
    results = []
    for ws in seed_data.INDIAN_WATERSHEDS:
        if state and ws["state"].lower() != state.lower():
            continue
        if district and ws["district"].lower() != district.lower():
            continue
        results.append(ws)
    return results[skip:skip+limit]


@app.get("/api/v1/watersheds/geojson")
def get_watersheds_geojson(
    state: Optional[str] = None,
    metric: Optional[str] = Query(None, description="Color-code by: ndvi, ndwi, area_sqkm, population")
):
    """Full GeoJSON FeatureCollection for map rendering."""
    if not state:
        return _watersheds_geojson
    features = [
        f for f in _watersheds_geojson["features"]
        if f["properties"]["state"].lower() == state.lower()
    ]
    return {"type": "FeatureCollection", "features": features}


@app.get("/api/v1/watersheds/{watershed_id}")
def get_watershed_detail(watershed_id: str):
    """Detailed watershed info with geometry."""
    for ws in seed_data.INDIAN_WATERSHEDS:
        if ws["id"] == watershed_id:
            # Find matching geojson feature
            for f in _watersheds_geojson["features"]:
                if f["id"] == watershed_id:
                    return {**ws, "geometry": f["geometry"], "properties": f["properties"]}
            return ws
    raise HTTPException(status_code=404, detail="Watershed not found")


@app.get("/api/v1/watersheds/{watershed_id}/time-series")
def get_watershed_time_series(watershed_id: str, metric: str = "ndvi"):
    """Monthly time series for a specific watershed."""
    if watershed_id in _time_series:
        ts = _time_series[watershed_id]
        if metric in ts:
            return {"watershed_id": watershed_id, "name": ts["name"], "metric": metric, "data": ts[metric]}
    raise HTTPException(status_code=404, detail="Time series not found")


# ═══════════════════════════════════════════════════════════
# HEATMAPS / SPECTRAL INDICES
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/heatmap/ndvi")
def get_ndvi_heatmap(watershed_id: Optional[str] = None):
    """NDVI (vegetation) heatmap data points."""
    points = _ndvi_heatmap
    if watershed_id:
        ws = next((w for w in seed_data.INDIAN_WATERSHEDS if w["id"] == watershed_id), None)
        if ws:
            points = [p for p in points if p["watershed"] == ws["name"]]
    return {"metric": "NDVI", "unit": "index (-1 to 1)", "points": points, "total": len(points)}


@app.get("/api/v1/heatmap/ndwi")
def get_ndwi_heatmap(watershed_id: Optional[str] = None):
    """NDWI (water) heatmap data points."""
    points = _ndwi_heatmap
    if watershed_id:
        ws = next((w for w in seed_data.INDIAN_WATERSHEDS if w["id"] == watershed_id), None)
        if ws:
            points = [p for p in points if p["watershed"] == ws["name"]]
    return {"metric": "NDWI", "unit": "index (-1 to 1)", "points": points, "total": len(points)}


@app.get("/api/v1/heatmap/interventions")
def get_intervention_heatmap():
    """Intervention density heatmap."""
    points = []
    for inv in _interventions:
        points.append({
            "latitude": inv["latitude"],
            "longitude": inv["longitude"],
            "value": 1.0,
            "type": inv["type"]
        })
    return {"metric": "Intervention Density", "points": points, "total": len(points)}


# ═══════════════════════════════════════════════════════════
# LAND COVER
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/landcover")
def get_landcover_data(watershed_id: Optional[str] = None):
    """Land use / land cover classification breakdown."""
    if watershed_id:
        for dist in _landcover["distribution"]:
            if dist["watershed_id"] == watershed_id:
                return {"class_definitions": _landcover["class_definitions"], "distribution": [dist]}
    return _landcover


# ═══════════════════════════════════════════════════════════
# INTERVENTIONS
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/interventions")
def get_interventions(
    watershed_id: Optional[str] = None,
    type: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """List interventions with filtering."""
    results = _interventions
    if watershed_id:
        results = [i for i in results if i["watershed_id"] == watershed_id]
    if type:
        results = [i for i in results if i["type"] == type]
    if status:
        results = [i for i in results if i["status"] == status]
    return {"total": len(results), "items": results[skip:skip+limit]}


@app.get("/api/v1/interventions/geojson")
def get_interventions_geojson(
    watershed_id: Optional[str] = None,
    type: Optional[str] = None
):
    """GeoJSON for intervention markers on the map."""
    invs = _interventions
    if watershed_id:
        invs = [i for i in invs if i["watershed_id"] == watershed_id]
    if type:
        invs = [i for i in invs if i["type"] == type]
    
    features = []
    for inv in invs:
        features.append({
            "type": "Feature",
            "id": inv["id"],
            "properties": {
                "id": inv["id"],
                "name": inv["name"],
                "type": inv["type"],
                "status": inv["status"],
                "watershed_name": inv["watershed_name"],
                "cost_estimate": inv.get("cost_estimate"),
                "beneficiaries": inv.get("beneficiaries"),
            },
            "geometry": {
                "type": "Point",
                "coordinates": [inv["longitude"], inv["latitude"]]
            }
        })
    return {"type": "FeatureCollection", "features": features}


# ═══════════════════════════════════════════════════════════
# SATELLITE SCENES
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/satellite/scenes")
def get_satellite_scenes(
    watershed_id: Optional[str] = None,
    provider: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    """Satellite scene catalog."""
    scenes = _satellite_scenes
    if watershed_id:
        scenes = [s for s in scenes if s["watershed_id"] == watershed_id]
    if provider:
        scenes = [s for s in scenes if s["provider"].lower() == provider.lower()]
    return {"total": len(scenes), "items": scenes[skip:skip+limit]}


@app.get("/api/v1/satellite/providers")
def get_satellite_providers():
    """List available satellite data providers."""
    providers = {}
    for s in _satellite_scenes:
        p = s["provider"]
        if p not in providers:
            providers[p] = {"name": p, "sensor": s["sensor"], "resolution_m": s["resolution_m"], "scene_count": 0}
        providers[p]["scene_count"] += 1
    return list(providers.values())


# ═══════════════════════════════════════════════════════════
# CHANGE DETECTION
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/changes")
def get_change_events(
    watershed_id: Optional[str] = None,
    metric: Optional[str] = None,
    severity: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    """Change detection events."""
    events = _change_events
    if watershed_id:
        events = [e for e in events if e["watershed_id"] == watershed_id]
    if metric:
        events = [e for e in events if e["metric"] == metric]
    if severity:
        events = [e for e in events if e["severity"] == severity]
    return {"total": len(events), "items": events[skip:skip+limit]}


@app.get("/api/v1/changes/geojson")
def get_changes_geojson(severity: Optional[str] = None):
    """GeoJSON points for change events overlay on map."""
    events = _change_events
    if severity:
        events = [e for e in events if e["severity"] == severity]
    
    features = []
    for ev in events:
        features.append({
            "type": "Feature",
            "id": ev["id"],
            "properties": {
                "id": ev["id"],
                "metric": ev["metric"],
                "delta": ev["delta"],
                "severity": ev["severity"],
                "confidence": ev["confidence"],
                "watershed_name": ev["watershed_name"],
                "from_date": ev["from_date"],
                "to_date": ev["to_date"],
            },
            "geometry": {
                "type": "Point",
                "coordinates": ev["center"]
            }
        })
    return {"type": "FeatureCollection", "features": features}


# ═══════════════════════════════════════════════════════════
# ANALYSIS JOBS
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/analysis/jobs")
def get_analysis_jobs(
    status: Optional[str] = None,
    type: Optional[str] = None,
    skip: int = 0,
    limit: int = 30
):
    """Analysis job history."""
    jobs = _analysis_jobs
    if status:
        jobs = [j for j in jobs if j["status"] == status]
    if type:
        jobs = [j for j in jobs if j["type"] == type]
    return {"total": len(jobs), "items": jobs[skip:skip+limit]}


# ═══════════════════════════════════════════════════════════
# LAYERS CATALOG
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/layers")
def get_layers_catalog():
    """Available map layers."""
    return [
        {"id": "watersheds", "name": "Watershed Boundaries", "type": "vector", "group": "Administrative", "enabled": True},
        {"id": "interventions", "name": "Interventions", "type": "vector", "group": "Field Data", "enabled": True},
        {"id": "ndvi_heatmap", "name": "NDVI Vegetation Index", "type": "heatmap", "group": "Spectral Indices", "enabled": False},
        {"id": "ndwi_heatmap", "name": "NDWI Water Index", "type": "heatmap", "group": "Spectral Indices", "enabled": False},
        {"id": "landcover", "name": "Land Use / Land Cover", "type": "choropleth", "group": "Classification", "enabled": False},
        {"id": "changes", "name": "Change Events", "type": "vector", "group": "Analysis", "enabled": False},
        {"id": "drainage", "name": "Drainage Network", "type": "vector", "group": "Hydrology", "enabled": False},
        {"id": "elevation", "name": "Digital Elevation", "type": "raster", "group": "Terrain", "enabled": False},
        {"id": "slope", "name": "Slope Map", "type": "raster", "group": "Terrain", "enabled": False},
        {"id": "satellite", "name": "Satellite Imagery", "type": "raster", "group": "Satellite", "enabled": False},
    ]


# ═══════════════════════════════════════════════════════════
# AUDIT
# ═══════════════════════════════════════════════════════════
@app.get("/api/v1/audit")
def get_audit_events(skip: int = 0, limit: int = 50):
    """Audit trail."""
    from datetime import datetime, timedelta
    import random
    actions = ["view_watershed", "upload_image", "run_analysis", "export_report", "update_intervention", "login"]
    events = []
    for i in range(min(limit, 50)):
        events.append({
            "id": f"audit-{i:04d}",
            "actor_id": f"user-{random.randint(1,5):03d}",
            "action": random.choice(actions),
            "resource_type": "watershed",
            "resource_id": random.choice(seed_data.INDIAN_WATERSHEDS)["id"],
            "timestamp": (datetime.now() - timedelta(hours=random.randint(0, 720))).isoformat(),
        })
    return {"total": len(events), "items": events}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
