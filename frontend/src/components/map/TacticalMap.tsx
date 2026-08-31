import { MOCK_ATMS, MOCK_POLICE_STATIONS } from '../../services/mockData';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Flame, Radio, CheckCircle2, 
  MapPin, Shield, Layers, Eye, Sparkles, Navigation2, RefreshCw,
  Compass, Sliders, Activity, ChevronRight, Target, AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { ATM, PoliceStation } from '../../types';

export const TacticalMap: React.FC = () => {
  const { forecast, replayState } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  
  const [atms, setAtms] = useState<ATM[]>(MOCK_ATMS);
  const [stations, setStations] = useState<PoliceStation[]>(MOCK_POLICE_STATIONS);
  const [showThermal, setShowThermal] = useState(true);
  const [showAtms, setShowAtms] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [selectedAtmId, setSelectedAtmId] = useState<string>('ATM-PUN-204');
  const [heatRadius, setHeatRadius] = useState<number>(38);
  const [heatIntensity, setHeatIntensity] = useState<number>(0.95);

  // Pune Central Coordinates (FC Road & Goodluck Chowk Epicenter)
  const defaultCenter: [number, number] = [18.5175, 73.8415];

  useEffect(() => {
    Promise.all([api.getATMs(), api.getPoliceStations()])
      .then(([atmData, stationData]) => {
        setAtms(atmData);
        setStations(stationData);
      })
      .catch(console.error);
  }, []);

  // Top 15 Ranked Candidate ATMs across Pune
  const rankedAtms = React.useMemo(() => {
    const probabilities: { [key: string]: { rank: number; prob: number; dist_m: number } } = {
      'ATM-PUN-204': { rank: 1, prob: 94, dist_m: 120 },
      'ATM-PUN-205': { rank: 2, prob: 91, dist_m: 420 },
      'ATM-PUN-206': { rank: 3, prob: 88, dist_m: 650 },
      'ATM-PUN-207': { rank: 4, prob: 85, dist_m: 850 },
      'ATM-PUN-208': { rank: 5, prob: 82, dist_m: 350 },
      'ATM-PUN-209': { rank: 6, prob: 79, dist_m: 1450 },
      'ATM-PUN-210': { rank: 7, prob: 76, dist_m: 920 },
      'ATM-PUN-211': { rank: 8, prob: 73, dist_m: 780 },
      'ATM-PUN-212': { rank: 9, prob: 69, dist_m: 510 },
      'ATM-PUN-101': { rank: 10, prob: 65, dist_m: 1850 },
      'ATM-PUN-102': { rank: 11, prob: 61, dist_m: 2900 },
      'ATM-PUN-103': { rank: 12, prob: 58, dist_m: 3400 },
      'ATM-PUN-301': { rank: 13, prob: 54, dist_m: 6200 },
      'ATM-PUN-302': { rank: 14, prob: 50, dist_m: 6800 },
      'ATM-PUN-401': { rank: 15, prob: 46, dist_m: 5900 },
    };

    return atms.map((atm) => {
      const meta = probabilities[atm.atm_id] || { rank: 15, prob: 45, dist_m: 2000 };
      return {
        ...atm,
        rank: meta.rank,
        probability: meta.prob,
        distanceM: meta.dist_m,
      };
    }).sort((a, b) => a.rank - b.rank);
  }, [atms]);

  // Focus and Fly to ATM on Map
  const focusATM = (atmId: string, lat: number, lon: number) => {
    setSelectedAtmId(atmId);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], 16, { duration: 1.2 });
      const marker = markersRef.current[atmId];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  // Precompute 256-Color Exact Magma/Inferno Colormap LUT
  const createThermalLUT = useCallback(() => {
    const paletteCanvas = document.createElement('canvas');
    paletteCanvas.width = 256;
    paletteCanvas.height = 1;
    const pctx = paletteCanvas.getContext('2d');
    if (!pctx) return null;

    const grad = pctx.createLinearGradient(0, 0, 256, 0);
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

  // Gaussian Radial Alpha Brush
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

  // Continuous Urban Heat Points in Pune
  const getThermalDataPoints = useCallback(() => {
    const pts: Array<{ lat: number; lon: number; intensity: number }> = [];

    // FC Road & Deccan Primary Spine
    const fcSpine = [
      { lat: 18.5140, lon: 73.8405, intensity: 0.55 },
      { lat: 18.5155, lon: 73.8410, intensity: 0.70 },
      { lat: 18.5170, lon: 73.8414, intensity: 0.95 },
      { lat: 18.5175, lon: 73.8415, intensity: 1.00 }, // SBI ATM Goodluck (Rank #1 Epicenter)
      { lat: 18.5185, lon: 73.8418, intensity: 0.92 },
      { lat: 18.5198, lon: 73.8412, intensity: 0.88 },
      { lat: 18.5210, lon: 73.8428, intensity: 0.90 }, // HDFC Deccan (Rank #2)
      { lat: 18.5220, lon: 73.8405, intensity: 0.85 },
      { lat: 18.5228, lon: 73.8398, intensity: 0.88 }, // ICICI Fergusson (Rank #3)
      { lat: 18.5242, lon: 73.8390, intensity: 0.75 },
      { lat: 18.5258, lon: 73.8385, intensity: 0.65 },
      { lat: 18.5275, lon: 73.8380, intensity: 0.50 },
    ];
    pts.push(...fcSpine);

    // JM Road Commercial Axis
    const jmSpine = [
      { lat: 18.5165, lon: 73.8450, intensity: 0.50 },
      { lat: 18.5190, lon: 73.8460, intensity: 0.65 },
      { lat: 18.5215, lon: 73.8468, intensity: 0.78 },
      { lat: 18.5245, lon: 73.8470, intensity: 0.82 }, // Axis JM Road (Rank #4)
      { lat: 18.5270, lon: 73.8480, intensity: 0.72 },
      { lat: 18.5295, lon: 73.8490, intensity: 0.60 },
    ];
    pts.push(...jmSpine);

    // Karve Road Corridor
    const karveSpine = [
      { lat: 18.5135, lon: 73.8380, intensity: 0.60 },
      { lat: 18.5115, lon: 73.8350, intensity: 0.68 },
      { lat: 18.5090, lon: 73.8310, intensity: 0.75 }, // Canara Karve
      { lat: 18.5075, lon: 73.8260, intensity: 0.58 },
      { lat: 18.5070, lon: 73.8080, intensity: 0.65 },
    ];
    pts.push(...karveSpine);

    // Shivaji Nagar Bus Hub
    const shivajiSpine = [
      { lat: 18.5305, lon: 73.8440, intensity: 0.62 },
      { lat: 18.5320, lon: 73.8450, intensity: 0.80 }, // PNB Shivaji Nagar (Rank #6)
      { lat: 18.5335, lon: 73.8460, intensity: 0.70 },
      { lat: 18.5310, lon: 73.8465, intensity: 0.65 },
    ];
    pts.push(...shivajiSpine);

    // Top 15 ATM contributions
    rankedAtms.forEach((atm) => {
      pts.push({ lat: atm.latitude, lon: atm.longitude, intensity: atm.probability / 100 });
    });

    return pts;
  }, [rankedAtms]);

  // Real-Time Canvas Heatmap Loop (Moves with pan/drag/zoom/scroll)
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
    const zoomScale = Math.pow(1.35, currentZoom - 14);
    const rad = Math.max(22, Math.min(95, heatRadius * zoomScale));
    const blur = rad * 0.75;
    const brush = createBrush(rad, blur);
    const brushOffset = (rad + blur);

    const points = getThermalDataPoints();

    // 1. Accumulate Grayscale Alpha Stamps
    points.forEach((pt) => {
      const p = map.latLngToContainerPoint([pt.lat, pt.lon]);
      if (p.x < -brushOffset * 2 || p.x > size.x + brushOffset * 2 || p.y < -brushOffset * 2 || p.y > size.y + brushOffset * 2) {
        return;
      }
      ctx.globalAlpha = pt.intensity * heatIntensity * 0.72;
      ctx.drawImage(brush, p.x - brushOffset, p.y - brushOffset);
    });

    // 2. Colorize with Magma Thermal LUT
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
        zoom: 14.5,
        zoomControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 100,
        wheelDebounceTime: 30,
        easeLinearity: 0.2,
        inertia: true,
        inertiaDeceleration: 3000,
        inertiaMaxSpeed: 1800,
        preferCanvas: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        keepBuffer: 8,
        updateWhenIdle: false,
        updateWhenZooming: true,
      }).addTo(map);

      // Real-Time Canvas Layer Synchronized to Map Movements
      const HeatCanvasLayer = L.Layer.extend({
        onAdd: function (leafletMap: L.Map) {
          const pane = leafletMap.getPane('overlayPane');
          const canvas = L.DomUtil.create('canvas', 'leaflet-thermal-kde-canvas') as HTMLCanvasElement;
          canvas.style.position = 'absolute';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.pointerEvents = 'none';
          canvas.style.mixBlendMode = 'multiply';
          canvas.style.opacity = '0.92';
          pane?.appendChild(canvas);
          canvasRef.current = canvas;

          // Attach real-time movement listeners so heatmap moves during drag, swipe & zoom!
          leafletMap.on('move moveend viewreset zoom zoomstart zoomend', drawHeatmap);
          drawHeatmap();
        },
        onRemove: function (leafletMap: L.Map) {
          leafletMap.off('move moveend viewreset zoom zoomstart zoomend', drawHeatmap);
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

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    markersRef.current = {};

    // 1. Draw Top 15 Ranked Candidate ATMs with Numbered Tactical Pins
    if (showAtms && rankedAtms.length > 0) {
      rankedAtms.forEach((atm) => {
        const isSelected = selectedAtmId === atm.atm_id;
        const isTop3 = atm.rank <= 3;
        const isTop8 = atm.rank <= 8;

        const pinColor = isTop3 ? '#D4FF00' : isTop8 ? '#EF4444' : '#F59E0B';
        const pinTextColor = isTop3 ? '#111317' : '#FFFFFF';

        const atmIcon = L.divIcon({
          className: 'tactical-ranked-atm-pin',
          html: `
            <div style="position: relative; width: 28px; height: 28px; cursor: pointer;">
              ${isTop3 ? `
                <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(212, 255, 0, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              ` : ''}
              <div style="
                position: absolute; inset: 0;
                width: 28px; height: 28px; 
                background: ${pinColor}; 
                border: 2px solid #111317; 
                border-radius: 50%; 
                display: flex; align-items: center; justify-content: center;
                color: ${pinTextColor}; font-weight: 900; font-size: 11px; font-family: monospace;
                box-shadow: 0 0 16px ${isTop3 ? 'rgba(212,255,0,0.9)' : 'rgba(0,0,0,0.35)'};
                transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
                transition: transform 0.2s ease;
              ">
                #${atm.rank}
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([atm.latitude, atm.longitude], { icon: atmIcon }).addTo(map);
        markersRef.current[atm.atm_id] = marker;

        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #0f172a; padding: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 900; background: #111317; color: #D4FF00; padding: 2px 8px; border-radius: 9999px;">
                RANK #${atm.rank} (${atm.probability}% PROBABILITY)
              </span>
              <span style="font-size: 9px; font-family: monospace; color: #64748b;">${atm.atm_id}</span>
            </div>
            <b style="color: #111317; font-size: 13px; display: block;">${atm.bank_name}</b>
            <span style="color: #64748b; font-size: 11px;">📍 ${atm.locality}</span><br/>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0; font-size: 11px;">
              <span>Distance to Cashout Card: <b>${atm.distanceM}m</b></span><br/>
              <span>Assigned Station: <b>${atm.station_id}</b></span><br/>
              <span style="color: ${isTop3 ? '#dc2626' : '#059669'}; font-weight: bold;">
                ${isTop3 ? '🚨 HIGH IMMEDIATE CASHOUT RISK' : '✓ Candidate Kiosk Monitored'}
              </span>
            </div>
          </div>
        `);
      });
    }

    // 2. Police Stations
    if (showStations && stations.length > 0) {
      stations.forEach((st) => {
        const stIcon = L.divIcon({
          className: 'tactical-police-node',
          html: `
            <div style="
              width: 26px; height: 26px; 
              background: #111317; 
              border: 2px solid #D4FF00; 
              border-radius: 50%; 
              display: flex; align-items: center; justify-content: center;
              color: #D4FF00; font-weight: 900; font-size: 11px;
              box-shadow: 0 0 12px rgba(0,0,0,0.5);
            ">P</div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([st.latitude, st.longitude], { icon: stIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
            <b style="color: #111317; font-size: 13px;">${st.name}</b><br/>
            <span>Sector Beat: <b>${st.jurisdiction}</b></span><br/>
            <span>Available Beat Units: <b>${st.beat_units_available} Patrols</b></span>
          </div>
        `);
      });
    }

    // 3. Ground Truth Withdrawal Event
    if (replayState?.withdrawal_revealed) {
      const w = replayState.withdrawal_revealed;
      const wIcon = L.divIcon({
        className: 'tactical-strike-event',
        html: `
          <div style="
            width: 36px; height: 36px; 
            background: #DC2626; 
            border: 3px solid #FFFFFF; 
            border-radius: 50%; 
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: 900; font-size: 17px;
            box-shadow: 0 0 30px rgba(220,38,38,1);
            animation: pulse 1s infinite;
          ">₹</div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([w.latitude, w.longitude], { icon: wIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #7f1d1d; background: #fef2f2; padding: 8px; border-radius: 12px;">
          <b style="color: #dc2626; font-size: 14px;">🚨 GROUND-TRUTH CASHOUT STRIKE</b><br/>
          <span>ATM: <b>${w.atm_name} (${w.atm_id})</b></span><br/>
          <span>Amount: <b>₹${w.amount_inr.toLocaleString('en-IN')}</b></span><br/>
          <span>Time: <b>${w.occurred_at}</b></span><br/>
          <span style="color: #059669; font-weight: bold;">✓ Intercepted inside Rank #1 Pune Corridor!</span>
        </div>
      `).openPopup();
    }

    drawHeatmap();
  }, [rankedAtms, stations, showAtms, showStations, replayState, selectedAtmId, drawHeatmap]);

  return (
    <div className="neu-card p-4 sm:p-8 space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#111317] text-[#D4FF00] shadow-md flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                Continuous Density Thermal Radar
              </h3>
              <span className="text-[10px] bg-[#111317] text-[#D4FF00] px-2.5 py-0.5 rounded-full font-black">
                TOP 15 ATMS RANKED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live moving KDE heatmap across Pune City • Ranked by multi-hop terminal pass-through probability
            </p>
          </div>
        </div>

        {/* Layer Toggles & Heat Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
          <button
            onClick={() => setShowThermal(!showThermal)}
            className={`px-3.5 py-1.5 rounded-full transition-all border cursor-pointer flex items-center gap-1.5 ${
              showThermal ? 'bg-[#111317] text-[#D4FF00] border-[#111317] shadow-sm' : 'bg-[#F8FAFC] text-slate-600 border-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Heatmap
          </button>

          <button
            onClick={() => setShowAtms(!showAtms)}
            className={`px-3.5 py-1.5 rounded-full transition-all border cursor-pointer ${
              showAtms ? 'bg-[#111317] text-white border-[#111317] shadow-sm' : 'bg-[#F8FAFC] text-slate-600 border-slate-200'
            }`}
          >
            15 ATMs
          </button>

          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-3.5 py-1.5 rounded-full transition-all border cursor-pointer ${
              showStations ? 'bg-[#111317] text-white border-[#111317] shadow-sm' : 'bg-[#F8FAFC] text-slate-600 border-slate-200'
            }`}
          >
            Police Units ({stations.length})
          </button>

          <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-1 rounded-full border border-slate-200 shadow-inner">
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

      {/* Main Grid: Map Canvas + Top 15 ATMs Ranking List */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Map View */}
        <div className="xl:col-span-8 relative rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
          <div ref={mapContainerRef} className="w-full h-[420px] sm:h-[540px] md:h-[640px]" />

          {/* Floating Reference-Style Thermal Spectrum HUD */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:bottom-6 sm:left-6 z-20 bg-white/95 border border-slate-200/90 p-3 sm:p-4 rounded-2xl text-xs space-y-2.5 backdrop-blur-lg shadow-2xl max-w-full sm:max-w-xs text-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Thermal Spectrum</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">KDE Density</span>
            </div>

            <div className="space-y-1">
              <div className="h-3.5 w-full rounded-full shadow-inner border border-slate-200/60" style={{
                background: 'linear-gradient(to right, #300045 0%, #5A0F5A 25%, #96164B 50%, #D73C0F 70%, #F58714 85%, #FFE12D 95%, #FFFFFF 100%)'
              }}></div>
              <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase font-mono">
                <span>0.0 Low</span>
                <span>0.5 Medium</span>
                <span className="text-[#111317] font-black">1.0 Peak (#1 SBI Goodluck)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Top 15 Potential Cash-Out ATMs Interactive Ranking Panel */}
        <div className="xl:col-span-4 bg-[#F8FAFC] border border-slate-200/90 rounded-3xl p-5 space-y-4 shadow-sm flex flex-col justify-between max-h-[640px]">
          <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-600" />
              <b className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Top 15 Potential ATMs
              </b>
            </div>
            <span className="text-[10px] bg-[#111317] text-[#D4FF00] px-2 py-0.5 rounded-full font-mono font-bold">
              RANKED
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {rankedAtms.map((atm) => {
              const isSelected = selectedAtmId === atm.atm_id;
              const isTop3 = atm.rank <= 3;

              return (
                <div
                  key={atm.atm_id}
                  onClick={() => focusATM(atm.atm_id, atm.latitude, atm.longitude)}
                  className={`p-3 rounded-2xl transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#111317] ring-2 ring-[#D4FF00] shadow-md'
                      : isTop3
                      ? 'bg-white/90 border-slate-200 hover:border-slate-300'
                      : 'bg-white/60 border-slate-200/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono ${
                        isTop3 ? 'bg-[#111317] text-[#D4FF00]' : 'bg-slate-200 text-slate-700'
                      }`}>
                        #{atm.rank}
                      </span>
                      <b className="text-xs text-slate-900 font-extrabold truncate max-w-[140px] sm:max-w-[180px]">
                        {atm.bank_name}
                      </b>
                    </div>
                    <span className={`text-xs font-mono font-black ${
                      isTop3 ? 'text-rose-600' : 'text-slate-700'
                    }`}>
                      {atm.probability}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-1 border-t border-slate-100">
                    <span className="truncate max-w-[160px]">📍 {atm.locality}</span>
                    <span className="font-mono text-slate-400">{atm.distanceM}m away</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between font-mono">
            <span>Click any ATM to fly & focus</span>
            <span className="text-[#111317] font-bold">15 Kiosks Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
