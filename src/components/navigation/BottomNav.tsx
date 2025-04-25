import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Hide on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div className="flex items-center justify-around h-16">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Leads</span>
        </button>
        
        <button
          onClick={() => navigate('/new-lead')}
          className="flex items-center justify-center bg-blue-600 text-white rounded-full w-14 h-14 -mt-5 shadow-lg"
        >
          <Plus size={24} />
        </button>
        
        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
}