import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Flame, Radio, CheckCircle2, 
  MapPin, Shield, Layers, Eye, Sparkles, Navigation2, RefreshCw,
  Compass, Sliders, Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { ATM, PoliceStation } from '../../types';

export const TacticalMap: React.FC = () => {
  const { forecast, replayState } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  const [atms, setAtms] = useState<ATM[]>([]);
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [showThermal, setShowThermal] = useState(true);
  const [showAtms, setShowAtms] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [heatRadius, setHeatRadius] = useState<number>(38);
  const [heatIntensity, setHeatIntensity] = useState<number>(0.95);

  // Pune Central Coordinates (FC Road & Deccan Gymkhana Corridor)
  const defaultCenter: [number, number] = [18.5204, 73.8400];

  useEffect(() => {
    Promise.all([api.getATMs(), api.getPoliceStations()])
      .then(([atmData, stationData]) => {
        setAtms(atmData);
        setStations(stationData);
      })
      .catch(console.error);
  }, []);

  // Precompute 256-Color Exact Plasma / Inferno / Magma Thermal Palette Gradient LUT
  const createThermalLUT = useCallback(() => {
    const paletteCanvas = document.createElement('canvas');
    paletteCanvas.width = 256;
    paletteCanvas.height = 1;
    const pctx = paletteCanvas.getContext('2d');
    if (!pctx) return null;

    const grad = pctx.createLinearGradient(0, 0, 256, 0);
    // Exact color stops matching the reference GIS thermal density heatmap:
    grad.addColorStop(0.00, 'rgba(0, 0, 0, 0)');         // Transparent base
    grad.addColorStop(0.12, 'rgba(48, 0, 69, 0.45)');    // Deep dark violet / plum
    grad.addColorStop(0.28, 'rgba(90, 15, 90, 0.72)');    // Dark Purple
    grad.addColorStop(0.46, 'rgba(150, 22, 75, 0.85)');   // Crimson / Magenta-Violet
    grad.addColorStop(0.64, 'rgba(215, 60, 15, 0.92)');   // Fiery Red-Orange
    grad.addColorStop(0.78, 'rgba(245, 135, 20, 0.96)');  // Warm Flame Orange
    grad.addColorStop(0.90, 'rgba(255, 225, 45, 0.98)');  // Bright Golden Yellow
    grad.addColorStop(1.00, 'rgba(255, 255, 255, 1.00)'); // White-Hot Luminous Core

    pctx.fillStyle = grad;
    pctx.fillRect(0, 0, 256, 1);
    return pctx.getImageData(0, 0, 256, 1).data;
  }, []);

  // Create Reusable Gaussian Radial Alpha Brush Stamp
  const createBrush = useCallback((radius: number, blur: number) => {
    const brush = document.createElement('canvas');
    const size = (radius + blur) * 2;
    brush.width = size;
    brush.height = size;
    const bctx = brush.getContext('2d');
    if (!bctx) return brush;

    const center = size / 2;
    const grad = bctx.createRadialGradient(center, center, radius, center, center, size / 2);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.55)');
    grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    bctx.fillStyle = grad;
    bctx.beginPath();
    bctx.arc(center, center, size / 2, 0, Math.PI * 2);
    bctx.fill();

    return brush;
  }, []);

  // Generate Continuous Heatmap Grid along Pune Urban Corridors
  const getThermalDataPoints = useCallback(() => {
    const pts: Array<{ lat: number; lon: number; intensity: number }> = [];

    // 1. FC Road & Deccan Gymkhana High-Density Spine (Primary Hotspot Corridor)
    const fcSpine = [
      { lat: 18.5140, lon: 73.8405, intensity: 0.55 }, // Deccan Bus Station Corner
      { lat: 18.5155, lon: 73.8410, intensity: 0.70 }, // Deccan Corner
      { lat: 18.5170, lon: 73.8414, intensity: 0.95 }, // Goodluck Cafe / FC Road Start (Hot Core)
      { lat: 18.5175, lon: 73.8415, intensity: 1.00 }, // SBI ATM Goodluck (White-Hot Epicenter)
      { lat: 18.5185, lon: 73.8418, intensity: 0.92 }, // FC Road Cafe Row
      { lat: 18.5198, lon: 73.8412, intensity: 0.88 }, // Vaishali / Roopali strip
      { lat: 18.5210, lon: 73.8428, intensity: 0.90 }, // Deccan Commercial Complex
      { lat: 18.5220, lon: 73.8405, intensity: 0.85 }, // Fergusson Main Gate Approach
      { lat: 18.5228, lon: 73.8398, intensity: 0.88 }, // Fergusson Gate Kiosks
      { lat: 18.5242, lon: 73.8390, intensity: 0.75 }, // Tukaram Paduka Chowk
      { lat: 18.5258, lon: 73.8385, intensity: 0.65 }, // Dnyaneshwar Paduka Chowk
      { lat: 18.5275, lon: 73.8380, intensity: 0.50 }, // Agriculture College Flyover
    ];
    pts.push(...fcSpine);

    // 2. JM Road Commercial & Banking Corridor (Secondary Parallel Hot Strip)
    const jmSpine = [
      { lat: 18.5165, lon: 73.8450, intensity: 0.50 }, // Garware Bridge
      { lat: 18.5190, lon: 73.8460, intensity: 0.65 }, // Sambhaji Park South
      { lat: 18.5215, lon: 73.8468, intensity: 0.78 }, // Sambhaji Park Central Kiosks
      { lat: 18.5245, lon: 73.8470, intensity: 0.82 }, // Axis Bank e-Lobby JM Road
      { lat: 18.5270, lon: 73.8480, intensity: 0.72 }, // Balgandharva Chowk
      { lat: 18.5295, lon: 73.8490, intensity: 0.60 }, // PMC Headquarters Junction
    ];
    pts.push(...jmSpine);

    // 3. Karve Road & Erandwane Egress Route
    const karveSpine = [
      { lat: 18.5135, lon: 73.8380, intensity: 0.60 }, // Khandoji Baba Chowk
      { lat: 18.5115, lon: 73.8350, intensity: 0.68 }, // Garware College Approach
      { lat: 18.5090, lon: 73.8310, intensity: 0.75 }, // Karve Road Canara Bank Chowk
      { lat: 18.5075, lon: 73.8260, intensity: 0.58 }, // Paud Phata Flyover
      { lat: 18.5070, lon: 73.8080, intensity: 0.65 }, // Kothrud Paud Road Hub
    ];
    pts.push(...karveSpine);

    // 4. Shivaji Nagar Bus & Railway Interchange Node
    const shivajiSpine = [
      { lat: 18.5305, lon: 73.8440, intensity: 0.62 }, // Congress Bhavan Road
      { lat: 18.5320, lon: 73.8450, intensity: 0.80 }, // PNB Shivaji Nagar Concourse
      { lat: 18.5335, lon: 73.8460, intensity: 0.70 }, // Railway Station Approach
      { lat: 18.5310, lon: 73.8465, intensity: 0.65 }, // Shivaji Nagar Police Station
    ];
    pts.push(...shivajiSpine);

    // 5. High-Risk ATMs contribution
    atms.forEach((atm) => {
      if (atm.cash_out_frequency === 'HIGH_CASHOUT') {
        pts.push({ lat: atm.latitude, lon: atm.longitude, intensity: 0.90 });
      } else {
        pts.push({ lat: atm.latitude, lon: atm.longitude, intensity: 0.40 });
      }
    });

    return pts;
  }, [atms]);

  // Main Canvas Render Loop (Fast, Smooth & Organic)
  const drawHeatmap = useCallback(() => {
    const map = mapInstanceRef.current;
    const canvas = canvasRef.current;
    if (!map || !canvas || !showThermal) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const size = map.getSize();
    if (canvas.width !== size.x || canvas.height !== size.y) {
      canvas.width = size.x;
      canvas.height = size.y;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size.x, size.y);

    const lut = createThermalLUT();
    if (!lut) return;

    const currentZoom = map.getZoom();
    // Dynamic zoom-scaled radius
    const zoomScale = Math.pow(1.35, currentZoom - 14);
    const rad = Math.max(22, Math.min(95, heatRadius * zoomScale));
    const blur = rad * 0.75;
    const brush = createBrush(rad, blur);
    const brushOffset = (rad + blur);

    const points = getThermalDataPoints();

    // 1. Draw Gray Alpha Intensity Accumulation onto Scratch Context
    points.forEach((pt) => {
      const p = map.latLngToContainerPoint([pt.lat, pt.lon]);
      if (p.x < -brushOffset * 2 || p.x > size.x + brushOffset * 2 || p.y < -brushOffset * 2 || p.y > size.y + brushOffset * 2) {
        return;
      }
      ctx.globalAlpha = pt.intensity * heatIntensity * 0.72;
      ctx.drawImage(brush, p.x - brushOffset, p.y - brushOffset);
    });

    // 2. Colorize Alpha Map with the Exact Magma Thermal LUT
    const imgData = ctx.getImageData(0, 0, size.x, size.y);
    const data = imgData.data;
    const len = data.length;

    for (let i = 0; i < len; i += 4) {
      const alpha = data[i + 3];
      if (alpha > 4) {
        const lutIndex = alpha * 4;
        data[i] = lut[lutIndex];         // R
        data[i + 1] = lut[lutIndex + 1]; // G
        data[i + 2] = lut[lutIndex + 2]; // B
        data[i + 3] = Math.min(235, Math.floor(lut[lutIndex + 3] * (alpha / 255) * 1.35)); // Alpha
      }
    }

    ctx.globalAlpha = 1.0;
    ctx.putImageData(imgData, 0, 0);
  }, [showThermal, heatRadius, heatIntensity, createThermalLUT, createBrush, getThermalDataPoints]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 14,
        zoomControl: false,
        zoomAnimation: true,
        zoomAnimationThreshold: 8,
        fadeAnimation: true,
        markerZoomAnimation: true,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 100,
        wheelDebounceTime: 40,
        easeLinearity: 0.2,
        inertia: true,
        inertiaDeceleration: 3000,
        inertiaMaxSpeed: 1800,
        preferCanvas: true,
      });

      // 100% Free OpenStreetMap High-Resolution Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        keepBuffer: 8,
        updateWhenIdle: false,
        updateWhenZooming: true,
      }).addTo(map);

      // Dedicated Leaflet Custom Canvas Pane for Organic Thermal Heatmap
      const HeatCanvasLayer = L.Layer.extend({
        onAdd: function (leafletMap: L.Map) {
          const pane = leafletMap.getPane('overlayPane');
          const canvas = L.DomUtil.create('canvas', 'leaflet-thermal-kde-canvas') as HTMLCanvasElement;
          canvas.style.position = 'absolute';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.pointerEvents = 'none';
          canvas.style.mixBlendMode = 'multiply';
          canvas.style.opacity = '0.90';
          pane?.appendChild(canvas);
          canvasRef.current = canvas;

          leafletMap.on('moveend zoomend resize viewreset', drawHeatmap);
          drawHeatmap();
        },
        onRemove: function (leafletMap: L.Map) {
          leafletMap.off('moveend zoomend resize viewreset', drawHeatmap);
          if (canvasRef.current) {
            L.DomUtil.remove(canvasRef.current);
            canvasRef.current = null;
          }
        }
      });

      new HeatCanvasLayer().addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers & overlays
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // 1. Draw High-Risk & Standard ATM Markers
    if (showAtms && atms.length > 0) {
      atms.forEach((atm) => {
        const isHighRisk = atm.cash_out_frequency === 'HIGH_CASHOUT';
        const atmIcon = L.divIcon({
          className: 'tactical-atm-blip',
          html: `
            <div style="position: relative; width: 20px; height: 20px;">
              ${isHighRisk ? `
                <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(239, 68, 68, 0.45); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              ` : ''}
              <div style="
                position: absolute; inset: 0;
                width: 20px; height: 20px; 
                background: ${isHighRisk ? '#EF4444' : '#10B981'}; 
                border: 2.5px solid #FFFFFF; 
                border-radius: 50%; 
                box-shadow: 0 0 14px ${isHighRisk ? 'rgba(239,68,68,0.9)' : 'rgba(16,185,129,0.7)'};
              "></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([atm.latitude, atm.longitude], { icon: atmIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 2px;">
              <b style="color: #111317; font-size: 13px;">${atm.bank_name}</b>
              <span style="font-size: 9px; font-family: monospace; background: #111317; color: #D4FF00; padding: 1px 6px; border-radius: 4px;">${atm.atm_id}</span>
            </div>
            <span style="color: #64748b;">${atm.locality}</span><br/>
            <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
              <span style="color: ${isHighRisk ? '#dc2626' : '#059669'}; font-weight: bold;">
                ${isHighRisk ? '🚨 HIGH-RISK CASHOUT HOTSPOT' : '✓ Standard Bank ATM'}
              </span>
            </div>
          </div>
        `);
      });
    }

    // 2. Police Cyber Beat Units in Pune
    if (showStations && stations.length > 0) {
      stations.forEach((st) => {
        const stIcon = L.divIcon({
          className: 'tactical-police-node',
          html: `
            <div style="
              width: 28px; height: 28px; 
              background: #111317; 
              border: 2px solid #D4FF00; 
              border-radius: 50%; 
              display: flex; align-items: center; justify-content: center;
              color: #D4FF00; font-weight: 900; font-size: 12px;
              box-shadow: 0 0 16px rgba(0,0,0,0.6);
            ">P</div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([st.latitude, st.longitude], { icon: stIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
            <b style="color: #111317; font-size: 13px;">${st.name}</b><br/>
            <span>Sector Beat: <b>${st.jurisdiction}</b></span><br/>
            <span>Available Beat Units: <b>${st.beat_units_available} Patrols</b></span><br/>
            <span>Direct Comms: <b>${st.contact_number}</b></span>
          </div>
        `);
      });
    }

    // 3. Ground Truth Interception Event
    if (replayState?.withdrawal_revealed) {
      const w = replayState.withdrawal_revealed;
      const wIcon = L.divIcon({
        className: 'tactical-strike-event',
        html: `
          <div style="
            width: 38px; height: 38px; 
            background: #DC2626; 
            border: 3px solid #FFFFFF; 
            border-radius: 50%; 
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: 900; font-size: 18px;
            box-shadow: 0 0 30px rgba(220,38,38,1);
            animation: pulse 1s infinite;
          ">₹</div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([w.latitude, w.longitude], { icon: wIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #7f1d1d; background: #fef2f2; padding: 8px; border-radius: 12px;">
          <b style="color: #dc2626; font-size: 14px;">🚨 GROUND-TRUTH CASHOUT STRIKE</b><br/>
          <span>Target ATM: <b>${w.atm_name} (${w.atm_id})</b></span><br/>
          <span>Amount: <b>₹${w.amount_inr.toLocaleString('en-IN')}</b></span><br/>
          <span>Time: <b>${w.occurred_at}</b></span><br/>
          <span style="color: #059669; font-weight: bold;">✓ Intercepted inside Rank #1 Pune Corridor!</span>
        </div>
      `).openPopup();
    }

    drawHeatmap();
  }, [atms, stations, showAtms, showStations, replayState, drawHeatmap]);

  return (
    <div className="neu-card p-8 space-y-6">
      {/* Top Header: Controls & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#111317] text-[#D4FF00] shadow-md flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                Continuous Density Thermal Heatmap
              </h3>
              <span className="text-[10px] bg-[#111317] text-[#D4FF00] px-2.5 py-0.5 rounded-full font-black">
                PUNE CITY
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kernel Density Estimation (KDE) over FC Road, Deccan Gymkhana, JM Road & Karve Road Corridors
            </p>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
          {/* Thermal Layer Toggle */}
          <button
            onClick={() => setShowThermal(!showThermal)}
            className={`px-4 py-2 rounded-full transition-all border cursor-pointer flex items-center gap-1.5 ${
              showThermal 
                ? 'bg-[#111317] text-[#D4FF00] border-[#111317] shadow-md' 
                : 'bg-[#F8FAFC] text-slate-600 border-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Thermal Heatmap
          </button>

          {/* ATMs Toggle */}
          <button
            onClick={() => setShowAtms(!showAtms)}
            className={`px-3.5 py-2 rounded-full transition-all border cursor-pointer ${
              showAtms 
                ? 'bg-[#111317] text-white border-[#111317] shadow-sm' 
                : 'bg-[#F8FAFC] text-slate-600 border-slate-200'
            }`}
          >
            ATMs ({atms.length})
          </button>

          {/* Police Stations Toggle */}
          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-3.5 py-2 rounded-full transition-all border cursor-pointer ${
              showStations 
                ? 'bg-[#111317] text-white border-[#111317] shadow-sm' 
                : 'bg-[#F8FAFC] text-slate-600 border-slate-200'
            }`}
          >
            Police Units ({stations.length})
          </button>

          {/* Radius / Blur Adjustment */}
          <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-1.5 rounded-full border border-slate-200 shadow-inner">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Radius:</span>
            <input 
              type="range" 
              min="20" 
              max="65" 
              value={heatRadius} 
              onChange={(e) => setHeatRadius(parseInt(e.target.value))}
              className="w-16 accent-[#111317] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Map Canvas with Floating Thermal Spectrum HUD */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-[660px]" />

        {/* Floating Reference-Style Thermal Spectrum HUD */}
        <div className="absolute bottom-6 left-6 z-20 bg-white/95 border border-slate-200/90 p-4 rounded-2xl text-xs space-y-3 backdrop-blur-lg shadow-2xl max-w-xs text-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Thermal Density Spectrum</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">KDE Density</span>
          </div>

          {/* Continuous Thermal Bar Matching Reference Image */}
          <div className="space-y-1">
            <div className="h-4 w-full rounded-full shadow-inner border border-slate-200/60" style={{
              background: 'linear-gradient(to right, #300045 0%, #5A0F5A 25%, #96164B 50%, #D73C0F 70%, #F58714 85%, #FFE12D 95%, #FFFFFF 100%)'
            }}></div>
            <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase font-mono">
              <span>Low Density</span>
              <span>Moderate</span>
              <span className="text-[#111317] font-black">Peak Hotspot</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-[11px]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#FFE12D] border-2 border-[#111317] shadow-sm"></span>
              <span>FC Road & Deccan Peak Epicenter</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-[11px]">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm"></span>
              <span>High-Risk 24x7 ATM Kiosk</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-[11px]">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm"></span>
              <span>Standard Bank ATM Node</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-[11px]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#111317] text-[#D4FF00] flex items-center justify-center text-[9px] font-black shadow-sm">P</span>
              <span>Deccan Cyber Police Post / Beat Unit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
