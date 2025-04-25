import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes (opcional)
  await prisma.lead.deleteMany({});
  await prisma.seller.deleteMany({});
  await prisma.car.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.company.deleteMany({});

  // Criar empresas de exemplo
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'Auto Motors Ltda',
        cnpj: '12.345.678/0001-90',
        address: 'Av. Paulista, 1000, São Paulo - SP',
        phone: '(11) 3456-7890',
        email: 'contato@automotors.com.br',
        logo: 'https://via.placeholder.com/150',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Veículos Premium',
        cnpj: '98.765.432/0001-10',
        address: 'Rua Augusta, 500, São Paulo - SP',
        phone: '(11) 2345-6789',
        email: 'contato@veiculospremium.com.br',
      },
    }),
  ]);

  // Criar usuários de exemplo
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@exemplo.com',
        phone: '(11) 99999-9999',
        password: await bcrypt.hash('senha123', 10),
        role: 'admin',
        companyId: companies[0].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Gerente',
        email: 'gerente@exemplo.com',
        phone: '(11) 98888-8888',
        password: await bcrypt.hash('senha123', 10),
        role: 'manager',
        companyId: companies[0].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Usuário',
        email: 'usuario@exemplo.com',
        phone: '(11) 97777-7777',
        password: await bcrypt.hash('senha123', 10),
        role: 'user',
        companyId: companies[1].id,
      },
    }),
  ]);

  // Criar vendedores de exemplo
  const sellers = await Promise.all([
    prisma.seller.create({
      data: {
        name: 'Ricardo Silva',
        email: 'ricardo.silva@automotors.com.br',
        phone: '(11) 98765-4321',
        companyId: companies[0].id,
        role: 'Gerente de Vendas',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
    }),
    prisma.seller.create({
      data: {
        name: 'Amanda Oliveira',
        email: 'amanda.oliveira@automotors.com.br',
        phone: '(11) 97654-3210',
        companyId: companies[0].id,
        role: 'Vendedora',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
    }),
    prisma.seller.create({
      data: {
        name: 'Carlos Mendes',
        email: 'carlos.mendes@veiculospremium.com.br',
        phone: '(11) 96543-2109',
        companyId: companies[1].id,
        role: 'Vendedor Sênior',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
    }),
  ]);

  // Criar carros de exemplo
  const cars = await Promise.all([
    prisma.car.create({
      data: {
        model: 'HB20 Sense 1.0',
        price: 69990,
        companyId: companies[0].id,
      },
    }),
    prisma.car.create({
      data: {
        model: 'Onix LT 1.0',
        price: 72990,
        companyId: companies[0].id,
      },
    }),
    prisma.car.create({
      data: {
        model: 'Kwid Zen 1.0',
        price: 64990,
        companyId: companies[1].id,
      },
    }),
  ]);

  // Criar leads de exemplo
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        name: 'Carlos Oliveira',
        phone: '(11) 98765-4321',
        source: 'instagram',
        stage: 'new',
        status: 'active',
        interest: `${cars[0].model} - R$ ${cars[0].price.toLocaleString('pt-BR')}`,
        notes: 'Interessado no modelo XYZ, precisa de financiamento',
        sellerId: sellers[0].id,
        companyId: companies[0].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Maria Silva',
        phone: '(11) 91234-5678',
        source: 'whatsapp',
        stage: 'qualifying',
        status: 'active',
        interest: `${cars[1].model} - R$ ${cars[1].price.toLocaleString('pt-BR')}`,
        notes: 'Já possui um veículo, busca upgrade',
        sellerId: sellers[1].id,
        companyId: companies[0].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Lucas Mendes',
        phone: '(11) 97777-8888',
        source: 'website',
        stage: 'proposal',
        status: 'active',
        interest: `${cars[2].model} - R$ ${cars[2].price.toLocaleString('pt-BR')}`,
        notes: 'Negociando desconto, quer fechar na próxima semana',
        sellerId: sellers[2].id,
        companyId: companies[1].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Ana Paula Costa',
        phone: '(11) 95555-4444',
        source: 'referral',
        stage: 'closed',
        status: 'won',
        interest: `${cars[0].model} - R$ ${cars[0].price.toLocaleString('pt-BR')}`,
        notes: 'Fechou compra à vista',
        sellerId: sellers[0].id,
        companyId: companies[0].id,
      },
    }),
  ]);

  console.log('Dados de exemplo criados com sucesso!');
  console.log(`Criadas ${companies.length} empresas`);
  console.log(`Criados ${users.length} usuários`);
  console.log(`Criados ${sellers.length} vendedores`);
  console.log(`Criados ${cars.length} carros`);
  console.log(`Criados ${leads.length} leads`);
}

main()
  .catch((e) => {
    console.error('Erro ao criar dados de exemplo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
