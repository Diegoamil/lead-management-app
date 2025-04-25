import React from 'react';
import { LogOut, User } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, logout } = useAuth();
  
  return (
    <>
      <Header title="Meu Perfil" />
      
      <PageContainer>
        <div className="flex flex-col items-center justify-center pt-8 pb-6">
          <div className="bg-gray-200 rounded-full p-6 mb-4">
            <User size={42} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-gray-500">{user?.phone}</p>
        </div>
        
        <Card className="mb-4">
          <div className="divide-y divide-gray-100">
            <div className="py-3">
              <h3 className="font-medium">Telefone</h3>
              <p className="text-gray-500 mt-1">{user?.phone}</p>
            </div>
            <div className="py-3">
              <h3 className="font-medium">Email</h3>
              <p className="text-gray-500 mt-1">usuario@exemplo.com</p>
            </div>
            <div className="py-3">
              <h3 className="font-medium">Equipe</h3>
              <p className="text-gray-500 mt-1">Vendas - Matriz</p>
            </div>
          </div>
        </Card>
        
        <Button 
          variant="outline" 
          fullWidth
          onClick={logout}
          icon={<LogOut size={18} />}
        >
          Sair da conta
        </Button>
      </PageContainer>
    </>
  );
}