# 03 - COMPLETE AI / ML / REMOTE-SENSING PLAN

## 1. AI philosophy
AI is an assistive analytical layer. The authoritative source of every result must remain traceable to source imagery/data, algorithm, parameters, model version, and processing date.

## 2. AI/algorithm inventory
A. Image quality assessment
B. Duplicate/similarity detection
C. Geo-coded metadata extraction and validation
D. Intervention/scene classification
E. Semantic image tagging
F. Object detection/segmentation for selected intervention classes
G. Land-use/land-cover classification
H. Vegetation analysis
I. Water-body analysis
J. Change detection
K. Spatial anomaly detection
L. Data-quality anomaly detection
M. Optional natural-language report assistance
N. Optional question-answer interface over authorized project data

## 3. A. Image quality
Techniques: blur detection (Laplacian variance), exposure checks, resolution checks, occlusion/visibility classifier, duplicate hash/perceptual hash.
Output: quality_score + reasons. Never silently delete a poor image.

## 4. B. Duplicate detection
Exact hash for byte-identical files; perceptual hash/embedding similarity for near-duplicates. Human review for borderline cases.

## 5. C. Metadata
EXIF parser for GPS/time/camera metadata. Validate coordinate ranges, timestamp sanity, and mismatch between image metadata and user-entered fields. Strip unnecessary metadata from public derivatives while retaining controlled provenance in secure storage.

## 6. D. Intervention classification
Start with a small, domain-defined taxonomy based on actual available labels, e.g. check dam, farm pond, contour measure, drainage feature, vegetation, bare land, water body, other/unknown. Train only after obtaining a representative labeled dataset.
Recommended baseline: transfer learning with a compact vision backbone; export to ONNX for efficient inference where required.

## 7. E. Semantic tagging
Multi-label classification can produce tags such as water_present, vegetation_present, bare_soil, structure_visible. Tags are advisory and confidence-scored.

## 8. F. Object detection/segmentation
Use only when the target feature is visually identifiable at the image resolution. Candidate methods: YOLO-family detector for bounding boxes; U-Net/DeepLab/SegFormer-style segmentation for pixel masks. Benchmark on local imagery before selecting a model.

## 9. G. Land-use/land-cover
Prefer supervised classification when labeled reference data exists; otherwise use established remote-sensing methods as baselines. Candidate models: Random Forest, XGBoost, gradient boosting, or deep semantic segmentation. Use sensor-specific spectral bands and document class definitions.

## 10. H. Vegetation
NDVI is a common vegetation index: (NIR - Red)/(NIR + Red). The exact band mapping depends on the satellite sensor. Use cloud/shadow masks and temporal normalization. Never compare incompatible sensors/bands without adjustment.

## 11. I. Water
NDWI or other sensor-appropriate water indices may be used. Validate against known water/non-water reference samples. Water detection should be reported as observed surface signal, not automatically as usable water availability.

## 12. J. Change detection
Options:
- index differencing (e.g. delta NDVI)
- post-classification comparison
- raster change maps
- time-series anomaly detection
- deep change detection only if sufficient labeled temporal data exists
Every change output must include dates, spatial resolution, preprocessing, threshold, and uncertainty/quality flags.

## 13. K. Spatial anomaly detection
Use Isolation Forest or robust statistical thresholds to flag unusual changes in watershed metrics. These are review queues, not final findings.

## 14. L. Data-quality anomaly detection
Detect improbable coordinates, impossible timestamps, sudden bulk uploads, repeated images, abnormal sensor metadata, inconsistent CRS, and suspicious layer changes.

## 15. M. AI report assistant
Optional. A constrained language model can convert verified metrics into draft narrative. It must only use retrieved authorized facts and cite source/result IDs. It must not invent numbers, causal conclusions, or policy recommendations.

## 16. N. Natural-language geospatial assistant
Optional query flow:
User question -> intent parser -> authorization check -> structured query -> GIS/analytics engine -> verified result -> language rendering.
Never allow the LLM to directly execute arbitrary SQL or filesystem commands.

## 17. Model governance
Maintain model registry with:
- model name/version
- training dataset version
- labels/taxonomy
- preprocessing
- hyperparameters
- metrics
- known failure cases
- approval status
- deployment date
- rollback version

## 18. Evaluation metrics
Classification: precision, recall, F1, confusion matrix, calibration.
Detection: mAP plus per-class precision/recall.
Segmentation: IoU/Dice.
Change detection: precision/recall against reference change polygons.
Remote sensing regression: MAE/RMSE where appropriate.
Operational: latency, throughput, failure rate.

## 19. Dataset rules
- Split geographically, not only randomly, to test generalization.
- Keep train/validation/test provenance.
- Avoid leakage across time or neighboring images.
- Document class imbalance.
- Store annotation guidelines.
- Maintain human-reviewed gold samples.

## 20. Human-in-the-loop
Low-confidence or high-impact outputs go to review. Reviewer decisions become labeled feedback only after quality checks. Do not automatically retrain production models from unreviewed user corrections.

## 21. Explainability
For image models, provide saliency/attention visualization only as supporting evidence, not proof. For classical models, show feature contribution where technically valid. For change detection, always show before/after source imagery and the computed change layer.

## 22. AI security
Protect model endpoints from prompt injection, malicious files, adversarial inputs, model extraction, data poisoning, and unauthorized model access. Scan uploads before inference.

## 23. Tools
Python, PyTorch, ONNX Runtime, scikit-learn, OpenCV, GDAL, Rasterio, GeoPandas, Shapely, pyproj, PostGIS. Use cloud/GPU only when workload requires it. Keep CPU-capable fallbacks for field/low-resource deployments.

## 24. AI selection rule
Do not use AI where deterministic GIS/raster math is sufficient. Deterministic calculations should remain deterministic and auditable. AI is for perception, classification, prioritization, or language assistance where it demonstrably improves the workflow.
