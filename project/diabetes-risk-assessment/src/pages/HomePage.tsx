import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import { IconLogo, IconClipboard, IconHistory, IconDoctor } from '../components/Icons';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <PublicNav />
      <section className="hero">
        <div className="container">
          <span className="eyebrow"><IconLogo /> Mfumo wa Kidijitali wa Afya</span>
          <h1>Fahamu hatari yako ya kisukari kabla haijawa tatizo.</h1>
          <p>
            AfyaTathmini hukusaidia kutathmini hatari yako ya kupata kisukari kwa dakika chache,
            kwa kutumia taarifa zako za kiafya na kanuni ya tathmini iliyothibitishwa.
          </p>
          <div className="actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Anza Tathmini — Bure
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>
              Nina Akaunti Tayari
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="kicker">Kwa Nini AfyaTathmini</div>
            <h2>Kila kitu unachohitaji kufuatilia afya yako</h2>
            <p>Kutoka tathmini ya haraka hadi ushauri wa moja kwa moja na daktari.</p>
          </div>
          <div className="grid3">
            <div className="card feature-card">
              <div className="icon" style={{ background: 'hsl(var(--risk-low-bg))', color: 'hsl(var(--primary-dark))' }}>
                <IconClipboard />
              </div>
              <h3>Tathmini ya Kiafya</h3>
              <p>Jaza taarifa zako za kiafya — umri, BMI, sukari ya damu na zaidi — upate matokeo papo hapo.</p>
            </div>
            <div className="card feature-card">
              <div className="icon" style={{ background: 'hsl(var(--risk-medium-bg))', color: 'hsl(var(--risk-medium))' }}>
                <IconHistory />
              </div>
              <h3>Historia Kamili</h3>
              <p>Fuatilia mabadiliko ya hatari yako ya kisukari kwa muda, na uone maendeleo yako. Pakua ripoti ya CSV au PDF wakati wowote.</p>
            </div>
            <div className="card feature-card">
              <div className="icon" style={{ background: 'hsl(199,89%,94%)', color: 'hsl(var(--primary-dark))' }}>
                <IconDoctor />
              </div>
              <h3>Wasiliana na Daktari</h3>
              <p>Pata ushauri wa moja kwa moja kutoka kwa madaktari walioidhinishwa, popote ulipo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'hsl(var(--bg-soft))', paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div className="kicker">Jinsi Inavyofanya Kazi</div>
            <h2>Hatua nne rahisi</h2>
          </div>
          <div className="steps">
            <div className="card step"><div className="num">01</div><h4>Jisajili</h4><p>Fungua akaunti yako kwa dakika moja.</p></div>
            <div className="card step"><div className="num">02</div><h4>Jaza Fomu</h4><p>Ingiza taarifa zako za kiafya kwa usahihi.</p></div>
            <div className="card step"><div className="num">03</div><h4>Pata Matokeo</h4><p>Ona kiwango cha hatari yako papo hapo, kisha pakua ripoti.</p></div>
            <div className="card step"><div className="num">04</div><h4>Chukua Hatua</h4><p>Fuata mapendekezo au ongea na daktari.</p></div>
          </div>
        </div>
      </section>

      <footer className="footer">
        © 2026 AfyaTathmini. Taarifa hii si mbadala wa ushauri wa kitaalamu wa kimatibabu.
      </footer>
    </>
  );
}
