import { Lead } from '../types';

// Dados mockados para uso no frontend
export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    phone: '(11) 98765-4321',
    source: 'instagram',
    stage: 'new',
    status: 'active',
    interest: 'SUV compacto',
    notes: 'Interessado no modelo XYZ, precisa de financiamento',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Maria Silva',
    phone: '(11) 91234-5678',
    source: 'whatsapp',
    stage: 'qualifying',
    status: 'active',
    interest: 'Sedan médio',
    notes: 'Já possui um veículo, busca upgrade',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Lucas Mendes',
    phone: '(11) 97777-8888',
    source: 'website',
    stage: 'proposal',
    status: 'active',
    interest: 'Picape',
    notes: 'Negociando desconto, quer fechar na próxima semana',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Ana Paula Costa',
    phone: '(11) 95555-4444',
    source: 'referral',
    stage: 'closed',
    status: 'won',
    interest: 'Hatch esportivo',
    notes: 'Fechou compra à vista',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
