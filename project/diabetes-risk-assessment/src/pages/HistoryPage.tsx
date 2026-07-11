import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { auth } from '../lib/auth';
import { storage } from '../lib/storage';
import { downloadAssessmentCSV, downloadAssessmentPDF } from '../lib/export';
import { RiskBadge } from '../components/RiskDisplay';
import { IconCsv, IconPdf } from '../components/Icons';
import { RiskLevel } from '../types';

const FILTERS: { key: RiskLevel | 'all'; label: string }[] = [
  { key: 'all', label: 'Zote' },
  { key: 'low', label: 'Ndogo' },
  { key: 'medium', label: 'Wastani' },
  { key: 'high', label: 'Kubwa' },
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const user = auth.currentUser()!;
  const [filter, setFilter] = useState<RiskLevel | 'all'>('all');
  const all = storage.assessmentsForUser(user.id);
  const items = filter === 'all' ? all : all.filter((a) => a.result.level === filter);

  return (
    <AppLayout>
      <div className="page-head">
        <h1>Historia ya Tathmini</h1>
        <p>Tathmini zako zote zilizohifadhiwa. Pakua ripoti ya CSV au PDF ya tathmini yoyote.</p>
      </div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button key={f.key} className={`chip ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="card">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="em">🗂️</div>
            <p>Hakuna tathmini zilizohifadhiwa bado.</p>
            <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={() => navigate('/assessment')}>
              Fanya Tathmini ya Kwanza
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tarehe</th>
                <th>Kiwango cha Hatari</th>
                <th>Uhakika</th>
                <th>Alama</th>
                <th>Pakua</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>
                    {new Date(a.date).toLocaleDateString('sw-TZ', { day: '2-digit', month: 'short', year: 'numeric' })}{' '}
                    {new Date(a.date).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td><RiskBadge level={a.result.level} /></td>
                  <td>{a.result.confidence}%</td>
                  <td>{a.result.score}/{a.result.maxScore}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline" style={{ padding: '7px 10px' }} title="Pakua CSV" onClick={() => downloadAssessmentCSV(user, a)}>
                        <IconCsv />
                      </button>
                      <button className="btn btn-outline" style={{ padding: '7px 10px' }} title="Pakua PDF" onClick={() => downloadAssessmentPDF(user, a)}>
                        <IconPdf />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  );
}
