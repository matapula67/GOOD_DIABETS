import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import { auth } from '../lib/auth';
import { useToast } from '../components/Toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      auth.login({ email: String(form.get('email')), password: String(form.get('password')) });
      showToast('Umeingia kwa mafanikio.');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <PublicNav />
      <div className="auth-wrap">
        <div className="card auth-card">
          <h2>Karibu tena</h2>
          <p className="sub">Ingia kwenye akaunti yako kuendelea na tathmini.</p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Barua Pepe</label>
              <input required type="email" name="email" placeholder="wewe@mfano.com" />
            </div>
            <div className="field">
              <label>Nenosiri</label>
              <input required type="password" name="password" placeholder="••••••••" />
            </div>
            {error && <div className="err">{error}</div>}
            <button className="btn btn-primary btn-block btn-lg" type="submit" style={{ marginTop: 6 }}>Ingia</button>
          </form>
          <div className="auth-switch">
            Huna akaunti? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Jisajili hapa</a>
          </div>
        </div>
      </div>
    </>
  );
}
