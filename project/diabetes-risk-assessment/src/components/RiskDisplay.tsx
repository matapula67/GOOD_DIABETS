import { RiskLevel } from '../types';
import { IconCheck } from './Icons';

const BADGE_MAP: Record<RiskLevel, { cls: string; label: string }> = {
  low: { cls: 'badge-low', label: 'HATARI NDOGO' },
  medium: { cls: 'badge-medium', label: 'HATARI YA WASTANI' },
  high: { cls: 'badge-high', label: 'HATARI KUBWA' },
};

export function ringColor(level: RiskLevel) {
  return level === 'low' ? '#16a34a' : level === 'medium' ? '#d97706' : '#dc2626';
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const b = BADGE_MAP[level];
  return (
    <span className={`badge ${b.cls}`}>
      <IconCheck /> {b.label}
    </span>
  );
}

export function RiskRing({ confidence, level }: { confidence: number; level: RiskLevel }) {
  const r = 72;
  const c = 2 * Math.PI * r;
  const offset = c - (confidence / 100) * c;
  return (
    <div className="result-ring">
      <svg width="170" height="170" viewBox="0 0 170 170">
        <circle cx="85" cy="85" r={r} fill="none" stroke="#eef2f6" strokeWidth={14} />
        <circle
          cx="85" cy="85" r={r} fill="none" stroke={ringColor(level)} strokeWidth={14}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div className="pct">
        <div className="n">{confidence}%</div>
        <div className="s">UHAKIKA</div>
      </div>
    </div>
  );
}
