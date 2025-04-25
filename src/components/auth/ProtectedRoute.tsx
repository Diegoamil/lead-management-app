import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireManager?: boolean;
};

export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireManager = false 
}: ProtectedRouteProps) {
  const { user, isLoading, isAdmin, isManager } = useAuth();

  if (isLoading) {
    // Exibir um indicador de carregamento enquanto verificamos a autenticação
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, redirecionar para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar permissões de administrador, se necessário
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar permissões de gerente, se necessário
  if (requireManager && !isManager) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se o usuário estiver autenticado e tiver as permissões necessárias, renderizar o conteúdo
  return <>{children}</>;
}
