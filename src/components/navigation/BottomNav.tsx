import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, User, Building2, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type BottomNavProps = {
  showCompaniesTab?: boolean;
};

export function BottomNav({ showCompaniesTab = false }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isManager } = useAuth();
  
  // Hide on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div className="flex items-center justify-around h-16">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center ${
            showCompaniesTab ? 'w-1/5' : 'w-1/4'
          } h-full ${
            location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Leads</span>
        </button>
        
        {/* Mostrar botão de Empresas apenas para administradores */}
        {showCompaniesTab && (
          <button
            onClick={() => navigate('/companies')}
            className={`flex flex-col items-center justify-center w-1/5 h-full ${
              location.pathname === '/companies' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Building2 size={20} />
            <span className="text-xs mt-1">Empresas</span>
          </button>
        )}
        
        <button
          onClick={() => navigate('/new-lead')}
          className="flex items-center justify-center bg-blue-600 text-white rounded-full w-14 h-14 -mt-5 shadow-lg"
        >
          <Plus size={24} />
        </button>
        
        {/* Mostrar botão de Vendedores apenas para gerentes ou administradores */}
        {isManager && (
          <button
            onClick={() => navigate('/sellers')}
            className={`flex flex-col items-center justify-center ${
              showCompaniesTab ? 'w-1/5' : 'w-1/4'
            } h-full ${
              location.pathname === '/sellers' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Users size={20} />
            <span className="text-xs mt-1">Vendedores</span>
          </button>
        )}
        
        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center ${
            showCompaniesTab ? 'w-1/5' : 'w-1/4'
          } h-full ${
            location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
}