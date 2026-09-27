"""
Comprehensive seed/mock data for the Watershed Geospatial Intelligence Platform.
Provides realistic Indian watershed data with GeoJSON geometries, NDVI/NDWI values,
interventions, satellite scenes, and analysis results.
"""
import uuid
import random
import math
from datetime import datetime, timedelta

# ─── Indian Watershed Regions ─────────────────────────────
INDIAN_WATERSHEDS = [
    {
        "id": "ws-001", "name": "Mahanadi Upper Basin", "state": "Chhattisgarh", "district": "Raipur",
        "block": "Dharsiwa", "center": [81.63, 21.25], "area_sqkm": 342.5, "ndvi": 0.72, "ndwi": 0.31,
        "elevation_min": 260, "elevation_max": 520, "population": 45200, "landcover": "cropland"
    },
    {
        "id": "ws-002", "name": "Godavari Sub-Basin", "state": "Maharashtra", "district": "Nashik",
        "block": "Trimbakeshwar", "center": [73.53, 19.94], "area_sqkm": 518.2, "ndvi": 0.58, "ndwi": 0.22,
        "elevation_min": 580, "elevation_max": 1200, "population": 32100, "landcover": "mixed_forest"
    },
    {
        "id": "ws-003", "name": "Cauvery Delta Zone", "state": "Tamil Nadu", "district": "Thanjavur",
        "block": "Papanasam", "center": [79.14, 10.78], "area_sqkm": 275.8, "ndvi": 0.81, "ndwi": 0.45,
        "elevation_min": 5, "elevation_max": 85, "population": 67800, "landcover": "paddy"
    },
    {
        "id": "ws-004", "name": "Sabarmati Watershed", "state": "Gujarat", "district": "Ahmedabad",
        "block": "Daskroi", "center": [72.58, 23.03], "area_sqkm": 412.0, "ndvi": 0.45, "ndwi": 0.15,
        "elevation_min": 45, "elevation_max": 180, "population": 89500, "landcover": "urban_fringe"
    },
    {
        "id": "ws-005", "name": "Narmada Headwaters", "state": "Madhya Pradesh", "district": "Anuppur",
        "block": "Amarkantak", "center": [81.75, 22.67], "area_sqkm": 625.3, "ndvi": 0.78, "ndwi": 0.38,
        "elevation_min": 450, "elevation_max": 1048, "population": 18200, "landcover": "dense_forest"
    },
    {
        "id": "ws-006", "name": "Krishna Upper Basin", "state": "Karnataka", "district": "Belgaum",
        "block": "Khanapur", "center": [74.51, 15.64], "area_sqkm": 385.7, "ndvi": 0.65, "ndwi": 0.28,
        "elevation_min": 520, "elevation_max": 870, "population": 28900, "landcover": "deciduous_forest"
    },
    {
        "id": "ws-007", "name": "Brahmaputra Floodplain", "state": "Assam", "district": "Kamrup",
        "block": "Chandrapur", "center": [91.74, 26.14], "area_sqkm": 890.1, "ndvi": 0.83, "ndwi": 0.52,
        "elevation_min": 42, "elevation_max": 195, "population": 72300, "landcover": "wetland"
    },
    {
        "id": "ws-008", "name": "Tapi River Basin", "state": "Maharashtra", "district": "Jalgaon",
        "block": "Raver", "center": [76.03, 21.25], "area_sqkm": 298.4, "ndvi": 0.52, "ndwi": 0.19,
        "elevation_min": 180, "elevation_max": 420, "population": 35600, "landcover": "scrubland"
    },
    {
        "id": "ws-009", "name": "Subarnarekha Micro-Watershed", "state": "Jharkhand", "district": "Ranchi",
        "block": "Bundu", "center": [85.59, 23.16], "area_sqkm": 178.9, "ndvi": 0.61, "ndwi": 0.24,
        "elevation_min": 350, "elevation_max": 680, "population": 22100, "landcover": "agriculture"
    },
    {
        "id": "ws-010", "name": "Pennar Basin South", "state": "Andhra Pradesh", "district": "Kurnool",
        "block": "Nandyal", "center": [78.48, 15.52], "area_sqkm": 445.6, "ndvi": 0.48, "ndwi": 0.12,
        "elevation_min": 200, "elevation_max": 550, "population": 41200, "landcover": "dryland"
    },
    {
        "id": "ws-011", "name": "Damodar Valley Section", "state": "West Bengal", "district": "Burdwan",
        "block": "Durgapur", "center": [87.32, 23.55], "area_sqkm": 520.8, "ndvi": 0.55, "ndwi": 0.20,
        "elevation_min": 80, "elevation_max": 310, "population": 58700, "landcover": "industrial"
    },
    {
        "id": "ws-012", "name": "Chambal Ravine Zone", "state": "Rajasthan", "district": "Kota",
        "block": "Ladpura", "center": [75.86, 25.18], "area_sqkm": 367.2, "ndvi": 0.38, "ndwi": 0.08,
        "elevation_min": 240, "elevation_max": 480, "population": 31500, "landcover": "barren"
    },
]

INTERVENTION_TYPES = [
    "check_dam", "farm_pond", "contour_bund", "percolation_tank",
    "gabion_structure", "loose_boulder", "drainage_line", "plantation",
    "water_harvesting", "terrace_farming"
]

INTERVENTION_STATUSES = ["proposed", "observed", "verified", "needs_review", "archived"]


def _make_polygon(center, size_deg=0.15):
    """Generate a realistic irregular polygon around a center point."""
    lon, lat = center
    points = []
    num_vertices = random.randint(6, 10)
    for i in range(num_vertices):
        angle = (2 * math.pi * i) / num_vertices + random.uniform(-0.3, 0.3)
        r = size_deg * (0.6 + random.random() * 0.8)
        px = lon + r * math.cos(angle)
        py = lat + r * math.sin(angle) * 0.8
        points.append([round(px, 6), round(py, 6)])
    points.append(points[0])  # close ring
    return {
        "type": "Polygon",
        "coordinates": [points]
    }


def generate_watershed_geojson():
    """Generate complete GeoJSON FeatureCollection for all watersheds."""
    features = []
    for ws in INDIAN_WATERSHEDS:
        size = math.sqrt(ws["area_sqkm"]) / 100 * 0.8
        geometry = _make_polygon(ws["center"], size_deg=max(0.08, min(size, 0.25)))
        feature = {
            "type": "Feature",
            "id": ws["id"],
            "properties": {
                "id": ws["id"],
                "name": ws["name"],
                "state": ws["state"],
                "district": ws["district"],
                "block": ws["block"],
                "area_sqkm": ws["area_sqkm"],
                "ndvi": ws["ndvi"],
                "ndwi": ws["ndwi"],
                "elevation_min": ws["elevation_min"],
                "elevation_max": ws["elevation_max"],
                "population": ws["population"],
                "landcover": ws["landcover"],
                "drainage_density": round(random.uniform(1.2, 4.8), 2),
                "slope_avg": round(random.uniform(2, 25), 1),
                "perimeter_km": round(math.sqrt(ws["area_sqkm"]) * 4.2, 1),
            },
            "geometry": geometry
        }
        features.append(feature)
    return {"type": "FeatureCollection", "features": features}


def generate_interventions():
    """Generate realistic intervention data for each watershed."""
    interventions = []
    for ws in INDIAN_WATERSHEDS:
        num = random.randint(5, 20)
        for i in range(num):
            lon = ws["center"][0] + random.uniform(-0.12, 0.12)
            lat = ws["center"][1] + random.uniform(-0.10, 0.10)
            itype = random.choice(INTERVENTION_TYPES)
            interventions.append({
                "id": f"int-{ws['id'][-3:]}-{i:03d}",
                "name": f"{itype.replace('_', ' ').title()} #{i+1}",
                "type": itype,
                "latitude": round(lat, 6),
                "longitude": round(lon, 6),
                "watershed_id": ws["id"],
                "watershed_name": ws["name"],
                "status": random.choice(INTERVENTION_STATUSES),
                "observed_at": (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat(),
                "cost_estimate": round(random.uniform(50000, 2500000), 0),
                "beneficiaries": random.randint(50, 5000),
                "description": f"{itype.replace('_', ' ').title()} intervention in {ws['district']} block.",
            })
    return interventions


def generate_ndvi_heatmap():
    """Generate NDVI heatmap data points covering Indian watershed regions."""
    points = []
    for ws in INDIAN_WATERSHEDS:
        num_points = random.randint(20, 50)
        for _ in range(num_points):
            lon = ws["center"][0] + random.uniform(-0.2, 0.2)
            lat = ws["center"][1] + random.uniform(-0.15, 0.15)
            ndvi_val = ws["ndvi"] + random.uniform(-0.2, 0.15)
            ndvi_val = max(-0.1, min(1.0, ndvi_val))
            points.append({
                "latitude": round(lat, 5),
                "longitude": round(lon, 5),
                "value": round(ndvi_val, 3),
                "watershed": ws["name"]
            })
    return points


def generate_ndwi_heatmap():
    """Generate NDWI heatmap data points."""
    points = []
    for ws in INDIAN_WATERSHEDS:
        num_points = random.randint(15, 40)
        for _ in range(num_points):
            lon = ws["center"][0] + random.uniform(-0.2, 0.2)
            lat = ws["center"][1] + random.uniform(-0.15, 0.15)
            ndwi_val = ws["ndwi"] + random.uniform(-0.15, 0.1)
            ndwi_val = max(-0.3, min(1.0, ndwi_val))
            points.append({
                "latitude": round(lat, 5),
                "longitude": round(lon, 5),
                "value": round(ndwi_val, 3),
                "watershed": ws["name"]
            })
    return points


def generate_landcover_data():
    """Generate land cover classification data."""
    classes = {
        "dense_forest": {"color": "#006400", "label": "Dense Forest"},
        "deciduous_forest": {"color": "#228B22", "label": "Deciduous Forest"},
        "mixed_forest": {"color": "#32CD32", "label": "Mixed Forest"},
        "cropland": {"color": "#FFD700", "label": "Cropland"},
        "paddy": {"color": "#ADFF2F", "label": "Paddy/Rice"},
        "agriculture": {"color": "#F0E68C", "label": "Agriculture"},
        "dryland": {"color": "#DEB887", "label": "Dryland/Rainfed"},
        "scrubland": {"color": "#D2B48C", "label": "Scrubland"},
        "barren": {"color": "#A0522D", "label": "Barren Land"},
        "wetland": {"color": "#4169E1", "label": "Wetland"},
        "urban_fringe": {"color": "#FF6347", "label": "Urban/Built-up"},
        "industrial": {"color": "#808080", "label": "Industrial"},
        "water_body": {"color": "#1E90FF", "label": "Water Body"},
    }
    
    distribution = []
    for ws in INDIAN_WATERSHEDS:
        # Primary class gets biggest share
        primary = ws["landcover"]
        shares = {}
        shares[primary] = round(random.uniform(35, 55), 1)
        remaining = 100 - shares[primary]
        
        # Add 3-5 other classes
        other_classes = [c for c in classes if c != primary]
        random.shuffle(other_classes)
        for cls in other_classes[:4]:
            share = round(random.uniform(5, remaining / 3), 1)
            shares[cls] = share
            remaining -= share
        if remaining > 0:
            shares[other_classes[4]] = round(remaining, 1)
        
        distribution.append({
            "watershed_id": ws["id"],
            "watershed_name": ws["name"],
            "classes": shares,
        })
    
    return {"class_definitions": classes, "distribution": distribution}


def generate_time_series():
    """Generate monthly NDVI and NDWI time series for the past 2 years."""
    series = {}
    base_date = datetime(2024, 1, 1)
    for ws in INDIAN_WATERSHEDS:
        ndvi_series = []
        ndwi_series = []
        for m in range(24):
            dt = base_date + timedelta(days=30 * m)
            # Seasonal pattern: higher in monsoon (Jul-Oct), lower in dry (Mar-May)
            month = dt.month
            seasonal = 0.15 * math.sin((month - 3) * math.pi / 6)
            
            ndvi_val = ws["ndvi"] + seasonal + random.uniform(-0.05, 0.05)
            ndwi_val = ws["ndwi"] + seasonal * 0.7 + random.uniform(-0.03, 0.03)
            
            ndvi_series.append({
                "date": dt.strftime("%Y-%m"),
                "value": round(max(0, min(1, ndvi_val)), 3)
            })
            ndwi_series.append({
                "date": dt.strftime("%Y-%m"),
                "value": round(max(-0.3, min(1, ndwi_val)), 3)
            })
        
        series[ws["id"]] = {
            "ndvi": ndvi_series,
            "ndwi": ndwi_series,
            "name": ws["name"]
        }
    return series


def generate_change_events():
    """Generate realistic change detection events."""
    events = []
    metrics = ["ndvi_change", "water_area_change", "lulc_change", "vegetation_loss", "erosion_risk"]
    severities = ["low", "medium", "high", "critical"]
    
    for ws in INDIAN_WATERSHEDS:
        num_events = random.randint(2, 6)
        for _ in range(num_events):
            metric = random.choice(metrics)
            delta = round(random.uniform(-0.3, 0.3), 3)
            severity = "critical" if abs(delta) > 0.25 else "high" if abs(delta) > 0.15 else "medium" if abs(delta) > 0.08 else "low"
            
            from_date = datetime.now() - timedelta(days=random.randint(60, 365))
            to_date = from_date + timedelta(days=random.randint(30, 180))
            
            events.append({
                "id": f"chg-{len(events):04d}",
                "watershed_id": ws["id"],
                "watershed_name": ws["name"],
                "from_date": from_date.isoformat(),
                "to_date": to_date.isoformat(),
                "metric": metric,
                "delta": delta,
                "from_value": round(random.uniform(0.2, 0.8), 3),
                "to_value": round(random.uniform(0.2, 0.8), 3),
                "confidence": round(random.uniform(0.65, 0.98), 2),
                "severity": severity,
                "center": [
                    ws["center"][0] + random.uniform(-0.05, 0.05),
                    ws["center"][1] + random.uniform(-0.05, 0.05)
                ]
            })
    return events


def generate_satellite_scenes():
    """Generate satellite scene catalog."""
    providers = [
        ("SRISHTI-DRISHTI", "MultiSpectral", 30.0),
        ("Sentinel-2", "MSI", 10.0),
        ("Landsat-9", "OLI", 30.0),
        ("CARTOSAT-3", "PAN", 0.25),
        ("ResourceSat-2A", "LISS-IV", 5.8),
    ]
    scenes = []
    for ws in INDIAN_WATERSHEDS:
        for provider, sensor, res in providers:
            num_scenes = random.randint(1, 4)
            for _ in range(num_scenes):
                acq_date = datetime.now() - timedelta(days=random.randint(1, 365))
                scenes.append({
                    "id": f"sat-{len(scenes):04d}",
                    "provider": provider,
                    "sensor": sensor,
                    "acquisition_time": acq_date.isoformat(),
                    "cloud_cover": round(random.uniform(0, 40), 1),
                    "resolution_m": res,
                    "processing_level": random.choice(["L1C", "L2A", "L1TP", "ORTHO"]),
                    "crs": "EPSG:4326",
                    "watershed_id": ws["id"],
                    "watershed_name": ws["name"],
                    "bounds": [
                        ws["center"][0] - 0.15,
                        ws["center"][1] - 0.12,
                        ws["center"][0] + 0.15,
                        ws["center"][1] + 0.12,
                    ]
                })
    return scenes


def generate_analysis_jobs():
    """Generate analysis job history."""
    job_types = [
        "spectral_index", "landcover_classify", "change_detect",
        "zonal_statistics", "vegetation_analysis", "water_detection",
        "image_quality_check", "anomaly_detection"
    ]
    statuses = ["succeeded", "succeeded", "succeeded", "running", "failed", "queued"]
    jobs = []
    for i in range(30):
        ws = random.choice(INDIAN_WATERSHEDS)
        jtype = random.choice(job_types)
        status = random.choice(statuses)
        started = datetime.now() - timedelta(hours=random.randint(1, 720))
        completed = started + timedelta(minutes=random.randint(2, 120)) if status == "succeeded" else None
        
        jobs.append({
            "id": f"job-{i:04d}",
            "type": jtype,
            "status": status,
            "stage": "publishing" if status == "succeeded" else "computing" if status == "running" else None,
            "watershed_id": ws["id"],
            "watershed_name": ws["name"],
            "model_version": f"v{random.randint(1,3)}.{random.randint(0,9)}",
            "started_at": started.isoformat(),
            "completed_at": completed.isoformat() if completed else None,
            "result_summary": {
                "metric": jtype,
                "mean_value": round(random.uniform(0.3, 0.8), 3),
                "coverage_pct": round(random.uniform(85, 100), 1),
            } if status == "succeeded" else None,
        })
    return jobs


def generate_quality_alerts():
    """Generate data quality alerts."""
    alert_types = [
        "missing_coordinates", "invalid_geometry", "duplicate_image",
        "blurry_image", "stale_satellite", "cloud_contamination",
        "crs_mismatch", "insufficient_coverage", "failed_model", "low_confidence"
    ]
    severities = ["warning", "error", "info"]
    
    alerts = []
    for i in range(15):
        ws = random.choice(INDIAN_WATERSHEDS)
        alerts.append({
            "id": f"alert-{i:04d}",
            "type": random.choice(alert_types),
            "severity": random.choice(severities),
            "watershed_id": ws["id"],
            "watershed_name": ws["name"],
            "message": f"Data quality issue detected in {ws['name']}",
            "created_at": (datetime.now() - timedelta(hours=random.randint(1, 168))).isoformat(),
            "resolved": random.choice([True, False, False]),
        })
    return alerts


def get_dashboard_stats():
    """Aggregate dashboard statistics."""
    interventions = generate_interventions()
    return {
        "total_watersheds": len(INDIAN_WATERSHEDS),
        "total_images": random.randint(3500, 5000),
        "total_interventions": len(interventions),
        "total_analyses": 30,
        "avg_ndvi": round(sum(w["ndvi"] for w in INDIAN_WATERSHEDS) / len(INDIAN_WATERSHEDS), 3),
        "avg_ndwi": round(sum(w["ndwi"] for w in INDIAN_WATERSHEDS) / len(INDIAN_WATERSHEDS), 3),
        "total_water_area_sqkm": round(sum(w["area_sqkm"] * w["ndwi"] for w in INDIAN_WATERSHEDS), 1),
        "vegetation_coverage_pct": round(sum(1 for w in INDIAN_WATERSHEDS if w["ndvi"] > 0.5) / len(INDIAN_WATERSHEDS) * 100, 1),
        "quality_alerts": 15,
        "active_jobs": 3,
        "states_covered": len(set(w["state"] for w in INDIAN_WATERSHEDS)),
        "districts_covered": len(set(w["district"] for w in INDIAN_WATERSHEDS)),
        "intervention_breakdown": {},
        "status_breakdown": {},
    }

    # Count intervention types
    for inv in interventions:
        t = inv["type"]
        if t not in stats["intervention_breakdown"]:
            stats["intervention_breakdown"][t] = 0
        stats["intervention_breakdown"][t] += 1

        s = inv["status"]
        if s not in stats["status_breakdown"]:
            stats["status_breakdown"][s] = 0
        stats["status_breakdown"][s] += 1

    return stats
