import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { auth } from '../lib/auth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = auth.currentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
