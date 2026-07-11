import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { auth } from '../lib/auth';
import { storage } from '../lib/storage';
import { downloadAssessmentCSV, downloadAssessmentPDF } from '../lib/export';
import { RiskBadge, RiskRing, ringColor } from '../components/RiskDisplay';
import { IconCheck, IconCsv, IconPdf } from '../components/Icons';
import { AssessmentInput, AssessmentRecord, PredictionResult } from '../types';
import { useToast } from '../components/Toast';

interface LocationState {
  input: AssessmentInput;
  result: PredictionResult;
}

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();
  const user = auth.currentUser()!;
  const state = location.state as LocationState | undefined;
  const [saved, setSaved] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    if (!state) navigate('/assessment', { replace: true });
  }, [state, navigate]);

  // A draft record (not yet persisted) so the person can download a report
  // immediately, even before choosing to save it to their history.
  const draft: AssessmentRecord | null = useMemo(() => {
    if (!state) return null;
    return { id: 'draft', userId: user.id, date: new Date().toISOString(), input: state.input, result: state.result };
  }, [state, user.id]);

  if (!state || !draft) return null;
  const record = saved || draft;
  const { result } = record;

  const handleSave = () => {
    const persisted = storage.saveAssessment(user.id, record.input, record.result);
    setSaved(persisted);
    showToast('Matokeo yamehifadhiwa kwenye historia.');
  };

  const handleDownloadCSV = () => downloadAssessmentCSV(user, record);
  const handleDownloadPDF = () => downloadAssessmentPDF(user, record);

  return (
    <AppLayout>
      <div className="page-head">
        <h1>Matokeo ya Tathmini</h1>
        <p>Yamehesabiwa kutokana na taarifa ulizoingiza.</p>
      </div>

      <div className="card result-hero">
        <RiskRing confidence={result.confidence} level={result.level} />
        <div style={{ marginTop: 10 }}><RiskBadge level={result.level} /></div>
        <p style={{ maxWidth: 440, margin: '16px auto 0', color: 'hsl(var(--ink-soft))', fontSize: 14.5 }}>
          Alama yako ya hatari ni {result.score}/{result.maxScore}.{' '}
          {result.level === 'low' && 'Hatari yako ni ndogo kwa sasa — endelea na mtindo bora wa maisha.'}
          {result.level === 'medium' && 'Una baadhi ya sababu za hatari zinazohitaji uangalizi.'}
          {result.level === 'high' && 'Una sababu kadhaa za hatari kubwa — tunapendekeza uonane na daktari haraka.'}
        </p>
      </div>

      <div style={{ height: 20 }} />

      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ marginTop: 0 }}>Pakua Ripoti Yako</h3>
        <p style={{ color: 'hsl(var(--ink-soft))', fontSize: 13.5, marginTop: -6, marginBottom: 18 }}>
          Ripoti inajumuisha taarifa za usajili wako, majibu ya fomu ya tathmini, na matokeo ya modeli.
        </p>
        <div className="download-panel">
          <button className="dl-btn" onClick={handleDownloadCSV}>
            <span className="ic" style={{ background: '#16a34a' }}><IconCsv /></span>
            <span className="txt">
              <strong>Pakua kama CSV</strong>
              <span>Faili la jedwali — linafaa Excel / Sheets</span>
            </span>
          </button>
          <button className="dl-btn" onClick={handleDownloadPDF}>
            <span className="ic" style={{ background: '#dc2626' }}><IconPdf /></span>
            <span className="txt">
              <strong>Pakua kama PDF</strong>
              <span>Ripoti iliyopangiliwa — inafaa kuchapisha au kutuma</span>
            </span>
          </button>
        </div>
      </div>

      <div style={{ height: 20 }} />

      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ marginTop: 0 }}>Mapendekezo ya Kiafya</h3>
        <div className="rec-list">
          {result.recommendations.map((t, i) => (
            <div className="rec-item" key={i}>
              <span className="ic" style={{ color: ringColor(result.level) }}><IconCheck /></span>
              <p>{t}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: 24 }}>
        <button className="btn btn-outline" onClick={() => navigate('/history')}>Angalia Historia</button>
        <button className="btn btn-outline" onClick={() => navigate('/assessment')}>Fanya Tena</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={!!saved}>
          {saved ? 'Imehifadhiwa ✓' : 'Hifadhi Matokeo'}
        </button>
      </div>
    </AppLayout>
  );
}
