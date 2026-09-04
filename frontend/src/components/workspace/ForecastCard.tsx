import React, { useState } from 'react';
import { 
  MapPin, Send, Eye, CheckCircle2, 
  Compass, AlertCircle, Sparkles, Clock, Shield
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
      <div className="bg-[#0E1117] border border-white/10 text-white rounded-3xl p-8 text-center space-y-3 shadow-2xl">
        <AlertCircle className="w-10 h-10 text-[#D4FF00] mx-auto animate-pulse" />
        <h4 className="text-base font-bold text-white">Calculating Cash-Out Corridor...</h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Correlating multi-hop velocity to predict candidate ATM clusters.
        </p>
      </div>
    );
  }

  const topZone = selectedZone || forecast.top_zones[0];

  return (
    <div className="bg-[#0E1117] border border-white/10 text-white rounded-3xl p-6 sm:p-7 space-y-5 relative overflow-hidden shadow-2xl h-full flex flex-col justify-between">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4FF00]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Clean Dark Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#1A1E26] text-[#D4FF00] border border-white/10 shadow-inner">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              <span>Cash-Out Corridor Prediction</span>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30">
                AI RADAR
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">AI Spatial Density & Timing Forecast</p>
          </div>
        </div>
        <TacticalBadge label={`${(forecast.overall_confidence * 100).toFixed(0)}% Match`} variant="lime" />
      </div>

      {/* Multiple Zone Selection Tabs (if more than 1 zone) */}
      {forecast.top_zones.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 relative z-10">
          {forecast.top_zones.map((zone, idx) => {
            const isSelected = (selectedZone ? selectedZone.hotspot_id === zone.hotspot_id : idx === 0);
            return (
              <button
                key={zone.hotspot_id || idx}
                onClick={() => setSelectedZone(zone)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#D4FF00] text-[#0A0C10] shadow-md shadow-[#D4FF00]/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>RANK #{idx + 1}</span>
                <span className="text-[10px] opacity-80">({(zone.ranking_score * 100).toFixed(0)}%)</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Focus Card */}
      <div className="bg-[#141820] border border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 text-white relative z-10 shadow-inner">
        
        {/* Top Info Banner */}
        <div className="space-y-2.5 border-b border-white/10 pb-3.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF00] text-[#111317] font-black uppercase text-[10px] tracking-wider">
              {topZone === forecast.top_zones[0] ? 'RANK #1 PRIORITY CORRIDOR' : `PRIORITY CORRIDOR ${(topZone.ranking_score * 100).toFixed(0)}%`}
            </span>
            <span className="text-[#D4FF00] font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {topZone.expected_window_start} - {topZone.expected_window_end} IST
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-black text-white leading-snug break-words tracking-tight">
            {topZone.zone_label}
          </h4>

          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
            <span>Radius: <b className="text-white">{topZone.radius_m}m</b></span>
            <span>•</span>
            <span className="truncate">Station: <b className="text-slate-200">{topZone.jurisdiction_station}</b></span>
            {topZone.supporting_records_count && (
              <>
                <span>•</span>
                <span>Hits: <b className="text-white">{topZone.supporting_records_count} ATMs</b></span>
              </>
            )}
          </div>
        </div>

        {/* Contributing Signals */}
        <div className="space-y-3 pt-1">
          <div className="text-[10px] uppercase text-slate-400 font-extrabold tracking-wider font-mono flex items-center justify-between">
            <span>KEY PREDICTIVE SIGNALS</span>
            <span className="text-[#D4FF00]">94% MODEL WEIGHT</span>
          </div>

          <div className="space-y-2.5">
            {topZone.factors.map((factor, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-200 truncate max-w-[240px]">{factor.name}</span>
                  <span className="text-[#D4FF00] font-black font-mono">+{(factor.contribution * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="bg-[#D4FF00] h-full rounded-full shadow-[0_0_10px_rgba(212,255,0,0.5)]" 
                    style={{ width: `${Math.min(factor.contribution * 250, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => setShowActionModal(true)}
            className="neu-btn-lime w-full py-3.5 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,255,0,0.25)] hover:scale-[1.01] transition-transform"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Tactical Alert to Beat 3</span>
          </button>
        </div>
      </div>

      {/* Action Composer Modal */}
      {showActionModal && (
        <ActionComposer 
          zone={topZone}
          onClose={() => setShowActionModal(false)}
        />
      )}
    </div>
  );
};
