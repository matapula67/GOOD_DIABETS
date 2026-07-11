import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { auth } from '../lib/auth';
import { storage } from '../lib/storage';
import { RiskBadge } from '../components/RiskDisplay';
import { IconPaperclip } from '../components/Icons';
import { Doctor } from '../types';
import { DOCTORS } from '../lib/doctors';
import { useToast } from '../components/Toast';

function initials(name: string) {
  return name.split(' ').slice(1).map((n) => n[0]).join('').slice(0, 2);
}

export default function DoctorPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const user = auth.currentUser()!;
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);

  const history = storage.assessmentsForUser(user.id);
  const latest = history[0] || null; // report attached automatically — most recent saved assessment

  const openModal = (doc: Doctor) => setActiveDoctor(doc);
  const closeModal = () => setActiveDoctor(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeDoctor) return;
    const form = new FormData(e.currentTarget);
    storage.saveDoctorRequest({
      userId: user.id,
      doctorName: activeDoctor.name,
      message: String(form.get('message')),
      attachedAssessmentId: latest ? latest.id : null,
    });
    closeModal();
    showToast(`Ombi limetumwa kwa ${activeDoctor.name}, pamoja na ripoti ya tathmini.`);
  };

  return (
    <AppLayout>
      <div className="page-head">
        <h1>Wasiliana na Daktari</h1>
        <p>Chagua daktari na tuma ombi lako la ushauri. Ripoti yako ya tathmini ya karibuni itaambatanishwa moja kwa moja.</p>
      </div>

      <div className="doctor-grid">
        {DOCTORS.map((d) => (
          <div className="card doctor-card" key={d.email}>
            <div className="avatar">{initials(d.name)}</div>
            <div>
              <h3>{d.name}</h3>
              <div className="spec">{d.specialty}</div>
              <div className="contact">📞 {d.phone}<br />✉️ {d.email}</div>
              <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => openModal(d)}>
                Tuma Ombi la Ushauri
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeDoctor && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <h3>Ombi la Ushauri — {activeDoctor.name}</h3>
            <p>Eleza kwa ufupi tatizo lako, daktari atawasiliana nawe hivi karibuni.</p>

            <div className="attach-preview">
              <div className="head"><IconPaperclip /> Ripoti Itakayoambatanishwa</div>
              {latest ? (
                <>
                  <div className="row"><span>Tarehe ya Tathmini</span><strong>{new Date(latest.date).toLocaleDateString('sw-TZ')}</strong></div>
                  <div className="row"><span>Kiwango cha Hatari</span><strong><RiskBadge level={latest.result.level} /></strong></div>
                  <div className="row"><span>Uhakika</span><strong>{latest.result.confidence}%</strong></div>
                  <div className="row"><span>Jina la Mgonjwa</span><strong>{user.name}</strong></div>
                </>
              ) : (
                <p style={{ margin: 0, color: 'hsl(var(--risk-high))' }}>
                  Huna tathmini iliyohifadhiwa bado. <a href="/assessment" onClick={(e) => { e.preventDefault(); closeModal(); navigate('/assessment'); }} style={{ fontWeight: 700, textDecoration: 'underline' }}>Fanya tathmini kwanza</a>, kisha ihifadhi, ili iweze kuambatanishwa kwenye ombi lako.
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Ujumbe Wako</label>
                <input required name="message" placeholder="Andika hapa..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Ghairi</button>
                <button type="submit" className="btn btn-primary" disabled={!latest}>Tuma Ombi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
