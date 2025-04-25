import { Company } from '../types';

// Dados mockados de empresas para uso no frontend
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Auto Motors Ltda',
    cnpj: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000, São Paulo - SP',
    phone: '(11) 3456-7890',
    email: 'contato@automotors.com.br',
    logo: 'https://via.placeholder.com/150',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Veículos Premium',
    cnpj: '98.765.432/0001-10',
    address: 'Rua Augusta, 500, São Paulo - SP',
    phone: '(11) 2345-6789',
    email: 'contato@veiculospremium.com.br',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  }
];
