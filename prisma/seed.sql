-- Limpar tabelas existentes
TRUNCATE "Lead", "Seller", "Car", "User", "Company" CASCADE;

-- Inserir empresas
INSERT INTO "Company" (id, name, cnpj, address, phone, email, logo, active, "createdAt", "updatedAt")
VALUES 
  ('c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1', 'Auto Motors Ltda', '12.345.678/0001-90', 'Av. Paulista, 1000, São Paulo - SP', '(11) 3456-7890', 'contato@automotors.com.br', 'https://via.placeholder.com/150', true, NOW(), NOW()),
  ('c2b2c2b2-c2b2-c2b2-c2b2-c2b2c2b2c2b2', 'Veículos Premium', '98.765.432/0001-10', 'Rua Augusta, 500, São Paulo - SP', '(11) 2345-6789', 'contato@veiculospremium.com.br', NULL, true, NOW(), NOW());

-- Inserir usuários (senha: Lima@1020 = $2b$10$qnrBKl.o9jYZpZ.xDP0Mre9bevIQzO0xZLnbZmBrk2qsMjGqLqTSa para o admin)
INSERT INTO "User" (id, name, email, phone, password, role, active, "createdAt", "updatedAt", "companyId")
VALUES 
  ('u1b1u1b1-u1b1-u1b1-u1b1-u1b1u1b1u1b1', 'Diego Costa', 'diegocosta.marketing@gmail.com', '(11) 99999-9999', '$2b$10$qnrBKl.o9jYZpZ.xDP0Mre9bevIQzO0xZLnbZmBrk2qsMjGqLqTSa', 'admin', true, NOW(), NOW(), 'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
  ('u2b2u2b2-u2b2-u2b2-u2b2-u2b2u2b2u2b2', 'Gerente', 'gerente@exemplo.com', '(11) 98888-8888', '$2b$10$qnrBKl.o9jYZpZ.xDP0Mre9bevIQzO0xZLnbZmBrk2qsMjGqLqTSa', 'manager', true, NOW(), NOW(), 'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
  ('u3b3u3b3-u3b3-u3b3-u3b3-u3b3u3b3u3b3', 'Usuário', 'usuario@exemplo.com', '(11) 97777-7777', '$2b$10$qnrBKl.o9jYZpZ.xDP0Mre9bevIQzO0xZLnbZmBrk2qsMjGqLqTSa', 'user', true, NOW(), NOW(), 'c2b2c2b2-c2b2-c2b2-c2b2-c2b2c2b2c2b2');

-- Inserir vendedores
INSERT INTO "Seller" (id, name, email, phone, role, avatar, active, "createdAt", "updatedAt", "companyId")
VALUES 
  ('s1b1s1b1-s1b1-s1b1-s1b1-s1b1s1b1s1b1', 'Ricardo Silva', 'ricardo.silva@automotors.com.br', '(11) 98765-4321', 'Gerente de Vendas', 'https://randomuser.me/api/portraits/men/1.jpg', true, NOW(), NOW(), 'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
  ('s2b2s2b2-s2b2-s2b2-s2b2-s2b2s2b2s2b2', 'Amanda Oliveira', 'amanda.oliveira@automotors.com.br', '(11) 97654-3210', 'Vendedora', 'https://randomuser.me/api/portraits/women/2.jpg', true, NOW(), NOW(), 'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
  ('s3b3s3b3-s3b3-s3b3-s3b3-s3b3s3b3s3b3', 'Carlos Mendes', 'carlos.mendes@veiculospremium.com.br', '(11) 96543-2109', 'Vendedor Sênior', 'https://randomuser.me/api/portraits/men/3.jpg', true, NOW(), NOW(), 'c2b2c2b2-c2b2-c2b2-c2b2-c2b2c2b2c2b2');

-- Inserir carros
INSERT INTO "Car" (id, model, price, "createdAt", "updatedAt", "companyId")
VALUES 
  ('ca1b1ca1-ca1b-ca1b-ca1b-ca1bca1bca1b', 'HB20 Sense 1.0', 69990, NOW(), NOW(), 'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
  ('ca2b2ca2-ca2b-ca2b-ca2b-ca2bca2bca2b', 'Onix LT 1.0', 72990, NOW(), NOW(), 'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
  ('ca3b3ca3-ca3b-ca3b-ca3b-ca3bca3bca3b', 'Kwid Zen 1.0', 64990, NOW(), NOW(), 'c2b2c2b2-c2b2-c2b2-c2b2-c2b2c2b2c2b2');

-- Inserir leads
INSERT INTO "Lead" (id, name, phone, source, stage, status, interest, notes, "createdAt", "updatedAt", "sellerId", "companyId")
VALUES 
  ('l1b1l1b1-l1b1-l1b1-l1b1-l1b1l1b1l1b1', 'Carlos Oliveira', '(11) 98765-4321', 'instagram', 'new', 'active', 'HB20 Sense 1.0 - R$ 69.990', 'Interessado no modelo XYZ, precisa de financiamento', NOW(), NOW(), 's1b1s1b1-s1b1-s1b1-s1b1-s1b1s1b1s1b1', 'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
  ('l2b2l2b2-l2b2-l2b2-l2b2-l2b2l2b2l2b2', 'Maria Silva', '(11) 91234-5678', 'whatsapp', 'qualifying', 'active', 'Onix LT 1.0 - R$ 72.990', 'Já possui um veículo, busca upgrade', NOW(), NOW(), 's2b2s2b2-s2b2-s2b2-s2b2-s2b2s2b2s2b2', 'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
  ('l3b3l3b3-l3b3-l3b3-l3b3-l3b3l3b3l3b3', 'Lucas Mendes', '(11) 97777-8888', 'website', 'proposal', 'active', 'Kwid Zen 1.0 - R$ 64.990', 'Negociando desconto, quer fechar na próxima semana', NOW(), NOW(), 's3b3s3b3-s3b3-s3b3-s3b3-s3b3s3b3s3b3', 'c2b2c2b2-c2b2-c2b2-c2b2-c2b2c2b2c2b2'),
  ('l4b4l4b4-l4b4-l4b4-l4b4-l4b4l4b4l4b4', 'Ana Paula Costa', '(11) 95555-4444', 'referral', 'closed', 'won', 'HB20 Sense 1.0 - R$ 69.990', 'Fechou compra à vista', NOW(), NOW(), 's1b1s1b1-s1b1-s1b1-s1b1-s1b1s1b1s1b1', 'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1');
