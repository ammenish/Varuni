"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ═══════════════════════════════════════════════════════════
// SEEDED RANDOM & DATA GENERATION
// ═══════════════════════════════════════════════════════════
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rng = seededRandom(42);

const strokeW = 1.8;
const Icons = {
  Dashboard: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /></svg>),
  Map: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>),
  Layers: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>),
  Camera: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="3" /></svg>),
  BarChart2: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M18 20V10M12 20V4M6 20v-6" /></svg>),
  Activity: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>),
  FileText: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>),
  Shield: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
  Settings: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>),
  Search: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>),
  Bell: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>),
  User: () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>),
  Logo: () => (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="text-[var(--accent-sage)]"><path d="M12 2v20M17 5l-10 14M22 12H2M19 17L5 7" /></svg>),
  Globe: () => (<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>),
  Droplet: () => (<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>),
  Leaf: () => (<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L7 18l4-2 2 4 3-3-1-5 4-3-2-1z" /></svg>),
  Satellite: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>),
  Moon: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>),
  Sun: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>),
  Cpu: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeW}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>),
};

const WATERSHEDS = [
  { id: "ws-001", name: "Mahanadi Upper Basin", state: "Chhattisgarh", center: [81.63, 21.25] as [number, number], area_sqkm: 342.5, ndvi: 0.72, ndwi: 0.31, population: 45200, status: "healthy" },
  { id: "ws-002", name: "Godavari Sub-Basin", state: "Maharashtra", center: [73.53, 19.94] as [number, number], area_sqkm: 518.2, ndvi: 0.58, ndwi: 0.22, population: 32100, status: "degraded" },
  { id: "ws-003", name: "Cauvery Delta Zone", state: "Tamil Nadu", center: [79.14, 10.78] as [number, number], area_sqkm: 275.8, ndvi: 0.81, ndwi: 0.45, population: 67800, status: "healthy" },
  { id: "ws-004", name: "Sabarmati Watershed", state: "Gujarat", center: [72.58, 23.03] as [number, number], area_sqkm: 412.0, ndvi: 0.45, ndwi: 0.15, population: 89500, status: "critical" },
];

function makePolygon(center: number[], sizeDeg = 0.15) {
  const [lon, lat] = center;
  const pts: number[][] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (2 * Math.PI * i) / 8 + (rng() - 0.5) * 0.5;
    const r = sizeDeg * (0.6 + rng() * 0.8);
    pts.push([+(lon + r * Math.cos(angle)).toFixed(5), +(lat + r * Math.sin(angle) * 0.8).toFixed(5)]);
  }
  pts.push(pts[0]);
  return { type: "Polygon" as const, coordinates: [pts] };
}

const CACHED_GEOJSON = {
  type: "FeatureCollection" as const,
  features: WATERSHEDS.map((ws) => ({
    type: "Feature" as const,
    id: ws.id,
    properties: { ...ws },
    geometry: makePolygon(ws.center, 0.15),
  })),
};

const CACHED_TIMESERIES = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
].map((m, i) => ({
  month: m,
  ndvi: +(0.5 + 0.15 * Math.sin((i - 3) * Math.PI / 6) + (rng() - 0.5) * 0.08).toFixed(3),
  ndwi: +(0.25 + 0.1 * Math.sin((i - 3) * Math.PI / 6) + (rng() - 0.5) * 0.06).toFixed(3),
}));

const CACHED_INTERVENTIONS = (() => {
  const results: any[] = [];
  WATERSHEDS.forEach((ws) => {
    for (let i = 0; i < 6; i++) {
      results.push({
        id: `int-${ws.id}-${i}`,
        name: `Intervention #${i + 1}`,
        type: ["check_dam", "farm_pond", "contour_bund", "plantation"][Math.floor(rng() * 4)],
        watershed_name: ws.name,
        status: ["proposed", "observed", "verified", "needs_review"][Math.floor(rng() * 4)],
        cost: Math.round(50000 + rng() * 2450000),
      });
    }
  });
  return results;
})();

const CACHED_CHANGES = (() => {
  const metrics = ["ndvi_change", "water_area", "lulc_change"];
  return WATERSHEDS.flatMap((ws) => Array.from({ length: 3 }, (_, i) => {
    const delta = +((rng() - 0.5) * 0.5).toFixed(3);
    return {
      id: `chg-${ws.id}-${i}`,
      watershed: ws.name,
      metric: metrics[Math.floor(rng() * metrics.length)],
      delta,
      confidence: +(0.65 + rng() * 0.33).toFixed(2),
      severity: Math.abs(delta) > 0.2 ? "critical" : Math.abs(delta) > 0.12 ? "high" : "low",
    };
  }));
})();

const IMAGES = Array.from({ length: 8 }).map((_, i) => ({
  id: `img-${i}`,
  date: `2025-0${Math.floor(rng()*5)+1}-1${Math.floor(rng()*9)}`,
  watershed: WATERSHEDS[Math.floor(rng() * WATERSHEDS.length)].name,
  type: ["water_body", "plant_health", "soil_moisture"][Math.floor(rng() * 3)],
}));

const PROVIDERS = [
  { name: "Sentinel-2", sensor: "Multispectral", resolution: "10m", scenes: 1250, color: "var(--accent-sage)" },
  { name: "Landsat 8", sensor: "Multispectral", resolution: "30m", scenes: 840, color: "#d69e2e" },
  { name: "PlanetScope", sensor: "RGB-NIR", resolution: "3m", scenes: 4200, color: "#3182ce" },
];

const REPORTS = [
  { id: 1, title: "Q3 Vegetation Health", type: "assessment", date: "2025-10-15", status: "ready" },
  { id: 2, title: "Pre-Monsoon Storage", type: "hydrology", date: "2025-05-22", status: "ready" },
  { id: 3, title: "Annual Change Impact", type: "analysis", date: "2025-12-01", status: "generating" },
];

const ALERTS = [
  { type: "cloud_cover", severity: "warning", watershed: "Mahanadi Upper Basin", message: "High cloud cover in recent Sentinel-2 pass", resolved: false },
  { type: "sensor_anomaly", severity: "error", watershed: "Godavari Sub-Basin", message: "Missing data packets in Landsat stream", resolved: false },
  { type: "geom_mismatch", severity: "warning", watershed: "Cauvery Delta Zone", message: "Intervention boundary exceeds limits", resolved: true },
];

const SERVICES = [
  { name: "API Gateway", status: "healthy", latency: "45ms" },
  { name: "Tile Server", status: "healthy", latency: "120ms" },
  { name: "ML Inference", status: "degraded", latency: "850ms" },
];

const sparkData1 = Array.from({length: 10}, () => ({ val: rng() * 10 }));
const sparkData2 = Array.from({length: 10}, () => ({ val: rng() * 10 }));

// ═══════════════════════════════════════════════════════════
// MAP HOOK
// ═══════════════════════════════════════════════════════════
function useMapLibre(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: { center: [number, number]; zoom: number; controls?: boolean },
  onLoad?: (map: any, ml: any) => void
) {
  const mapRef = useRef<any>(null);
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;
    (async () => {
      const ml = await import("maplibre-gl");
      await import("maplibre-gl/dist/maplibre-gl.css");
      
      if (cancelled || !containerRef.current) return;
      const map = new ml.Map({
        container: containerRef.current,
        style: {
          version: 8 as const,
          sources: {
            "osm": { type: "raster" as const, tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: '&copy; OSM' },
          },
          layers: [{ id: "osm-layer", type: "raster" as const, source: "osm" }],
        },
        center: options.center,
        zoom: options.zoom,
        attributionControl: false,
      });
      if (options.controls) map.addControl(new ml.NavigationControl(), "top-right");
      map.on("load", () => { if (!cancelled && onLoad) onLoad(map, ml); });
      mapRef.current = map;
    })();
    return () => { cancelled = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);
  return mapRef;
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
type ViewId = "overview" | "map" | "images" | "interventions" | "changes" | "satellite" | "quality" | "spatial" | "ai" | "reports" | "admin" | "audit";

const NAV_GROUPS = [
  { label: "Overview", items: [{ id: "overview", icon: Icons.Dashboard, tooltip: "Overview Dashboard" }] },
  { label: "Monitoring", items: [{ id: "map", icon: Icons.Map, tooltip: "Map Explorer" }, { id: "images", icon: Icons.Camera, tooltip: "Field Observations" }, { id: "interventions", icon: Icons.Layers, tooltip: "Interventions" }, { id: "changes", icon: Icons.BarChart2, tooltip: "Change Analysis" }] },
  { label: "Data", items: [{ id: "satellite", icon: Icons.Satellite, tooltip: "Satellite Catalog" }, { id: "quality", icon: Icons.Shield, tooltip: "Data Quality" }] },
  { label: "Analysis", items: [{ id: "spatial", icon: Icons.Map, tooltip: "Spatial Analysis" }, { id: "ai", icon: Icons.Cpu, tooltip: "AI Analysis" }] },
  { label: "Reporting", items: [{ id: "reports", icon: Icons.FileText, tooltip: "Reports" }] },
  { label: "System", items: [{ id: "admin", icon: Icons.Settings, tooltip: "Administration" }, { id: "audit", icon: Icons.FileText, tooltip: "Audit Log" }] }
];

export default function WatershedApp() {
  const [activeView, setActiveView] = useState<ViewId>("overview");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Full-Stack API State
  const [watersheds, setWatersheds] = useState<any[]>(WATERSHEDS);
  const [geojsonData, setGeojsonData] = useState<any>(CACHED_GEOJSON);
  const [interventions, setInterventions] = useState<any[]>(CACHED_INTERVENTIONS);
  const [changes, setChanges] = useState<any[]>(CACHED_CHANGES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    // Fetch real data from FastAPI backend
    async function fetchBackendData() {
      try {
        const [wsRes, geoRes, intRes, chgRes] = await Promise.all([
          fetch('http://localhost:8000/api/v1/watersheds/'),
          fetch('http://localhost:8000/api/v1/watersheds/geojson'),
          fetch('http://localhost:8000/api/v1/interventions/'),
          fetch('http://localhost:8000/api/v1/changes/')
        ]);
        
        if (wsRes.ok) setWatersheds(await wsRes.json());
        if (geoRes.ok) setGeojsonData(await geoRes.json());
        if (intRes.ok) {
          const data = await intRes.json();
          setInterventions(data.items || CACHED_INTERVENTIONS);
        }
        if (chgRes.ok) {
          const data = await chgRes.json();
          setChanges(data.items || CACHED_CHANGES);
        }
      } catch (e) {
        console.warn("Backend not reachable, falling back to cached SIH proxy data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBackendData();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent-sage-light)]">
      
      {/* INSTITUTIONAL HEADER */}
      <header className="h-14 flex-shrink-0 bg-[var(--nav-bg)] text-[var(--nav-text)] flex justify-between items-center px-6 border-b border-[var(--nav-hover)] z-30 shadow-md">
        <div className="flex flex-col justify-center">
          <div className="text-[9px] font-bold text-gray-400 tracking-[0.1em] uppercase mb-0.5">Government of India | Ministry of Rural Development</div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight">VARUNI</h1>
            <span className="text-[10px] px-2 py-0.5 bg-[var(--nav-hover)] rounded font-mono text-[var(--nav-text)] ml-2 opacity-90 tracking-wider">PROTOTYPE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-xs font-mono text-gray-300 hidden md:block">
            Last synchronized: <span className="text-white">26 Sep 2026, 14:32 IST</span>
          </div>
          <div className="relative">
            <Icons.Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Global Geospatial Search..." className="h-9 w-72 bg-[var(--nav-hover)] border-none rounded text-xs pl-9 pr-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-white outline-none" />
          </div>
          <div className="text-sm font-medium flex items-center gap-3 cursor-pointer hover:text-gray-300 border-l border-[var(--nav-hover)] pl-6">
             <Icons.User className="w-4 h-4" />
             <div className="flex flex-col leading-tight">
               <span className="text-xs font-bold">Analyst-07 ▾</span>
               <span className="text-[10px] text-gray-400">Scientific Officer</span>
             </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* OPERATIONAL SIDEBAR */}
        <aside className="w-56 flex-shrink-0 bg-[var(--surface)] border-r border-[var(--border)] z-20 flex flex-col overflow-y-auto no-scrollbar">
          <nav className="flex-1 py-4 flex flex-col gap-4 px-3">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <h3 className="px-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">{group.label}</h3>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id as ViewId)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold transition-colors ${activeView === item.id ? "bg-[var(--nav-bg)] text-white shadow-sm" : "text-[var(--text-secondary)] hover:bg-[var(--surface-inset)] hover:text-[var(--foreground)]"}`}
                    >
                      <item.icon className="w-4 h-4 opacity-80" />
                      {item.tooltip}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          
          <div className="p-4 border-t border-[var(--border)]">
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-inset)] transition-colors"
            >
              <span>{isDark ? "Light Theme" : "Dark Theme"}</span>
              {isDark ? <Icons.Sun className="w-4 h-4" /> : <Icons.Moon className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col relative z-10 overflow-hidden bg-[var(--background)]">
          
          <header className="h-12 bg-[var(--surface)] border-b border-[var(--border)] px-6 flex items-center justify-between flex-shrink-0">
             <h2 className="text-sm font-bold text-[var(--foreground)] tracking-wide uppercase">
               {NAV_GROUPS.flatMap(g => g.items).find(i => i.id === activeView)?.tooltip || "Dashboard"}
             </h2>
             <div className="text-xs text-[var(--text-muted)]">
                Home / {NAV_GROUPS.find(g => g.items.some(i => i.id === activeView))?.label} / <span className="text-[var(--text-primary)] font-semibold">{NAV_GROUPS.flatMap(g => g.items).find(i => i.id === activeView)?.tooltip}</span>
             </div>
          </header>

          <div className="flex-1 overflow-auto p-4 scroll-smooth">
            {activeView === "overview" && <OverviewView watersheds={watersheds} geojsonData={geojsonData} />}
            {activeView === "map" && <MapExplorerView geojsonData={geojsonData} />}
            {activeView === "images" && <ImagesView />}
            {activeView === "interventions" && <InterventionsView interventions={interventions} />}
            {activeView === "changes" && <ChangeAnalysisView changes={changes} />}
            {activeView === "satellite" && <SatelliteView />}
            {activeView === "reports" && <ReportsView />}
            {activeView === "quality" && <QualityView />}
            {/* Stubs for new views */}
            {activeView === "spatial" && <div className="p-4 bg-white rounded border">Spatial Analysis Workspace coming soon.</div>}
            {activeView === "ai" && <div className="p-4 bg-white rounded border">AI Classification Jobs coming soon.</div>}
            {activeView === "admin" && <AdminView />}
            {activeView === "audit" && <div className="p-4 bg-white rounded border">Audit Log coming soon.</div>}
          </div>
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// INDIVIDUAL VIEWS
// ═══════════════════════════════════════════════════════════
function OverviewView({ watersheds, geojsonData }: { watersheds: any[], geojsonData: any }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  useMapLibre(mapContainerRef, { center: [79, 21], zoom: 3.5 }, (map) => {
    map.addSource("ws", { type: "geojson", data: geojsonData });
    map.addLayer({ id: "ws-fill", type: "fill", source: "ws", paint: { "fill-color": ["interpolate", ["linear"], ["get", "ndvi"], 0, "#e77777", 0.4, "#d69e2e", 0.6, "#6e8a76", 0.9, "#556e5c"], "fill-opacity": 0.6 }});
    map.addLayer({ id: "ws-line", type: "line", source: "ws", paint: { "line-color": "#ffffff", "line-width": 2 }});
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* MAP COMMAND CENTER */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded flex flex-col h-[400px] shadow-sm relative">
        <div className="h-10 border-b border-[var(--border)] bg-[var(--surface-inset)] flex justify-between items-center px-4 rounded-t">
          <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2 tracking-wide uppercase">
            <Icons.Map className="w-4 h-4 text-gray-500" /> Geospatial Map
          </div>
          <div className="flex gap-4">
             <div className="text-[10px] bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[var(--accent-sage)] rounded-full animate-pulse" /> Live telemetry</div>
             <div className="text-[10px] text-[var(--text-muted)] font-mono flex items-center">EPSG:4326</div>
          </div>
        </div>
        <div ref={mapContainerRef} className="flex-1 w-full bg-[var(--surface-inset)]" />
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 shadow-sm flex flex-col justify-between">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Active Watersheds</div>
          <div className="text-2xl font-black text-[var(--foreground)]">{watersheds.length}</div>
          <div className="text-[10px] text-[var(--accent-sage)] font-bold mt-2">+4.2% from previous period</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 shadow-sm flex flex-col justify-between">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Interventions</div>
          <div className="text-2xl font-black text-[var(--foreground)]">149</div>
          <div className="text-[10px] text-[var(--text-muted)] mt-2">Data coverage: 98.2%</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 shadow-sm flex flex-col justify-between">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Average NDVI</div>
          <div className="text-2xl font-black text-[var(--foreground)]">0.62</div>
          <div className="text-[10px] text-[var(--text-muted)] mt-2">2026 monsoon period (Satellite-derived)</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 shadow-sm flex flex-col justify-between">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Data Quality</div>
          <div className="text-2xl font-black text-[var(--accent-sage)]">98.4%</div>
          <div className="text-[10px] text-[var(--text-muted)] mt-2">Validated observations</div>
        </div>
      </div>

      {/* CHARTS & DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART PANEL */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded shadow-sm lg:col-span-1 flex flex-col">
          <div className="px-4 py-3 border-b border-[var(--border)] text-xs font-bold text-[var(--foreground)] tracking-wide uppercase">Seasonal Trends</div>
          <div className="p-4 flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CACHED_TIMESERIES} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gN" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent-sage)" stopOpacity={0.2} /><stop offset="100%" stopColor="var(--accent-sage)" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                <Tooltip wrapperClassName="custom-tooltip" cursor={{ stroke: 'var(--border)' }} />
                <Area type="monotone" dataKey="ndvi" stroke="var(--accent-sage)" fill="url(#gN)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLE PANEL */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
           <div className="px-4 py-3 border-b border-[var(--border)] text-xs font-bold text-[var(--foreground)] tracking-wide uppercase flex justify-between">
             Study Areas
             <span className="text-[10px] text-[var(--text-muted)] font-normal normal-case">Updated 14:32 IST</span>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--surface-inset)]">
                  <tr className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold border-b border-[var(--border)]">
                    <th className="py-2.5 px-4 font-semibold">Watershed</th>
                    <th className="py-2.5 px-4 font-semibold">State</th>
                    <th className="py-2.5 px-4 font-semibold text-center">NDVI</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Water Index</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--foreground)]">
                  {watersheds.map((ws, i) => (
                    <tr key={ws.id} className={`${i !== watersheds.length - 1 ? "border-b border-[var(--border)]/30" : ""} hover:bg-[var(--surface-inset)] transition-colors`}>
                      <td className="py-3 px-4 font-semibold">{ws.name}</td>
                      <td className="py-3 px-4 text-[var(--text-muted)]">{ws.state}</td>
                      <td className="py-3 px-4 text-center font-mono">{ws.ndvi.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center font-mono">{ws.ndwi.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                         <span className={`px-2 py-1 text-[9px] rounded uppercase tracking-wider font-bold ${ws.status === 'healthy' ? 'bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)]' : ws.status === 'critical' ? 'bg-[var(--status-red-bg)] text-[var(--status-red)]' : 'bg-[var(--accent-peach)] text-[var(--accent-dark)]'}`}>
                           {ws.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
}

function MapExplorerView({ geojsonData }: { geojsonData: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState("ndvi");
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useMapLibre(containerRef, { center: [79, 21], zoom: 4.5, controls: true }, (map) => {
    map.addSource("ws", { type: "geojson", data: geojsonData });
    map.addLayer({ id: "ws-fill", type: "fill", source: "ws", paint: { "fill-color": ["interpolate", ["linear"], ["get", "ndvi"], 0, "#e77777", 0.5, "#d69e2e", 0.9, "#6e8a76"], "fill-opacity": 0.6 } });
    map.addLayer({ id: "ws-line", type: "line", source: "ws", paint: { "line-color": "#ffffff", "line-width": 2 } });
    setMapLoaded(true);
  });

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    if (activeLayer === "outlines") {
      map.setPaintProperty("ws-fill", "fill-opacity", 0);
    } else if (activeLayer === "ndvi") {
      map.setPaintProperty("ws-fill", "fill-opacity", 0.6);
      map.setPaintProperty("ws-fill", "fill-color", ["interpolate", ["linear"], ["get", "ndvi"], 0, "#e77777", 0.5, "#d69e2e", 0.9, "#6e8a76"]);
    } else if (activeLayer === "ndwi") {
      map.setPaintProperty("ws-fill", "fill-opacity", 0.6);
      map.setPaintProperty("ws-fill", "fill-color", ["interpolate", ["linear"], ["get", "ndwi"], 0, "#e77777", 0.2, "#cbd5e1", 0.5, "#3182ce"]);
    } else if (activeLayer === "heatmap") {
      map.setPaintProperty("ws-fill", "fill-opacity", 0.6);
      map.setPaintProperty("ws-fill", "fill-color", ["interpolate", ["linear"], ["get", "population"], 20000, "#fef08a", 50000, "#f97316", 80000, "#991b1b"]);
    }
  }, [activeLayer, mapLoaded, mapRef]);

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      <div className="w-80 flex-shrink-0 flex flex-col gap-6">
        <div className="neo-surface p-6">
          <h3 className="font-bold text-[var(--foreground)] mb-4">Map Layers</h3>
          <div className="space-y-3">
            {[ { id: "ndvi", label: "Vegetation (NDVI)", c: "var(--accent-sage)" }, { id: "ndwi", label: "Water Index (NDWI)", c: "#3182ce" }, { id: "heatmap", label: "Heatmap Density", c: "#e77777" }, { id: "outlines", label: "Outlines Only", c: "var(--text-muted)" } ].map(l => (
              <button key={l.id} onClick={() => setActiveLayer(l.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all border border-transparent ${activeLayer === l.id ? "bg-[var(--surface-inset)] text-[var(--foreground)] shadow-inner border-[var(--border)]" : "bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-inset)]"}`}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeLayer === l.id ? l.c : '#d2cec4' }} />
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 neo-surface p-2 flex flex-col relative">
        <div ref={containerRef} className="flex-1 rounded-2xl overflow-hidden bg-[var(--accent-sage-light)]" />
      </div>
    </div>
  );
}

function ImagesView() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {IMAGES.map(img => (
        <div key={img.id} className="neo-surface p-4 flex flex-col group cursor-pointer hover:border-[var(--accent-sage)]">
          <div className={`h-32 rounded-xl mb-4 flex items-center justify-center opacity-80 transition-opacity group-hover:opacity-100 ${img.type.includes('water') ? 'bg-[#e0efff] text-[#3182ce]' : img.type.includes('plant') ? 'bg-[var(--accent-sage-light)] text-[var(--accent-sage)]' : 'bg-[var(--accent-peach)] text-[#d69e2e]'}`}>
             <Icons.Camera />
          </div>
          <h3 className="font-bold text-[var(--foreground)] text-sm truncate">{img.watershed}</h3>
          <div className="flex justify-between items-center mt-2 text-xs font-semibold text-[var(--text-muted)]">
            <span>{img.date}</span><span className="uppercase">{img.type.replace('_',' ')}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function InterventionsView({ interventions }: { interventions: any[] }) {
  const v = interventions.filter(i=>i.status==='verified').length;
  const p = interventions.filter(i=>i.status==='proposed').length;
  const o = interventions.filter(i=>i.status==='observed').length;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="neo-surface p-6 lg:col-span-2">
         <h3 className="font-bold text-[var(--foreground)] mb-6">Field Interventions</h3>
         <div className="overflow-x-auto max-h-[600px] no-scrollbar">
            <table className="w-full text-sm text-left">
              <thead><tr className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold border-b border-[var(--border)] sticky top-0 bg-white"><th className="pb-4 pr-4">Name</th><th className="pb-4 px-4">Type</th><th className="pb-4 px-4">Status</th><th className="pb-4 pl-4 text-right">Cost</th></tr></thead>
              <tbody className="text-[var(--foreground)] font-medium">
                {interventions.map((inv, i) => (
                  <tr key={i} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface-inset)]">
                    <td className="py-4 pr-4">{inv.name}</td><td className="py-4 px-4 capitalize text-[var(--text-muted)]">{inv.type.replace(/_/g, " ")}</td>
                    <td className="py-4 px-4"><span className={`px-3 py-1.5 text-[10px] rounded-full uppercase tracking-widest font-bold ${inv.status === 'verified' ? 'bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)]' : 'bg-[var(--accent-peach)] text-[#d69e2e]'}`}>{inv.status}</span></td>
                    <td className="py-4 pl-4 text-right font-mono">₹{Number(inv.cost || inv.cost_estimate || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
      <div className="neo-surface p-6">
         <h3 className="font-bold text-[var(--foreground)] mb-6">Status Breakdown</h3>
         <div className="h-64"><ResponsiveContainer><PieChart><Pie data={[{n: 'Verified', v}, {n: 'Proposed', v: p}, {n: 'Observed', v: o}]} dataKey="v" cx="50%" cy="50%" innerRadius={60} outerRadius={80}><Cell fill="var(--accent-sage)" /><Cell fill="#d69e2e" /><Cell fill="#3182ce" /></Pie><Tooltip wrapperClassName="custom-tooltip"/><Legend/></PieChart></ResponsiveContainer></div>
      </div>
    </div>
  )
}

function ChangeAnalysisView({ changes }: { changes: any[] }) {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[ { l: "Critical", v: changes.filter(c=>c.severity==='critical').length, c: "#e77777" }, { l: "High", v: changes.filter(c=>c.severity==='high').length, c: "#d69e2e" }, { l: "Low", v: changes.filter(c=>c.severity==='low').length, c: "var(--accent-sage)" } ].map(s => (
            <div key={s.l} className="neo-surface p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black bg-[var(--surface-inset)]" style={{ color: s.c }}>{s.v}</div>
              <div><div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{s.l}</div><div className="text-sm font-medium text-[var(--foreground)]">Changes</div></div>
            </div>
          ))}
       </div>
       <div className="neo-surface p-6">
         <h3 className="font-bold text-[var(--foreground)] mb-6">Detected Changes</h3>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold border-b border-[var(--border)]"><th className="pb-4 pr-4">Watershed</th><th className="pb-4 px-4">Metric</th><th className="pb-4 px-4 text-center">Delta</th><th className="pb-4 pl-4 text-right">Severity</th></tr></thead>
              <tbody className="text-[var(--foreground)] font-medium">
                {changes.map((chg, i) => (
                  <tr key={chg.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface-inset)]">
                    <td className="py-4 pr-4 font-bold">{chg.watershed}</td><td className="py-4 px-4 text-[var(--text-muted)] uppercase text-xs">{chg.metric.replace('_',' ')}</td>
                    <td className={`py-4 px-4 text-center font-bold ${chg.delta < 0 ? 'text-[#e77777]' : 'text-[var(--accent-sage)]'}`}>{chg.delta > 0 ? '+':''}{chg.delta}</td>
                    <td className="py-4 pl-4 text-right"><span className={`px-3 py-1.5 text-[10px] rounded-full uppercase tracking-widest font-bold ${chg.severity === 'critical' ? 'bg-[#fce8e8] text-[#e77777]' : 'bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)]'}`}>{chg.severity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
       </div>
    </div>
  )
}

function SatelliteView() {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PROVIDERS.map(p => (
            <div key={p.name} className="neo-surface p-6">
              <div className="flex items-center gap-3 mb-4"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }} /><h3 className="font-bold text-[var(--foreground)] text-lg">{p.name}</h3></div>
              <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-[var(--text-muted)] font-semibold">Sensor</span><span className="font-bold text-[var(--foreground)]">{p.sensor}</span></div><div className="flex justify-between"><span className="text-[var(--text-muted)] font-semibold">Resolution</span><span className="font-bold text-[var(--foreground)]">{p.resolution}</span></div><div className="flex justify-between"><span className="text-[var(--text-muted)] font-semibold">Scenes Available</span><span className="font-bold text-[var(--foreground)]">{p.scenes}</span></div></div>
            </div>
          ))}
       </div>
    </div>
  )
}

function ReportsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {REPORTS.map(r => (
         <div key={r.id} className="neo-surface p-6 group cursor-pointer">
           <div className="w-12 h-12 rounded-full bg-[var(--surface-inset)] text-[var(--foreground)] flex items-center justify-center mb-4 transition-colors group-hover:bg-[var(--foreground)] group-hover:text-white"><Icons.FileText /></div>
           <h3 className="font-bold text-[var(--foreground)] text-lg mb-1">{r.title}</h3>
           <p className="text-sm font-semibold text-[var(--text-muted)] mb-4">{r.date}</p>
           <span className="text-[10px] bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">{r.status}</span>
         </div>
       ))}
    </div>
  )
}

function QualityView() {
  return (
    <div className="neo-surface p-6">
      <h3 className="font-bold text-[var(--foreground)] mb-6">Data Quality Alerts</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead><tr className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold border-b border-[var(--border)]"><th className="pb-4 pr-4">Type</th><th className="pb-4 px-4">Severity</th><th className="pb-4 px-4">Message</th><th className="pb-4 pl-4 text-right">Status</th></tr></thead>
          <tbody className="text-[var(--foreground)] font-medium">
            {ALERTS.map((a, i) => (
              <tr key={i} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface-inset)]">
                <td className="py-4 pr-4 uppercase text-xs text-[var(--text-muted)] font-bold">{a.type.replace('_',' ')}</td>
                <td className={`py-4 px-4 font-bold text-xs uppercase tracking-wider ${a.severity === 'error' ? 'text-[#e77777]' : 'text-[#d69e2e]'}`}>{a.severity}</td>
                <td className="py-4 px-4 text-[var(--text-muted)]">{a.message}</td>
                <td className="py-4 pl-4 text-right"><span className={`px-3 py-1.5 text-[10px] rounded-full uppercase tracking-widest font-bold ${a.resolved ? 'bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)]' : 'bg-[#fce8e8] text-[#e77777]'}`}>{a.resolved ? 'Resolved' : 'Open'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="neo-surface p-6">
        <h3 className="font-bold text-[var(--foreground)] mb-6">System Health</h3>
        <div className="space-y-4">
          {SERVICES.map(s => (
            <div key={s.name} className="flex justify-between items-center p-4 bg-[var(--surface-inset)] rounded-2xl">
              <div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${s.status === 'healthy' ? 'bg-[var(--accent-sage)]' : 'bg-[#d69e2e]'}`} /><span className="font-bold text-[var(--foreground)]">{s.name}</span></div>
              <div className="flex items-center gap-4 text-sm font-mono text-[var(--text-muted)]"><span>{s.latency}</span><span className={`uppercase font-sans font-bold text-[10px] tracking-widest ${s.status === 'healthy' ? 'text-[var(--accent-sage)]' : 'text-[#d69e2e]'}`}>{s.status}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
