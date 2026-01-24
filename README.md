```markdown
# 💸 FinanceFlow - Fullstack Chaos Engineering App

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)

> **Um sistema de gestão financeira desenhado propositalmente para testar a resiliência de automações de QA.**

## 🚀 Sobre o Projeto

O **FinanceFlow** é uma aplicação Fullstack moderna que simula um sistema bancário real. Além das funcionalidades padrões (criar e listar transações), ele possui um **"Chaos Mode"** (Modo Caos) integrado.

Este modo permite injetar falhas controladas no sistema para desafiar scripts de testes automatizados (Cypress, Playwright, Robot Framework, etc.), forçando o QA a criar cenários de teste mais robustos e resilientes.

### 🌐 Links do Projeto
- **Frontend (Vercel):** [COLE_O_LINK_DA_VERCEL_AQUI]
- **Backend (Render):** [COLE_O_LINK_DO_RENDER_AQUI]
- **Documentação API (Swagger):** [COLE_O_LINK_DO_RENDER_AQUI]/api-docs

---

## 😈 Chaos Engineering (O Diferencial)

O projeto conta com um **Gremlin Controller**, um painel exclusivo onde você pode ativar "Gremlins" que sabotam a aplicação em tempo real.

### Tipos de Gremlins Disponíveis:

| Ícone | Gremlin | Descrição do Efeito | Desafio para QA |
|:---:|---|---|---|
| 🔥 | **NETWORK_ERROR** | Intercepta requisições e retorna erro 500 propositalmente. | Testar retries e tratamento de erros da API. |
| 🐢 | **RANDOM_DELAY** | Adiciona delays aleatórios (1s a 4s) nas respostas da API. | Quebrar testes que dependem de waits fixos. |
| 👻 | **GHOST_BUTTON** | Botões importantes (como "Salvar") desaparecem ou ficam transparentes. | Validar se o teste falha ou aguarda o elemento. |
| ❄️ | **FROZEN_INPUT** | Inputs de texto travam e não aceitam digitação. | Testar timeouts de preenchimento de formulário. |
| 🧮 | **MATH_ERROR** | Altera valores numéricos na tabela para `NaN` ou valores errados. | Validar asserções de conteúdo e cálculos. |

---

## 🛠️ Tech Stack & Arquitetura

O projeto foi construído utilizando uma arquitetura distribuída em serviços de nuvem modernos:

* **Frontend:** React + Vite + TailwindCSS (Hospedado na **Vercel**)
* **Backend:** Node.js + Express (Hospedado no **Render**)
* **Database:** PostgreSQL (Hospedado na **Neon**)
* **ORM:** Prisma
* **Docs:** Swagger UI

---

## 📦 Como Rodar Localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

### 1. Backend
```bash
# Clone o repositório
git clone (https://github.com/HevertonL/finance-flow.git)

# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure o arquivo .env
# Crie um arquivo .env e adicione sua URL do banco Neon ou Local:
# DATABASE_URL="postgresql://user:password@host:port/db"

# Rode as migrations do Prisma
npx prisma migrate dev

# Inicie o servidor
npm run dev
# O backend rodará em http://localhost:3000

```

### 2. Frontend

```bash
# Em outro terminal, entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o frontend
npm run dev
# O frontend rodará em http://localhost:5173

```

---

## 🧪 Desafio para QAs

Consegue criar um script de automação que sobreviva ao **Modo Caos** com 50% de chance de ataque?

1. Ative o **Chaos Mode** no painel (canto inferior direito).
2. Tente rodar seus testes de regressão.
3. Melhore seus scripts para lidar com a instabilidade!

---

Desenvolvido por **Heverton Luiz** 💻

```
