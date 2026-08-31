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
      <div className="neu-card p-8 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
        <h4 className="text-base font-bold text-slate-800">Calculating Cash-Out Corridor...</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Correlating multi-hop velocity to predict candidate ATM clusters.
        </p>
      </div>
    );
  }

  const topZone = selectedZone || forecast.top_zones[0];

  return (
    <div className="neu-card p-6 sm:p-7 space-y-5 relative overflow-hidden">
      {/* Clean Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#111317] text-[#D4FF00] shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Cash-Out Corridor Prediction
            </h3>
            <p className="text-xs text-slate-500">AI Spatial Density & Timing Forecast</p>
          </div>
        </div>
        <TacticalBadge label={`${(forecast.overall_confidence * 100).toFixed(0)}% Match`} variant="lime" />
      </div>

      {/* Main Focus Card */}
      <div className="neu-dark p-5 sm:p-6 rounded-3xl space-y-4 text-white">
        
        {/* Top Info Banner */}
        <div className="space-y-2 border-b border-white/10 pb-3.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF00] text-[#111317] font-black uppercase">
              RANK #1 PRIORITY CORRIDOR
            </span>
            <span className="text-[#D4FF00] font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {topZone.expected_window_start} - {topZone.expected_window_end} IST
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-black text-white leading-snug break-words">
            {topZone.zone_label}
          </h4>

          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
            <span>Radius: <b className="text-white">{topZone.radius_m}m</b></span>
            <span>•</span>
            <span className="truncate">Station: <b className="text-slate-200">{topZone.jurisdiction_station}</b></span>
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
                  <span className="text-slate-200 truncate max-w-[200px]">{factor.name}</span>
                  <span className="text-[#D4FF00] font-black font-mono">+{(factor.contribution * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#D4FF00] h-full rounded-full" 
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
            className="w-full py-3 pill-btn-lime text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] transition-transform"
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
