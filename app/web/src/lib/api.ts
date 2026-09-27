/**
 * API client for the Watershed Geospatial Intelligence Platform.
 * Connects to FastAPI backend at localhost:8000.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// ─── Dashboard ───────────────────────────────────────────
export const fetchDashboardStats = () => apiFetch<DashboardStats>("/api/v1/dashboard/stats");
export const fetchRecentChanges = (limit = 10) => apiFetch<ChangeEvent[]>(`/api/v1/dashboard/recent-changes?limit=${limit}`);
export const fetchQualityAlerts = (limit = 15) => apiFetch<QualityAlert[]>(`/api/v1/dashboard/quality-alerts?limit=${limit}`);

// ─── Watersheds ──────────────────────────────────────────
export const fetchWatersheds = (state?: string) => {
  const params = state ? `?state=${state}` : "";
  return apiFetch<WatershedInfo[]>(`/api/v1/watersheds${params}`);
};
export const fetchWatershedGeoJSON = (state?: string) => {
  const params = state ? `?state=${state}` : "";
  return apiFetch<GeoJSONFeatureCollection>(`/api/v1/watersheds/geojson${params}`);
};
export const fetchWatershedDetail = (id: string) => apiFetch<WatershedInfo>(`/api/v1/watersheds/${id}`);
export const fetchWatershedTimeSeries = (id: string, metric = "ndvi") =>
  apiFetch<TimeSeriesResponse>(`/api/v1/watersheds/${id}/time-series?metric=${metric}`);

// ─── Heatmaps ────────────────────────────────────────────
export const fetchNDVIHeatmap = (watershedId?: string) => {
  const params = watershedId ? `?watershed_id=${watershedId}` : "";
  return apiFetch<HeatmapResponse>(`/api/v1/heatmap/ndvi${params}`);
};
export const fetchNDWIHeatmap = (watershedId?: string) => {
  const params = watershedId ? `?watershed_id=${watershedId}` : "";
  return apiFetch<HeatmapResponse>(`/api/v1/heatmap/ndwi${params}`);
};
export const fetchInterventionHeatmap = () => apiFetch<HeatmapResponse>(`/api/v1/heatmap/interventions`);

// ─── Interventions ───────────────────────────────────────
export const fetchInterventions = (filters?: { watershed_id?: string; type?: string; status?: string }) => {
  const params = new URLSearchParams();
  if (filters?.watershed_id) params.set("watershed_id", filters.watershed_id);
  if (filters?.type) params.set("type", filters.type);
  if (filters?.status) params.set("status", filters.status);
  const q = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<PaginatedResponse<InterventionInfo>>(`/api/v1/interventions${q}`);
};
export const fetchInterventionGeoJSON = (filters?: { watershed_id?: string; type?: string }) => {
  const params = new URLSearchParams();
  if (filters?.watershed_id) params.set("watershed_id", filters.watershed_id);
  if (filters?.type) params.set("type", filters.type);
  const q = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<GeoJSONFeatureCollection>(`/api/v1/interventions/geojson${q}`);
};

// ─── Satellite ───────────────────────────────────────────
export const fetchSatelliteScenes = (filters?: { watershed_id?: string; provider?: string }) => {
  const params = new URLSearchParams();
  if (filters?.watershed_id) params.set("watershed_id", filters.watershed_id);
  if (filters?.provider) params.set("provider", filters.provider);
  const q = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<PaginatedResponse<SatelliteScene>>(`/api/v1/satellite/scenes${q}`);
};
export const fetchSatelliteProviders = () => apiFetch<SatelliteProvider[]>("/api/v1/satellite/providers");

// ─── Changes ─────────────────────────────────────────────
export const fetchChanges = (filters?: { watershed_id?: string; metric?: string; severity?: string }) => {
  const params = new URLSearchParams();
  if (filters?.watershed_id) params.set("watershed_id", filters.watershed_id);
  if (filters?.metric) params.set("metric", filters.metric);
  if (filters?.severity) params.set("severity", filters.severity);
  const q = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<PaginatedResponse<ChangeEvent>>(`/api/v1/changes${q}`);
};
export const fetchChangesGeoJSON = (severity?: string) => {
  const params = severity ? `?severity=${severity}` : "";
  return apiFetch<GeoJSONFeatureCollection>(`/api/v1/changes/geojson${params}`);
};

// ─── Analysis ────────────────────────────────────────────
export const fetchAnalysisJobs = (filters?: { status?: string; type?: string }) => {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.type) params.set("type", filters.type);
  const q = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<PaginatedResponse<AnalysisJob>>(`/api/v1/analysis/jobs${q}`);
};

// ─── Layers ──────────────────────────────────────────────
export const fetchLayers = () => apiFetch<LayerInfo[]>("/api/v1/layers");

// ─── Land Cover ──────────────────────────────────────────
export const fetchLandcover = (watershedId?: string) => {
  const params = watershedId ? `?watershed_id=${watershedId}` : "";
  return apiFetch<LandcoverResponse>(`/api/v1/landcover${params}`);
};

// ─── Types ───────────────────────────────────────────────
export interface DashboardStats {
  total_watersheds: number;
  total_images: number;
  total_interventions: number;
  total_analyses: number;
  avg_ndvi: number;
  avg_ndwi: number;
  total_water_area_sqkm: number;
  vegetation_coverage_pct: number;
  quality_alerts: number;
  active_jobs: number;
  states_covered: number;
  districts_covered: number;
}

export interface WatershedInfo {
  id: string;
  name: string;
  state: string;
  district: string;
  block: string;
  center: [number, number];
  area_sqkm: number;
  ndvi: number;
  ndwi: number;
  elevation_min: number;
  elevation_max: number;
  population: number;
  landcover: string;
  geometry?: GeoJSONGeometry;
  properties?: Record<string, unknown>;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface GeoJSONFeature {
  type: "Feature";
  id: string;
  properties: Record<string, unknown>;
  geometry: GeoJSONGeometry;
}

export interface GeoJSONGeometry {
  type: string;
  coordinates: number[] | number[][] | number[][][];
}

export interface HeatmapResponse {
  metric: string;
  unit?: string;
  points: HeatmapPoint[];
  total: number;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  value: number;
  watershed?: string;
  type?: string;
}

export interface InterventionInfo {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  watershed_id: string;
  watershed_name: string;
  status: string;
  observed_at: string;
  cost_estimate: number;
  beneficiaries: number;
  description: string;
}

export interface SatelliteScene {
  id: string;
  provider: string;
  sensor: string;
  acquisition_time: string;
  cloud_cover: number;
  resolution_m: number;
  processing_level: string;
  crs: string;
  watershed_id: string;
  watershed_name: string;
  bounds: number[];
}

export interface SatelliteProvider {
  name: string;
  sensor: string;
  resolution_m: number;
  scene_count: number;
}

export interface ChangeEvent {
  id: string;
  watershed_id: string;
  watershed_name: string;
  from_date: string;
  to_date: string;
  metric: string;
  delta: number;
  from_value: number;
  to_value: number;
  confidence: number;
  severity: string;
  center?: [number, number];
}

export interface AnalysisJob {
  id: string;
  type: string;
  status: string;
  stage: string | null;
  watershed_id: string;
  watershed_name: string;
  model_version: string;
  started_at: string;
  completed_at: string | null;
  result_summary: Record<string, unknown> | null;
}

export interface QualityAlert {
  id: string;
  type: string;
  severity: string;
  watershed_id: string;
  watershed_name: string;
  message: string;
  created_at: string;
  resolved: boolean;
}

export interface LayerInfo {
  id: string;
  name: string;
  type: string;
  group: string;
  enabled: boolean;
}

export interface TimeSeriesResponse {
  watershed_id: string;
  name: string;
  metric: string;
  data: { date: string; value: number }[];
}

export interface LandcoverResponse {
  class_definitions: Record<string, { color: string; label: string }>;
  distribution: {
    watershed_id: string;
    watershed_name: string;
    classes: Record<string, number>;
  }[];
}

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
}
