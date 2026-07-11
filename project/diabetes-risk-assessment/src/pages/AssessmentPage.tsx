import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { predictRisk } from '../lib/prediction';
import { AssessmentInput, ActivityLevel, Gender } from '../types';

export default function AssessmentPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const input: AssessmentInput = {
      age: Number(f.get('age')),
      gender: f.get('gender') as Gender,
      bmi: Number(f.get('bmi')),
      glucose: Number(f.get('glucose')),
      bloodPressure: Number(f.get('bloodPressure')),
      cholesterol: Number(f.get('cholesterol')),
      heartDisease: f.get('heartDisease') === 'yes',
      hypertension: f.get('hypertension') === 'yes',
      smoking: f.get('smoking') === 'yes',
      alcohol: f.get('alcohol') === 'yes',
      activity: f.get('activity') as ActivityLevel,
      sleepHours: Number(f.get('sleepHours')),
    };
    const result = predictRisk(input);
    navigate('/result', { state: { input, result } });
  };

  return (
    <AppLayout>
      <div className="page-head">
        <h1>Fomu ya Tathmini ya Kiafya</h1>
        <p>Jaza taarifa zako kwa usahihi ili kupata matokeo sahihi zaidi.</p>
      </div>

      <div className="card assess-card">
        <div className="progressbar"><div className="fill" style={{ width: '100%' }} /></div>
        <form onSubmit={handleSubmit}>
          <div className="section-label">Taarifa za Msingi</div>
          <div className="form-grid2">
            <div className="field">
              <label>Umri</label>
              <input required type="number" name="age" min={1} max={120} placeholder="miaka" />
            </div>
            <div className="field">
              <label>Jinsia</label>
              <select name="gender">
                <option value="male">Mwanaume</option>
                <option value="female">Mwanamke</option>
              </select>
            </div>
            <div className="field">
              <label>BMI (Uzito/Urefu)</label>
              <input required type="number" step="0.1" name="bmi" placeholder="mfano 24.5" />
            </div>
            <div className="field">
              <label>Muda wa Kulala (saa/usiku)</label>
              <input required type="number" step="0.5" name="sleepHours" placeholder="mfano 7" />
            </div>
          </div>

          <div className="section-label">Vipimo vya Kiafya</div>
          <div className="form-grid2">
            <div className="field">
              <label>Sukari ya Damu (mg/dL)</label>
              <input required type="number" name="glucose" placeholder="mfano 95" />
            </div>
            <div className="field">
              <label>Shinikizo la Damu (mmHg)</label>
              <input required type="number" name="bloodPressure" placeholder="mfano 120" />
            </div>
            <div className="field">
              <label>Cholesterol (mg/dL)</label>
              <input required type="number" name="cholesterol" placeholder="mfano 180" />
            </div>
            <div className="field">
              <label>Shughuli za Mwili</label>
              <select name="activity">
                <option value="high">Nyingi</option>
                <option value="moderate">Wastani</option>
                <option value="low">Chini</option>
                <option value="none">Hakuna</option>
              </select>
            </div>
          </div>

          <div className="section-label">Historia ya Kiafya</div>
          <div className="form-grid2">
            <div className="field">
              <label>Historia ya Ugonjwa wa Moyo</label>
              <select name="heartDisease"><option value="no">Hapana</option><option value="yes">Ndiyo</option></select>
            </div>
            <div className="field">
              <label>Hypertension</label>
              <select name="hypertension"><option value="no">Hapana</option><option value="yes">Ndiyo</option></select>
            </div>
            <div className="field">
              <label>Uvutaji Sigara</label>
              <select name="smoking"><option value="no">Hapana</option><option value="yes">Ndiyo</option></select>
            </div>
            <div className="field">
              <label>Matumizi ya Pombe</label>
              <select name="alcohol"><option value="no">Hapana</option><option value="yes">Ndiyo</option></select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Ghairi</button>
            <button type="submit" className="btn btn-primary btn-lg">Pata Matokeo</button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
