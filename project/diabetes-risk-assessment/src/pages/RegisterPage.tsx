import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import { auth } from '../lib/auth';
import { useToast } from '../components/Toast';
import { Gender } from '../types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      auth.register({
        name: String(form.get('name')),
        email: String(form.get('email')),
        phone: String(form.get('phone')),
        gender: form.get('gender') as Gender,
        age: Number(form.get('age')),
        password: String(form.get('password')),
      });
      showToast('Akaunti imefunguliwa. Karibu!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <PublicNav />
      <div className="auth-wrap">
        <div className="card auth-card" style={{ maxWidth: 520 }}>
          <h2>Fungua akaunti mpya</h2>
          <p className="sub">Inachukua chini ya dakika moja.</p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Jina Kamili</label>
              <input required name="name" placeholder="Jina lako" />
            </div>
            <div className="form-row2">
              <div className="field">
                <label>Barua Pepe</label>
                <input required type="email" name="email" placeholder="wewe@mfano.com" />
              </div>
              <div className="field">
                <label>Simu</label>
                <input required name="phone" placeholder="0712 345 678" />
              </div>
            </div>
            <div className="form-row2">
              <div className="field">
                <label>Jinsia</label>
                <select name="gender">
                  <option value="male">Mwanaume</option>
                  <option value="female">Mwanamke</option>
                </select>
              </div>
              <div className="field">
                <label>Umri</label>
                <input required type="number" name="age" min={1} max={120} placeholder="miaka" />
              </div>
            </div>
            <div className="field">
              <label>Nenosiri</label>
              <input required type="password" name="password" minLength={4} placeholder="Angalau herufi 4" />
            </div>
            {error && <div className="err">{error}</div>}
            <button className="btn btn-primary btn-block btn-lg" type="submit" style={{ marginTop: 6 }}>Jisajili</button>
          </form>
          <div className="auth-switch">
            Una akaunti tayari? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Ingia hapa</a>
          </div>
        </div>
      </div>
    </>
  );
}
