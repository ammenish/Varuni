import json
import urllib.request
import random
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Watershed, Intervention, ChangeAnalysis

# Note: Bhuvan / SRISHTI-DRISHTI APIs require official MoRD/NIC credentials.
# For this blueprint, we fetch open-source administrative boundaries from a public GIS repository
# as a proxy for actual watershed boundaries.
PROXY_GEOJSON_URL = "https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson"

def seed_real_data():
    print(f"Fetching real GIS data from {PROXY_GEOJSON_URL}...")
    req = urllib.request.Request(PROXY_GEOJSON_URL, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
    
    # We will pick 5 random districts to represent our watersheds
    features = data.get("features", [])
    # Let's pick specific indices to ensure they are distributed
    selected_features = [features[10], features[50], features[100], features[250], features[400]]
    
    db: Session = SessionLocal()
    
    # Clear existing
    print("Clearing old dummy data...")
    db.query(ChangeAnalysis).delete()
    db.query(Intervention).delete()
    db.query(Watershed).delete()
    db.commit()

    print("Inserting real geospatial boundaries into database...")
    for idx, feature in enumerate(selected_features):
        props = feature.get("properties", {})
        name = props.get("NAME_2", f"Watershed Region {idx}")
        state = props.get("NAME_1", "India")
        geom = feature.get("geometry")
        
        # Calculate a rough center for the map
        coords = geom["coordinates"][0][0] if geom["type"] == "Polygon" else geom["coordinates"][0][0][0]
        center_lon = sum(c[0] for c in coords) / len(coords)
        center_lat = sum(c[1] for c in coords) / len(coords)

        ndvi = round(random.uniform(0.4, 0.85), 2)
        ndwi = round(random.uniform(0.1, 0.4), 2)
        
        ws = Watershed(
            id=f"ws-real-{idx}",
            name=name,
            state=state,
            geometry=json.dumps(geom),
            center_lat=center_lat,
            center_lon=center_lon,
            area_sqkm=round(random.uniform(200, 800), 2),
            ndvi=ndvi,
            ndwi=ndwi,
            population=int(random.uniform(10000, 90000)),
            status=random.choice(["healthy", "critical", "degraded"])
        )
        db.add(ws)
        
        # Add interventions
        for i in range(5):
            inv = Intervention(
                id=f"int-real-{idx}-{i}",
                watershed_id=ws.id,
                name=f"Intervention {name} #{i+1}",
                type=random.choice(["check_dam", "farm_pond", "contour_bund", "plantation"]),
                status=random.choice(["proposed", "observed", "verified", "needs_review"]),
                cost=int(random.uniform(50000, 2000000))
            )
            db.add(inv)
            
        # Add changes
        for i in range(3):
            delta = round(random.uniform(-0.5, 0.5), 3)
            chg = ChangeAnalysis(
                id=f"chg-real-{idx}-{i}",
                watershed_id=ws.id,
                metric=random.choice(["ndvi_change", "water_area", "lulc_change"]),
                delta=delta,
                confidence=round(random.uniform(0.65, 0.98), 2),
                severity="critical" if abs(delta) > 0.2 else "high" if abs(delta) > 0.12 else "low"
            )
            db.add(chg)
            
    db.commit()
    db.close()
    print("Database seeded with real geospatial boundaries successfully!")

if __name__ == "__main__":
    seed_real_data()
