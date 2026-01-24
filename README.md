# FinanceFlow 💰

Aplicação Fullstack para gestão financeira pessoal.
**Frontend:** React (Vite) + TailwindCSS | **Backend:** Node.js (Express) + Prisma + PostgreSQL.

O Frontend já está preparado para deploy na Vercel e o Backend estruturado para rodar localmente com Docker.

## 🚀 Funcionalidades

- **Arquitetura Cliente-Servidor Real**: Comunicação via API REST entre React e Node.js.
- **Persistência de Dados**: Banco de dados PostgreSQL rodando em container Docker.
- **ORM Moderno**: Uso do Prisma para gerenciamento de schema e migrations.
- **CRUD Completo**: Criar, listar, editar e excluir transações reais.
- **Dashboard Financeiro**: Cálculos de entradas, saídas e saldo realizados em tempo real.
- **Feedback Visual**: Sistema de Toasts para sucesso/erro nas requisições.
- **Acessibilidade para QA**: Todos os elementos críticos possuem `data-testid` para automação.

## 🛠️ Tecnologias

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios (Consumo de API)

### Backend & Banco
- Node.js (v20+)
- Express
- Prisma ORM
- PostgreSQL
- Docker & Docker Compose

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
* [Node.js](https://nodejs.org/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (e que ele esteja rodando)
* Git

## 🏃 Como Rodar o Projeto

O projeto está dividido em duas pastas principais: `backend` e `frontend`. Siga a ordem abaixo:

### 1. Banco de Dados (Docker)
Na raiz do projeto, suba o container do banco:
```bash
docker-compose up -d

```

### 2. Backend (API)

Abra um terminal, entre na pasta backend e instale as dependências:

```bash
cd backend
npm install

```

Configure o banco de dados (Criação das tabelas):

```bash
npx prisma generate
npx prisma migrate dev --name init

```

Rode o servidor:

```bash
npm run dev

```

*O backend rodará em: `http://localhost:3000*`

### 3. Frontend (Aplicação)

Abra **outro terminal**, entre na pasta frontend e rode:

```bash
cd frontend
npm install
npm run dev

```

*O frontend rodará em: `http://localhost:5173*`

---

## 🧪 Testes e QA

A aplicação foi desenhada pensando em QA. Utilizamos atributos `data-testid` estáveis para facilitar a automação com Cypress, Robot Framework ou Playwright.

### Mapeamento de Elementos (Data-TestIDs):

**Navegação e Ações:**

* `btn-new-transaction`: Botão abrir modal de nova transação
* `btn-edit-{id}`: Botão de editar (na linha da tabela)
* `btn-delete-{id}`: Botão de excluir (na linha da tabela)
* `btn-save`: Botão Salvar (Modal)
* `btn-cancel`: Botão Cancelar (Modal)

**Formulário (Modal):**

* `select-type`: Tipo de transação (Entrada/Saída)
* `input-description`: Campo descrição
* `input-amount`: Campo valor
* `input-date`: Campo data
* `select-category`: Select de categoria
* `select-status`: Select de status (Pago/Pendente)

**Tabela e Visualização:**

* `transaction-table`: Container da tabela
* `table-row-{id}`: Linha específica da transação
* `cell-description-{id}`: Célula de descrição
* `cell-amount-{id}`: Célula de valor
* `summary-income`: Card de Entradas
* `summary-expense`: Card de Saídas
* `summary-balance`: Card de Saldo Total
* `table-empty`: Mensagem de "Nenhuma transação cadastrada"

**Feedback:**

* `toast`: Notificação flutuante de sucesso/erro
* `loading`: Spinner de carregamento

---

## 📝 Estrutura de Pastas

```
finance-flow/
├── backend/                # API Node.js
│   ├── prisma/             # Schema do Banco e Migrations
│   ├── src/                # Código fonte do Backend
│   ├── index.js            # Entrada da API
│   └── package.json
│
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes (Header, Tabela, Modal)
│   │   ├── services/       # Configuração do Axios (api.js)
│   │   └── ...
│   └── package.json
│
├── docker-compose.yml      # Configuração do Banco de Dados
└── README.md

```

---

> 📋 Para documentação técnica detalhada (RNs, Fluxos, Estruturas), consulte `docs/DOCUMENTACAO_TECNICA.md`
