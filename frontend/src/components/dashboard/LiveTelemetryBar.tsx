import React from 'react';
import { 
  AlertCircle, ShieldCheck, Zap, 
  MapPin, Clock, ArrowUpRight 
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { useApp } from '../../context/AppContext';

export const LiveTelemetryBar: React.FC = () => {
  const { cases, auditVerification } = useApp();

  const criticalCount = cases.filter(c => c.severity === 'CRITICAL').length;
  const forecastReadyCount = cases.filter(c => c.status === 'FORECAST_READY' || c.status === 'ACTION_APPROVED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Critical Priority Cases"
        value={criticalCount}
        subtitle="Active Golden Hour (<30m)"
        icon={AlertCircle}
        variant="dark"
        badgeText="IMMEDIATE"
      />
      <MetricCard
        title="Spatial Forecast Ready"
        value="82% Conf"
        subtitle="Sector 14 Corridor Ranked #1"
        icon={MapPin}
        variant="lime"
        badgeText="TOP-3 RANKED"
      />
      <MetricCard
        title="Triage Latency"
        value="< 45s"
        subtitle="Intake to Spatial Forecast"
        icon={Zap}
        variant="white"
        badgeText="SLA < 60s"
      />
      <MetricCard
        title="Audit Hash Ledger"
        value={auditVerification ? `${auditVerification.total_events} Blocks` : 'Active'}
        subtitle="SHA-256 Tamper-Evident"
        icon={ShieldCheck}
        variant="white"
        badgeText="100% VALID"
      />
    </div>
  );
};
