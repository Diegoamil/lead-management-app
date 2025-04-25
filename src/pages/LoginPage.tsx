import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(phone, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Telefone ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-6">
      <div className="mb-10 flex flex-col items-center">
        <div className="bg-blue-600 p-4 rounded-full mb-4">
          <Car size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900">AutoVendas CRM</h1>
        <p className="text-gray-500 text-center mt-2">Gerencie seus leads de forma simples</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete="tel"
        />
        
        <Input
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
        
        <p className="text-center mt-4">
          <a href="#" className="text-sm text-blue-600">
            Esqueceu a senha?
          </a>
        </p>
      </form>
    </div>
  );
}