import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { auth } from '../lib/auth';
import { storage } from '../lib/storage';
import { RiskBadge } from '../components/RiskDisplay';
import { IconClipboard, IconHistory, IconDoctor } from '../components/Icons';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = auth.currentUser()!;
  const items = storage.assessmentsForUser(user.id);
  const last = items[0];

  return (
    <AppLayout>
      <div className="page-head">
        <h1>Habari, {user.name.split(' ')[0]} 👋</h1>
        <p>Umri: {user.age} • Jinsia: {user.gender === 'male' ? 'Mwanaume' : 'Mwanamke'}</p>
      </div>

      <div className="stat-grid">
        <div className="card stat-card">
          <div className="label">Tathmini Zilizofanywa</div>
          <div className="value">{items.length}</div>
        </div>
        <div className="card stat-card">
          <div className="label">Hatari ya Mwisho</div>
          <div className="value">{last ? <RiskBadge level={last.result.level} /> : '—'}</div>
        </div>
        <div className="card stat-card">
          <div className="label">Madaktari Available</div>
          <div className="value" style={{ color: 'hsl(var(--primary))' }}>5</div>
        </div>
      </div>

      <div className="quick-grid">
        <div className="card quick-card">
          <div className="icon"><IconClipboard /></div>
          <h3>Fanya Tathmini Mpya</h3>
          <p>Jaza fomu ya kiafya upate kiwango chako cha hatari cha sasa.</p>
          <button className="btn btn-primary" onClick={() => navigate('/assessment')}>Anza Sasa</button>
        </div>
        <div className="card quick-card">
          <div className="icon" style={{ background: 'hsl(var(--risk-medium-bg))', color: 'hsl(var(--risk-medium))' }}>
            <IconHistory />
          </div>
          <h3>Angalia Historia</h3>
          <p>Ona tathmini zako zote za awali, na pakua ripoti ya CSV au PDF.</p>
          <button className="btn btn-outline" onClick={() => navigate('/history')}>Fungua Historia</button>
        </div>
        <div className="card quick-card">
          <div className="icon" style={{ background: 'hsl(199,89%,94%)', color: 'hsl(var(--primary-dark))' }}>
            <IconDoctor />
          </div>
          <h3>Wasiliana na Daktari</h3>
          <p>Pata ushauri wa kitaalamu kuhusu matokeo yako.</p>
          <button className="btn btn-outline" onClick={() => navigate('/doctor')}>Ona Madaktari</button>
        </div>
      </div>
    </AppLayout>
  );
}
