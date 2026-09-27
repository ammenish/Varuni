# 01 - MASTER ARCHITECTURE

## 1. Product mission
Transform geo-coded field photographs from documentation into spatially contextualized watershed intelligence by joining field observations with watershed boundaries, satellite/raster layers, thematic layers, time-series observations, and analytical outputs.

## 2. Core principle
Field reality -> location -> watershed context -> satellite context -> analysis -> change -> evidence -> decision support.

## 3. System layers
- Client: web dashboard, responsive field/PWA capture, admin console.
- API: authentication, project/watershed, imagery, analysis, reports, audit.
- Geospatial services: vector/raster tiles, spatial query, reprojection, clipping, zonal statistics.
- Processing: asynchronous jobs for imagery ingestion, metadata extraction, raster indices, classification, change detection.
- AI: image quality, scene/intervention classification, semantic tagging, anomaly assistance; all outputs confidence-scored.
- Data: PostgreSQL/PostGIS for structured spatial data; object storage for original/derived imagery; cache for tiles and frequent queries.
- Observability: logs, metrics, traces, audit events, job status, model/version registry.

## 4. Recommended stack
Frontend: Next.js/React + TypeScript + Tailwind + MapLibre GL JS.
Backend: FastAPI + Python.
Spatial: PostgreSQL/PostGIS, GDAL, Rasterio, GeoPandas, Shapely, pyproj.
Async: Celery/RQ/Temporal-style job queue; Redis for queue/cache.
Storage: S3-compatible object storage/MinIO for prototype; government-approved storage in production.
AI: PyTorch/ONNX Runtime where appropriate; scikit-learn for classical models.
Deployment: Docker; Kubernetes only when scale requires it.

## 5. High-level data flow
1. Upload/import geo-coded images.
2. Validate file type, size, metadata, malware status, and coordinate sanity.
3. Extract EXIF/GPS/time metadata where available.
4. Normalize CRS to a canonical internal CRS and preserve original metadata.
5. Spatially associate image with watershed/village/block/district polygons.
6. Link image to nearest/containing satellite observations and thematic layers.
7. Run image-quality and optional AI classification jobs.
8. Run raster analysis: NDVI/NDWI or sensor-appropriate indices, zonal statistics, land-use/land-cover, change detection.
9. Store immutable raw inputs and versioned derived outputs.
10. Expose map layers, image evidence, analytics, and reports.
11. Record every material analytical action in audit logs.

## 6. Core domain objects
- Organization
- User
- Role
- Watershed
- Administrative boundary
- Geo-coded image
- Image observation
- Intervention
- Satellite scene
- Raster asset
- Vector layer
- Analysis job
- Analysis result
- Model/version
- Change event
- Report
- Audit event

## 7. Spatial database design
watersheds(id, name, geometry, area, source, version)
images(id, object_uri, captured_at, latitude, longitude, geom, watershed_id, quality_status, privacy_status)
interventions(id, type, geom, watershed_id, observed_at, status, source)
satellite_scenes(id, provider, acquisition_time, footprint, cloud_cover, source_uri, processing_level)
raster_assets(id, scene_id, band_set, crs, resolution, uri, checksum, version)
analysis_jobs(id, type, input_refs, model_version, status, started_at, completed_at)
analysis_results(id, job_id, geometry, metrics_json, confidence, provenance)
change_events(id, area, from_date, to_date, metric, delta, confidence, provenance)
audit_events(id, actor_id, action, resource_type, resource_id, timestamp, request_id, metadata)

## 8. API groups
/auth - login/session/token lifecycle
/watersheds - browse/filter/detail
/images - upload/list/detail/preview/metadata
/layers - vector/raster layer catalog
/satellite - scenes/coverage/metadata
/analysis - submit/status/results
/interventions - CRUD with approval workflow
/changes - time comparison and change events
/reports - generate/export reports
/admin - users/roles/model versions/system configuration
/audit - authorized audit access
/health - liveness/readiness/dependency health

## 9. API rules
- Version APIs, e.g. /api/v1.
- Validate every request with typed schemas.
- Never trust client-supplied geometry without validation.
- Enforce bounding boxes, pagination, rate limits, and upload limits.
- Use idempotency keys for long-running submission endpoints.
- Return stable error codes, not internal stack traces.
- Use signed/authorized URLs for protected objects.
- Keep analytical provenance with every result.

## 10. Upload pipeline
Client -> TLS -> API gateway -> malware/content validation -> metadata extraction -> image normalization -> privacy redaction pipeline if enabled -> object storage -> metadata DB -> async processing -> result notification.

## 11. Raster pipeline
Source scene -> integrity check -> CRS check -> cloud/quality mask -> clipping -> resampling only when scientifically justified -> index/classification -> zonal statistics -> tile generation -> versioned result.

## 12. Tile architecture
Use vector tiles for boundaries/points and raster tiles for imagery/continuous surfaces. Never send full-resolution national rasters to the browser. Progressive loading: boundary -> low-resolution context -> requested tile -> detail layer.

## 13. Search/filter architecture
Filters should be spatially aware: state, district, block, watershed, intervention type, date range, image confidence, vegetation range, water range, change magnitude. Use indexed PostGIS queries and precomputed aggregates for dashboards.

## 14. Reporting
Generate reproducible reports containing: study area, source datasets, acquisition dates, methods, model versions, map outputs, metrics, confidence/limitations, and audit/provenance identifiers.

## 15. Background jobs
- image_metadata_extract
- image_quality_check
- image_ai_classify
- satellite_ingest
- raster_preprocess
- spectral_index
- landcover_classify
- change_detect
- zonal_statistics
- tile_generate
- report_generate
- retention_cleanup

## 16. Failure strategy
Every job has queued/running/succeeded/failed/cancelled states. Preserve failure reason and retry count. Scientific failures must not be silently replaced by guessed values. UI should clearly mark missing, stale, low-confidence, and failed analyses.

## 17. Observability
Track API latency, job duration, queue depth, ingestion failures, raster processing failures, model latency, model confidence distributions, storage errors, authentication failures, and unusual access patterns.

## 18. Deployment environments
Local -> development -> staging -> production. Separate credentials, storage, databases, model registries, and analytics data by environment. Production data must never be copied into development without approved anonymization/minimization.

## 19. Infrastructure security
Private subnets where possible; no direct database exposure; TLS everywhere; secrets manager; least-privilege service identities; immutable backups; network segmentation; WAF/API gateway; dependency scanning; container image scanning.

## 20. A-to-Z delivery sequence
A Requirements
B Data inventory
C UX flows
D Domain model
E GIS schema
F Frontend shell
G Geo-coded ingestion
H Satellite ingestion
I Image quality
J Index computation
K Land-cover/classification
L Change detection
M Map layers
N Analytics
O Reports
P Permissions
Q Audit
R Security testing
S Performance testing
T Model validation
U Accessibility
V Deployment
W User acceptance
X Data-quality signoff
Y Production readiness
Z Operations/runbook

## 21. Micro-animation architecture
Animations are functional, not decorative:
- route transition: 120-180 ms
- filter chip add/remove: 120-160 ms
- map marker selection: scale 0.95 -> 1.0, 140 ms
- image panel: slide/fade 180-240 ms
- layer toggle: fade 120-180 ms
- loading: skeleton/shimmer; never block map interaction unnecessarily
- analysis running: progress state with stage label, not fake percentage
- analysis complete: subtle check transition
- error: no shaking; use clear inline status
- hover: 80-120 ms
- modal: 160-220 ms
Respect prefers-reduced-motion and provide instant state changes for reduced-motion users.

## 22. Never do
- Fake analytical values.
- Fake satellite coverage.
- Claim causality from simple before/after correlation.
- Hide model uncertainty.
- Mix datasets with incompatible CRS/resolution/date without documenting transformation.
- Store raw personal images indefinitely by default.
- Put secrets in frontend code.
