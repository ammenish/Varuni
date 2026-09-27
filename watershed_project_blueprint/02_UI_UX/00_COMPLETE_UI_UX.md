# 02 - COMPLETE UI/UX SPECIFICATION

## 1. Experience goal
A calm, professional government-grade geospatial workstation: map-first, evidence-first, low cognitive load, fast filtering, clear provenance, and no decorative motion that interferes with spatial analysis.

## 2. Information architecture
Primary navigation:
1. Overview
2. Watersheds
3. Map Explorer
4. Field Images
5. Interventions
6. Change Analysis
7. Satellite & Layers
8. Reports
9. Data Quality
10. Administration

## 3. Global shell
Top bar: product identity, current study area, global search, notifications, user menu.
Left rail: navigation and layer shortcuts.
Main canvas: map or analytical workspace.
Right drawer: selected feature/image/analysis details.
Bottom utility bar: scale, coordinates, CRS/measurement, layer status, imagery date.

## 4. Design language
- Light neutral canvas with restrained institutional accent colors.
- Use color semantically: water, vegetation, warning, error, neutral.
- Never use color alone to encode a critical state.
- Typography: highly legible sans-serif; minimum body size 14px desktop, larger on touch.
- Cards only where grouping improves comprehension; avoid excessive glassmorphism.
- Map remains visually dominant.

## 5. Overview screen
Hero: selected region and last data refresh.
KPI cards: watersheds, geo-coded observations, interventions, latest analysis, data quality coverage.
Map preview.
Recent changes.
Data-quality alerts.
Quick actions: Explore map, upload observations, run comparison, generate report.

## 6. Map Explorer
Map controls:
- zoom
- locate study area
- basemap
- layers
- legend
- measurement
- compare swipe
- time slider
- imagery opacity
- print/export

Layer groups:
Administrative, Watersheds, Field Images, Interventions, Drainage, Water, Vegetation, Land Use, Change, Satellite.

## 7. Map interactions
Hover: small tooltip only.
Click: selected feature gets focus ring and detail drawer opens.
Multi-select: shift/click or lasso where supported.
Cluster: zoom into cluster; never hide count silently.
Map loading: preserve existing visible layer while next layer loads.
Out-of-date data: show date badge.
Unavailable layer: show reason and retry.

## 8. Field image screen
Grid/list + map synchronization.
Each image card: thumbnail, capture date, coordinates, watershed, intervention type, quality, AI tags, confidence.
Detail: original image, map location, metadata, satellite context, related intervention, analysis, provenance, audit history where authorized.

## 9. Image viewer micro-interactions
- click thumbnail -> 180 ms zoom/fade
- map pin pulses once on selection, then becomes static
- metadata expands with 120 ms height transition
- AI tags appear only after processing and show confidence
- zoom/pan should feel native; no forced animation
- EXIF-sensitive fields can be masked based on role

## 10. Intervention screen
Table + map. Statuses: proposed, observed, verified, needs review, archived. Every status-changing action requires permission and is auditable.

## 11. Change Analysis screen
Two-date selector, metric selector, area selector, side-by-side/split-screen map, change statistics, uncertainty panel, methodology panel.
Important copy: "Observed change" rather than "Impact" unless a validated causal method exists.

## 12. Satellite & Layers screen
Catalog showing provider/source, acquisition date, spatial resolution, CRS, processing level, cloud/quality information, license/usage constraints, and provenance.

## 13. Analysis job screen
Stages: validating -> preprocessing -> computing -> validating output -> publishing.
Never use fake 0-100% progress unless actual progress is measured.
Show ETA only if statistically/technically defensible.

## 14. Report screen
Report builder with sections, map snapshots, tables, methods, source dates, model versions, caveats, and approval metadata.

## 15. Data quality center
Flags: missing coordinates, invalid geometry, duplicate images, blurry image, stale satellite scene, cloud contamination, CRS mismatch, insufficient coverage, failed model, low confidence.

## 16. Admin UX
User/role management, dataset registry, model versions, system health, audit search, retention configuration, feature flags.

## 17. Accessibility
Keyboard navigation; visible focus; semantic controls; screen-reader labels; minimum contrast; colorblind-safe symbols; reduced motion; touch target >= 44x44 CSS px; do not depend on hover; alt text for meaningful imagery; data tables for chart/map summaries where feasible.

## 18. Responsive behavior
Desktop: full map + side drawers.
Tablet: collapsible left rail and bottom sheet details.
Mobile: map-first with bottom sheets; capture flow optimized for field use; offline queue indicator.

## 19. Field capture UX
1. Open capture
2. Camera permission explanation
3. Capture
4. GPS quality indicator
5. Timestamp
6. Optional intervention type
7. Preview
8. Validate
9. Queue/upload
10. Success receipt
Offline: store encrypted local queue and sync when connectivity returns.

## 20. Empty/error/loading states
Every screen must have explicit states:
Loading, Empty, No permission, No coverage, Offline, Failed, Stale, Processing, Success.

## 21. Motion rules
Motion should communicate hierarchy and state. No parallax over maps, no bouncing markers, no infinite decorative animations, no motion that changes spatial interpretation. Respect reduced motion.

## 22. Copy rules
Use plain operational language. Avoid "AI says"; use "Model classification". Avoid "100% accurate". Always expose source date and confidence where meaningful.
