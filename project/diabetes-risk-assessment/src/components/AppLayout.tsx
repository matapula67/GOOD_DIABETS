import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../lib/auth';
import { IconLogo, IconHome, IconClipboard, IconHistory, IconDoctor } from './Icons';
import ChatWidget from './ChatWidget';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashibodi', icon: <IconHome /> },
  { to: '/assessment', label: 'Fanya Tathmini', icon: <IconClipboard /> },
  { to: '/history', label: 'Historia', icon: <IconHistory /> },
  { to: '/doctor', label: 'Wasiliana na Daktari', icon: <IconDoctor /> },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const user = auth.currentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="/dashboard" className="brand" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          <span className="dot"><IconLogo /></span> AfyaTathmini
        </a>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="ic">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="user-box">
          <div className="name">{user?.name}</div>
          <div className="meta">{user?.email}</div>
          <button className="btn btn-outline btn-block" onClick={handleLogout}>Toka</button>
        </div>
      </aside>
      <main className="main">{children}</main>
      <ChatWidget />
    </div>
  );
}
