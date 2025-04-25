# Lead Management App

Aplicação de gerenciamento de leads para vendas de veículos, desenvolvida com React, TypeScript, Tailwind CSS e PostgreSQL.

## Funcionalidades

- Visualização de leads em diferentes etapas do funil de vendas
- Filtros por data e etapa do funil
- Detalhes completos de cada lead
- Edição de informações de leads
- Cadastro de novos leads
- Integração com banco de dados PostgreSQL

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Prisma ORM
- PostgreSQL

## Configuração para Desenvolvimento

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione a URL de conexão com o banco de dados:
     ```
     DATABASE_URL="postgres://usuario:senha@host:porta/banco?sslmode=disable"
     ```
4. Execute as migrações do Prisma:
   ```
   npx prisma migrate dev
   ```
5. Popule o banco com dados iniciais:
   ```
   npm run prisma:seed
   ```
6. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

## Deploy com Easy Panel

Esta aplicação está configurada para deploy automático via Easy Panel utilizando NixPacks.

### Configuração no Easy Panel

1. Conecte seu repositório GitHub
2. Defina as variáveis de ambiente:
   - `DATABASE_URL`: URL de conexão com o banco PostgreSQL
   - `PORT`: Porta para o servidor (opcional, padrão: 3000)
3. O deploy será feito automaticamente a partir da branch principal

### Estrutura de Deploy

- O arquivo `nixpacks.toml` contém a configuração para o NixPacks
- O script `start` no `package.json` configura a sequência de inicialização:
  1. Executa as migrações do banco de dados
  2. Popula o banco com dados iniciais (se necessário)
  3. Inicia o servidor

## Estrutura do Projeto

- `/src/components`: Componentes reutilizáveis da UI
- `/src/context`: Contextos React, incluindo o LeadContext para gerenciamento de estado
- `/src/pages`: Páginas da aplicação
- `/src/types`: Definições de tipos TypeScript
- `/src/lib`: Utilitários, incluindo a configuração do Prisma
- `/prisma`: Schema do Prisma e scripts de migração/seed
