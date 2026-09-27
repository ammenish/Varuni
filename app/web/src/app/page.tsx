"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ChevronRight, Map, Satelite, Activity, Lock } from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B1F33] text-white overflow-hidden">
      
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
          style={{ 
            transition: 'opacity 2s ease-in-out',
            opacity: mounted ? 0.35 : 0 
          }}
        >
          {/* Beautiful landscape / river aerial footage for watershed context */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-mountain-landscape-with-a-river-in-the-valley-4261-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F33]/80 via-[#0B1F33]/50 to-[#0B1F33]/90" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
            {/* National Emblem Placeholder */}
            <Shield className="w-5 h-5 text-[#0B1F33]" />
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Government of India</h2>
            <h1 className="text-sm font-semibold tracking-wide text-white">Ministry of Rural Development</h1>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="px-5 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-all flex items-center gap-2">
            <Lock className="w-3 h-3" /> Dept Login
          </Link>
        </div>
      </header>

      {/* MAIN HERO CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        
        <div 
          className={`transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-[#287A4B] animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-300">National Geospatial Network</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 drop-shadow-2xl">
            VARUNI
          </h1>
          
          <h3 className="text-xl md:text-2xl font-light text-gray-300 tracking-wide max-w-2xl mx-auto mb-10 drop-shadow-md">
            Advanced Geospatial Monitoring & Decision Support Platform for Watershed Development
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard"
              className="group relative px-8 py-4 bg-[#155A8A] hover:bg-[#1769AA] text-white font-bold rounded shadow-[0_0_20px_rgba(21,90,138,0.4)] transition-all overflow-hidden flex items-center gap-3"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span>Access Command Center</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </main>

      {/* BOTTOM METRICS BANNER */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className={`transition-all duration-700 delay-300 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Active Projects</div>
            <div className="text-2xl font-mono font-bold text-white">4,812</div>
          </div>
          <div className={`transition-all duration-700 delay-400 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Geospatial Coverage</div>
            <div className="text-2xl font-mono font-bold text-white">98.4%</div>
          </div>
          <div className={`transition-all duration-700 delay-500 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Live Telemetry</div>
            <div className="text-2xl font-mono font-bold text-[#287A4B] flex items-center gap-2">
              <Activity className="w-5 h-5" /> ONLINE
            </div>
          </div>
          <div className={`transition-all duration-700 delay-600 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">System Status</div>
            <div className="text-2xl font-mono font-bold text-white">SECURE</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
