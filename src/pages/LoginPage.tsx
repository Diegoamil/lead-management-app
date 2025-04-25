import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email ou senha inválidos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
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
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        
        <PasswordInput
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
            Manter logado
          </label>
        </div>
        
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