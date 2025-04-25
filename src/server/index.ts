import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware - configuração CORS mais permissiva para desenvolvimento
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rota de teste
app.get('/api/test', (_req: Request, res: Response) => {
  res.json({ message: 'API funcionando corretamente!' });
});

// Rota de teste para login
app.post('/api/test-login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    console.log(`Tentativa de login para ${email}`);
    
    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log(`Usuário com email ${email} não encontrado`);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    
    // Verificar a senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      console.log(`Senha incorreta para o usuário ${email}`);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    
    // Retornar dados do usuário (sem a senha)
    const { password: _, ...userData } = user;
    console.log(`Login bem-sucedido para ${email}`);
    
    res.json({
      message: 'Login bem-sucedido',
      user: userData
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Rotas para empresas
app.get('/api/companies', async (_req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' }
    });
    console.log('Empresas encontradas:', companies.length);
    res.json(companies);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    res.status(500).json({ error: 'Erro ao buscar empresas' });
  }
});

app.get('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: { id }
    });
    
    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar empresa' });
  }
});

app.post('/api/companies', async (req: Request, res: Response) => {
  try {
    const companyData = req.body;
    console.log('Dados recebidos para criar empresa:', companyData);
    
    // Validar dados mínimos
    if (!companyData.name || !companyData.address || !companyData.phone) {
      return res.status(400).json({ error: 'Dados incompletos. Nome, endereço e telefone são obrigatórios.' });
    }
    
    const newCompany = await prisma.company.create({
      data: {
        ...companyData,
        active: true
      }
    });
    
    console.log('Nova empresa criada:', newCompany);
    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ error: 'Erro ao criar empresa' });
  }
});

app.put('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remover campos que não devem ser atualizados diretamente
    const { createdAt, updatedAt, id: updateId, ...updateData } = updates;
    
    const updatedCompany = await prisma.company.update({
      where: { id },
      data: updateData
    });
    
    res.json(updatedCompany);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
});

// Rotas para vendedores
app.get('/api/sellers', async (_req: Request, res: Response) => {
  try {
    const sellers = await prisma.seller.findMany({
      orderBy: { name: 'asc' }
    });
    console.log('Vendedores encontrados:', sellers.length);
    res.json(sellers);
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error);
    res.status(500).json({ error: 'Erro ao buscar vendedores' });
  }
});

app.get('/api/sellers/company/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const sellers = await prisma.seller.findMany({
      where: { companyId },
      orderBy: { name: 'asc' }
    });
    console.log(`Vendedores da empresa ${companyId} encontrados:`, sellers.length);
    res.json(sellers);
  } catch (error) {
    console.error(`Erro ao buscar vendedores da empresa ${req.params.companyId}:`, error);
    res.status(500).json({ error: 'Erro ao buscar vendedores da empresa' });
  }
});

app.get('/api/sellers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const seller = await prisma.seller.findUnique({
      where: { id }
    });
    
    if (!seller) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }
    
    res.json(seller);
  } catch (error) {
    console.error('Erro ao buscar vendedor:', error);
    res.status(500).json({ error: 'Erro ao buscar vendedor' });
  }
});

app.post('/api/sellers', async (req: Request, res: Response) => {
  try {
    const { password, ...sellerData } = req.body;
    console.log('Dados recebidos para criar vendedor:', { ...sellerData, password: '******' });
    
    // Validar dados mínimos
    if (!sellerData.name || !sellerData.email || !sellerData.phone || !sellerData.companyId) {
      return res.status(400).json({ 
        error: 'Dados incompletos. Nome, email, telefone e empresa são obrigatórios.' 
      });
    }
    
    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória para criar um vendedor.' });
    }
    
    // Verificar se o email já está em uso (tanto em Seller quanto em User)
    const existingSeller = await prisma.seller.findUnique({
      where: { email: sellerData.email }
    });
    
    const existingUser = await prisma.user.findUnique({
      where: { email: sellerData.email }
    });
    
    if (existingSeller || existingUser) {
      return res.status(400).json({ error: 'Este email já está em uso.' });
    }
    
    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar transação para garantir que tanto o vendedor quanto o usuário sejam criados
    const result = await prisma.$transaction(async (tx) => {
      // Criar o vendedor
      const newSeller = await tx.seller.create({
        data: {
          ...sellerData,
          active: true
        }
      });
      
      // Criar o usuário associado ao vendedor
      const newUser = await tx.user.create({
        data: {
          name: sellerData.name,
          email: sellerData.email,
          phone: sellerData.phone,
          password: hashedPassword,
          role: 'user',
          active: true,
          companyId: sellerData.companyId
        }
      });
      
      return { seller: newSeller, user: newUser };
    });
    
    console.log('Novo vendedor e usuário criados:', {
      seller: result.seller,
      user: { ...result.user, password: '[PROTEGIDO]' }
    });
    
    res.status(201).json(result.seller);
  } catch (error) {
    console.error('Erro ao criar vendedor:', error);
    res.status(500).json({ error: 'Erro ao criar vendedor' });
  }
});

app.put('/api/sellers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, ...updates } = req.body;
    
    // Remover campos que não devem ser atualizados diretamente
    const { createdAt, updatedAt, id: updateId, ...updateData } = updates;
    
    // Buscar o vendedor para verificar se existe
    const seller = await prisma.seller.findUnique({
      where: { id }
    });
    
    if (!seller) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }
    
    // Atualizar o vendedor
    const updatedSeller = await prisma.seller.update({
      where: { id },
      data: updateData
    });
    
    // Se uma nova senha foi fornecida, atualizar o usuário associado
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Buscar o usuário associado ao vendedor pelo email
      const user = await prisma.user.findUnique({
        where: { email: seller.email }
      });
      
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            name: updateData.name || user.name,
            phone: updateData.phone || user.phone,
            companyId: updateData.companyId || user.companyId
          }
        });
      }
    }
    
    res.json(updatedSeller);
  } catch (error) {
    console.error('Erro ao atualizar vendedor:', error);
    res.status(500).json({ error: 'Erro ao atualizar vendedor' });
  }
});

// Rotas para leads
app.get('/api/leads', async (req: Request, res: Response) => {
  try {
    const { userId, companyId } = req.query;
    
    if (!userId || !companyId) {
      return res.status(400).json({ error: 'UserId e companyId são obrigatórios' });
    }
    
    // Buscar o usuário para verificar seu papel
    const user = await prisma.user.findUnique({
      where: { id: userId as string }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar se o usuário pertence à empresa
    if (user.companyId !== companyId) {
      return res.status(403).json({ error: 'Usuário não pertence a esta empresa' });
    }
    
    let leads;
    
    // Se for admin ou gerente, mostrar todos os leads da empresa
    if (user.role === 'admin' || user.role === 'manager') {
      leads = await prisma.lead.findMany({
        where: {
          companyId: companyId as string
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Se for vendedor, mostrar apenas os leads criados por ele
      leads = await prisma.lead.findMany({
        where: {
          companyId: companyId as string,
          sellerId: userId as string
        },
        orderBy: { createdAt: 'desc' }
      });
    }
    
    console.log(`Leads encontrados para usuário ${userId} da empresa ${companyId}:`, leads.length);
    res.json(leads);
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

app.get('/api/leads/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, companyId } = req.query;
    
    if (!userId || !companyId) {
      return res.status(400).json({ error: 'UserId e companyId são obrigatórios' });
    }
    
    // Buscar o usuário para verificar seu papel
    const user = await prisma.user.findUnique({
      where: { id: userId as string }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar se o usuário pertence à empresa
    if (user.companyId !== companyId) {
      return res.status(403).json({ error: 'Usuário não pertence a esta empresa' });
    }
    
    const lead = await prisma.lead.findUnique({
      where: { id }
    });
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }
    
    // Verificar se o lead pertence à empresa do usuário
    if (lead.companyId !== companyId) {
      return res.status(403).json({ error: 'Lead não pertence a esta empresa' });
    }
    
    // Se não for admin ou gerente, verificar se o lead foi criado pelo usuário
    if (user.role !== 'admin' && user.role !== 'manager' && lead.sellerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para acessar este lead' });
    }
    
    res.json(lead);
  } catch (error) {
    console.error('Erro ao buscar lead:', error);
    res.status(500).json({ error: 'Erro ao buscar lead' });
  }
});

app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const leadData = req.body;
    const { userId, companyId } = req.query;
    
    if (!userId || !companyId) {
      return res.status(400).json({ error: 'UserId e companyId são obrigatórios' });
    }
    
    // Verificar se o usuário existe e pertence à empresa
    const user = await prisma.user.findUnique({
      where: { id: userId as string }
    });
    
    if (!user || user.companyId !== companyId) {
      return res.status(403).json({ error: 'Usuário não autorizado' });
    }
    
    // Criar o lead associando ao vendedor e à empresa
    const newLead = await prisma.lead.create({
      data: {
        ...leadData,
        sellerId: userId as string,
        companyId: companyId as string
      }
    });
    
    res.status(201).json(newLead);
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    res.status(500).json({ error: 'Erro ao criar lead' });
  }
});

app.put('/api/leads/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const leadData = req.body;
    const { userId, companyId } = req.query;
    
    if (!userId || !companyId) {
      return res.status(400).json({ error: 'UserId e companyId são obrigatórios' });
    }
    
    // Verificar se o usuário existe e pertence à empresa
    const user = await prisma.user.findUnique({
      where: { id: userId as string }
    });
    
    if (!user || user.companyId !== companyId) {
      return res.status(403).json({ error: 'Usuário não autorizado' });
    }
    
    // Verificar se o lead existe
    const existingLead = await prisma.lead.findUnique({
      where: { id }
    });
    
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }
    
    // Verificar se o lead pertence à empresa do usuário
    if (existingLead.companyId !== companyId) {
      return res.status(403).json({ error: 'Lead não pertence a esta empresa' });
    }
    
    // Se não for admin ou gerente, verificar se o lead foi criado pelo usuário
    if (user.role !== 'admin' && user.role !== 'manager' && existingLead.sellerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este lead' });
    }
    
    // Atualizar o lead
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: leadData
    });
    
    res.json(updatedLead);
  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    res.status(500).json({ error: 'Erro ao atualizar lead' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Teste a API em: http://localhost:${PORT}/api/test`);
});
