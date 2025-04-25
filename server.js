import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do build
app.use(express.static(join(__dirname, 'dist')));

// API Routes
// Obter todos os leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(leads);
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

// Obter um lead específico
app.get('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({
      where: { id }
    });
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }
    
    res.json(lead);
  } catch (error) {
    console.error('Erro ao buscar lead:', error);
    res.status(500).json({ error: 'Erro ao buscar lead' });
  }
});

// Criar um novo lead
app.post('/api/leads', async (req, res) => {
  try {
    const lead = await prisma.lead.create({
      data: req.body
    });
    res.status(201).json(lead);
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    res.status(500).json({ error: 'Erro ao criar lead' });
  }
});

// Atualizar um lead
app.put('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...req.body,
        updatedAt: new Date()
      }
    });
    res.json(lead);
  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    res.status(500).json({ error: 'Erro ao atualizar lead' });
  }
});

// Rota para carros
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    res.json(cars);
  } catch (error) {
    console.error('Erro ao buscar carros:', error);
    res.status(500).json({ error: 'Erro ao buscar carros' });
  }
});

// Rota para criar carro
app.post('/api/cars', async (req, res) => {
  try {
    const car = await prisma.car.create({
      data: req.body
    });
    res.status(201).json(car);
  } catch (error) {
    console.error('Erro ao criar carro:', error);
    res.status(500).json({ error: 'Erro ao criar carro' });
  }
});

// Rota para todas as outras requisições - serve o app React
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
