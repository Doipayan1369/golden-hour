import React, { useState } from 'react';
import { 
  MapPin, Send, Eye, CheckCircle2, 
  Compass, AlertCircle, Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TacticalBadge } from '../common/TacticalBadge';
import { HotspotZone } from '../../types';
import { ActionComposer } from './ActionComposer';

export const ForecastCard: React.FC = () => {
  const { forecast, setActiveTab } = useApp();
  const [selectedZone, setSelectedZone] = useState<HotspotZone | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  if (!forecast || !forecast.top_zones || forecast.top_zones.length === 0) {
    return (
      <div className="neu-card p-10 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
        <h4 className="text-lg font-bold text-slate-800">Enriching Bank Responses...</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Awaiting terminal bank response to calculate spatial cash-out probability.
        </p>
      </div>
    );
  }

  const topZone = selectedZone || forecast.top_zones[0];

  return (
    <div className="neu-card p-8 space-y-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#D4FF00] text-[#111317] shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
              Spatial Cash-Out Zone Forecast
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">DBSCAN Clustering & Time-Decay Model</p>
          </div>
        </div>
        <TacticalBadge label={`${(forecast.overall_confidence * 100).toFixed(0)}% Confidence`} variant="lime" />
      </div>

      {/* Zone Selector Pills */}
      <div className="grid grid-cols-3 gap-3">
        {forecast.top_zones.map((zone, idx) => {
          const isSelected = topZone.hotspot_id === zone.hotspot_id;
          return (
            <button
              key={zone.hotspot_id}
              onClick={() => setSelectedZone(zone)}
              className={`p-3.5 rounded-2xl text-left text-xs transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#111317] text-white border-[#111317] shadow-lg'
                  : 'bg-[#F8FAFC] border-slate-200/90 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>RANK #{idx + 1}</span>
                <span className={isSelected ? 'text-[#D4FF00]' : 'text-slate-900'}>
                  {(zone.ranking_score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="text-xs truncate mt-1 font-medium opacity-90">{zone.zone_label}</div>
            </button>
          );
        })}
      </div>

      {/* Hero Zone Box (Lumin Style Dark Widget) */}
      <div className="neu-dark p-6 rounded-3xl space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] text-[#D4FF00] uppercase font-extrabold tracking-wider">
              PRIORITY CASHOUT CORRIDOR
            </div>
            <h4 className="text-lg font-black text-white mt-1">{topZone.zone_label}</h4>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-2 font-medium">
              <Compass className="w-4 h-4 text-[#D4FF00]" />
              Radius: <span className="text-white font-mono">{topZone.radius_m}m</span> • Sector PS: <span className="text-slate-300">{topZone.jurisdiction_station}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">INTERVENTION WINDOW</div>
            <div className="text-lg font-black text-[#D4FF00] font-mono mt-0.5">
              {topZone.expected_window_start} - {topZone.expected_window_end}
            </div>
          </div>
        </div>

        {/* Explainability Factors */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="text-[10px] uppercase text-slate-400 font-extrabold tracking-wider flex items-center justify-between">
            <span>FACTOR ATTRIBUTION & SIGNALS</span>
            <span className="text-[#D4FF00]">WEIGHTED MODEL v0.1</span>
          </div>

          <div className="space-y-2.5">
            {topZone.factors.map((factor, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-200 capitalize">{factor.name}</span>
                  <span className="text-[#D4FF00] font-black font-mono">+{(factor.contribution * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#D4FF00] h-full rounded-full" 
                    style={{ width: `${Math.min(factor.contribution * 250, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-3 flex items-center justify-between gap-4">
          <button
            onClick={() => setActiveTab('map')}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full transition-all border border-white/10 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#D4FF00]" />
            <span>Radar Map</span>
          </button>

          <button
            onClick={() => setShowActionModal(true)}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 pill-btn-lime text-xs font-black transition-all cursor-pointer shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Action</span>
          </button>
        </div>
      </div>

      {showActionModal && (
        <ActionComposer 
          zone={topZone} 
          onClose={() => setShowActionModal(false)} 
        />
      )}
    </div>
  );
};
