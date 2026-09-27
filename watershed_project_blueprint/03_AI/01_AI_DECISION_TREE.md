# AI Decision Tree

1. Can deterministic GIS/raster math solve it?
   - Yes -> use deterministic method.
   - No -> continue.
2. Is there a labeled local dataset?
   - Yes -> benchmark suitable ML/CV models.
   - No -> start with rules/baselines and collect labels.
3. Does the output affect a high-impact decision?
   - Yes -> require human review and stronger validation.
   - No -> still show uncertainty and provenance.
4. Can the model run efficiently enough for the target environment?
   - Yes -> deploy with monitoring.
   - No -> optimize, distill, quantize, or move to asynchronous server inference.
5. Can every output be reproduced from versioned inputs/model/config?
   - No -> do not publish as authoritative output.
