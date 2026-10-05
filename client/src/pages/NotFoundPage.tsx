import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-earth-100 text-earth-700 flex items-center justify-center mb-4 border border-earth-200 shadow-sm">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-4xl font-extrabold text-stone-900 tracking-tight mb-2">404</span>
      <h1 className="text-xl font-bold text-stone-800 mb-2">Field Coordinate Not Found</h1>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-6 leading-relaxed">
        The page or agronomic record you are looking for does not exist or has been relocated.
      </p>
      <div className="flex items-center gap-3">
        <Link to={isAuthenticated ? '/dashboard' : '/'}>
          <Button variant="primary" leftIcon={isAuthenticated ? <LayoutDashboard className="w-4 h-4" /> : <Home className="w-4 h-4" />}>
            {isAuthenticated ? 'Return to Dashboard' : 'Go to Homepage'}
          </Button>
        </Link>
      </div>
    </div>
  );
};
