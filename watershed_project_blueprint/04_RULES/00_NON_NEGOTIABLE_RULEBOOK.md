# 04 - NON-NEGOTIABLE RULEBOOK

## Status
This is an engineering compliance checklist, not legal advice. Government deployment must be reviewed by the sponsoring department's legal/security/data-governance teams and by the actual data providers.

## 1. Source requirements
The problem statement calls for an integrated GIS/remote-sensing framework, interpretation of geo-coded images, thematic mapping, watershed monitoring, scientific decision support, scalable/cost-effective monitoring, and use of SRISHTI-DRISHTI 30 m satellite data. The source does not itself prescribe a software stack or AI models.

## 2. Geospatial government rules
Follow the Government of India's Guidelines for acquiring and producing Geospatial Data and Geospatial Data Services including Maps (DST, 15 Feb 2021), the associated compliance clarifications, the notified National Geospatial Policy 2022, and any current provider-specific terms. The 2021 guidelines broadly liberalize acquisition/production/use of geospatial data in India while retaining controls for specified sensitive attributes/features and restricted physical access; they use self-certification for adherence. Do not assume every sensitive dataset is unrestricted.

## 3. Sensitive geospatial information
Before publication, check whether a layer contains an attribute/feature on the current negative/sensitive list or is otherwise restricted by the data custodian. Do not expose security-sensitive installations, restricted premises, or sensitive attributes merely because a source file contains them.

## 4. Data provenance
Every satellite layer, field image, boundary, model output, and derived map must retain source, acquisition date, processing date, resolution, CRS, transformation, license/usage condition, and version.

## 5. Spatial correctness
Never mix CRS silently. Validate geometry. Record datum/CRS. Preserve original coordinates. Document resampling. Do not imply accuracy higher than the source data supports.

## 6. Satellite-data rule
Use only datasets for which the project has a valid right to access, process, store, and display. Confirm actual SRISHTI-DRISHTI access/API/licensing terms with the responsible authority before production implementation.

## 7. Privacy / personal data
Geo-coded photos can contain faces, house numbers, vehicle plates, names, phone numbers, or precise household locations. Minimize collection, purpose-limit processing, restrict access, encrypt sensitive storage, and use privacy-preserving derivatives for broad display.

## 8. DPDP compliance
The Digital Personal Data Protection Act, 2023 and Digital Personal Data Protection Rules, 2025 form the current Indian personal-data framework. Build consent/notice, purpose limitation, access controls, retention/deletion, breach handling, and rights workflows according to the provisions and their applicable commencement dates. Do not assume every provision becomes enforceable on the same date; track the notified phased commencement.

## 9. Data minimization
Do not collect device identifiers, camera metadata, face embeddings, or personal details unless required. Separate operational metadata from public analytical data.

## 10. Image privacy
Default public map view should not expose raw full-resolution field photographs when personal data may be present. Provide role-based access and privacy-redacted derivatives.

## 11. Security baseline
Use TLS, strong authentication, MFA for privileged users, RBAC/ABAC where needed, least privilege, secrets management, encrypted storage, secure backups, rate limits, upload validation, malware scanning, dependency scanning, and security logging.

## 12. CERT-In
Production operators must assess applicability of CERT-In directions issued under Section 70B of the IT Act, including incident reporting, time synchronization, log retention, and other applicable requirements. Maintain an incident response runbook and escalation contacts.

## 13. IT Act
The Information Technology Act, 2000 and applicable rules remain part of the Indian cyber/legal context. Do not treat this project as exempt from applicable cyber obligations merely because it is a research/hackathon prototype.

## 14. Secure development
No secrets in Git. No production credentials in .env committed to source control. Validate uploads. Parameterize SQL. Sanitize rendered content. Apply CSRF/CORS policy deliberately. Use secure cookies/tokens. Rotate secrets. Patch dependencies.

## 15. API rules
Authentication on every protected endpoint. Authorization at object level. Never rely only on hidden UI buttons. Rate limit public endpoints. Enforce upload quotas. Return generic errors to untrusted clients.

## 16. Database rules
PostGIS queries must be parameterized. Use migrations. Separate service accounts. Least-privilege database roles. Backups must be encrypted and restoration-tested.

## 17. AI rules
AI outputs are not automatically ground truth. Show confidence and provenance. No fabricated values. No fabricated satellite observations. No unverified causal claims. Human review for high-impact/low-confidence findings.

## 18. LLM rules
LLMs may summarize verified structured outputs. They must not invent spatial facts. They must not have unrestricted database or shell access. Tool calls must be allow-listed and authorized. Treat uploaded text/images as untrusted input.

## 19. Model reproducibility
Pin model versions and preprocessing versions. Store model checksum/artifact ID. Store dataset version and inference parameters for every material result.

## 20. Scientific integrity
A before/after difference is an observed change, not proof that a watershed intervention caused it. Avoid causal language unless the study design supports causal inference.

## 21. Data quality rules
Reject or quarantine invalid coordinates, corrupt rasters, impossible dates, incompatible CRS, missing required metadata, and untrusted uploads. Never silently repair data without recording the transformation.

## 22. Auditability
Record who uploaded, changed, approved, exported, deleted, or published important data. Audit events must be tamper-resistant and access-controlled.

## 23. Retention
Define retention by data class: raw field imagery, personal data, derived layers, logs, model artifacts, reports, backups. Deletion must be policy-driven and auditable, subject to legal/government retention requirements.

## 24. Access control
Suggested roles: System Admin, Data Manager, GIS Analyst, Field Officer, Reviewer, Government Viewer, Auditor. Default deny. Scope access by organization/project/region.

## 25. Export rules
Every exported map/report should include source/date/provenance metadata. Sensitive layers must require explicit authorization. Public exports should use privacy-safe resolution and redaction rules.

## 26. Government procurement/deployment
For actual government deployment, validate hosting, cloud, procurement, localization, security audit, accessibility, records retention, data-sharing agreements, and integration requirements with the sponsoring ministry/department. Prototype assumptions are not production authorization.

## 27. Accessibility
Conform to applicable government accessibility requirements and WCAG-oriented practice: keyboard access, semantic labels, contrast, non-color cues, captions/alt text, readable charts, reduced motion, and accessible tabular equivalents for critical analytical information.

## 28. Open-source/licensing
Track licenses for every dependency, model, dataset, map tile, font, icon, and satellite source. Do not ship assets whose licenses prohibit the intended government/commercial use.

## 29. Offline/field rules
If offline capture is supported, encrypt the local queue, minimize retained data, show sync status, detect conflicts, and erase local copies only after verified sync according to retention policy.

## 30. Reliability
No single point of failure for production-critical services where the required SLA demands redundancy. Backups must be tested. Disaster recovery must define RPO/RTO.

## 31. Performance
Do not load full rasters into browsers. Use tiles, pyramids/overviews, caching, pagination, clustering, and asynchronous analysis jobs.

## 32. Release gate
A feature cannot ship unless: requirements approved, security reviewed, data provenance documented, AI metrics documented where applicable, accessibility checked, error states implemented, audit events defined, rollback path tested, and source/license terms verified.

## 33. Red flags
STOP deployment if: source rights are unclear; sensitive geospatial data is being exposed; personal data is public by default; AI output cannot be traced to a model/data version; the system fabricates missing observations; secrets are exposed; or security incidents cannot be detected/responded to.

## 34. Official references to verify before production
- DST Geospatial Guidelines 2021
- DST clarification/compliance memorandum dated 28 Nov 2022
- National Geospatial Policy 2022
- DPDP Act 2023
- DPDP Rules 2025 and their commencement timeline
- CERT-In Directions under Section 70B
- Information Technology Act 2000
- Actual SRISHTI-DRISHTI data/API/license/security documentation
