import { Seller } from '../types';

// Dados mockados de vendedores para uso no frontend
export const mockSellers: Seller[] = [
  {
    id: '1',
    name: 'Ricardo Silva',
    email: 'ricardo.silva@automotors.com.br',
    phone: '(11) 98765-4321',
    companyId: '1',
    role: 'Gerente de Vendas',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    active: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Amanda Oliveira',
    email: 'amanda.oliveira@automotors.com.br',
    phone: '(11) 97654-3210',
    companyId: '1',
    role: 'Vendedora',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    active: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@veiculospremium.com.br',
    phone: '(11) 96543-2109',
    companyId: '2',
    role: 'Vendedor Sênior',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    active: true,
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25')
  }
];
