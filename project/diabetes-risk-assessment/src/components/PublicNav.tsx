import { useNavigate } from 'react-router-dom';
import { IconLogo } from './Icons';

export default function PublicNav() {
  const navigate = useNavigate();
  return (
    <header className="topnav">
      <div className="container row">
        <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <span className="dot"><IconLogo /></span> AfyaTathmini
        </a>
        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>Ingia</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Jisajili</button>
        </div>
      </div>
    </header>
  );
}
