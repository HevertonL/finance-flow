# FinanceFlow 💰

Aplicação React para gestão financeira pessoal, desenvolvida com Vite e TailwindCSS.

## 🚀 Funcionalidades

- **Header com Resumo Financeiro**: Exibe entradas, saídas e saldo total
- **Tabela de Transações**: Lista todas as transações com tipo, descrição, valor, categoria, data e status
- **Categorias Separadas**: Categorias específicas para Entradas (receitas) e Saídas (despesas)
- **CRUD Completo**: Criar, editar e excluir transações
- **Modal de Transação**: Interface para adicionar/editar transações com seleção de tipo
- **Simulação de API**: Camada de serviço que simula chamadas assíncronas com delay de 1-2 segundos
- **Persistência Local**: Dados salvos no localStorage
- **Tratamento de Erros**: Sistema de Toast para exibir erros (1 em 10 requisições falha propositalmente)
- **Acessibilidade para QA**: Todos os elementos importantes possuem `data-testid`

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🧪 Testes

A aplicação possui `data-testid` em todos os elementos importantes para facilitar testes automatizados.

### Principais data-testid:

**Navegação e Ações:**
- `btn-new-transaction`: Botão para nova transação
- `btn-edit-{id}`: Botão de editar transação
- `btn-delete-{id}`: Botão de excluir transação
- `btn-save`, `btn-cancel`: Botões do modal

**Formulário:**
- `select-type`: Select de tipo de transação (Entrada/Saída)
- `input-description`, `input-amount`, `input-date`: Inputs do formulário
- `select-category`: Select de categoria (dinâmico baseado no tipo)
- `select-status`: Select de status

**Tabela:**
- `transaction-table`: Tabela principal
- `table-row-{id}`: Linha da tabela
- `cell-type-{id}`: Célula de tipo (Entrada/Saída)
- `cell-description-{id}`, `cell-amount-{id}`, `cell-category-{id}`, `cell-date-{id}`, `cell-status-{id}`: Células da tabela
- `table-empty`: Mensagem quando não há transações

**Modais e Notificações:**
- `modal`, `modal-overlay`, `modal-title`, `modal-close`: Elementos do modal
- `toast`, `toast-close`: Componente de notificação

**Resumo Financeiro:**
- `header-logo`: Logo da aplicação
- `summary-income`, `summary-expense`, `summary-balance`: Resumo financeiro

**Outros:**
- `loading`: Indicador de carregamento

> 📖 Para lista completa, consulte `docs/ARQUITETURA.md`

## 🛠️ Tecnologias

- React 18
- Vite
- TailwindCSS
- LocalStorage (simulação de backend)

## 📝 Estrutura do Projeto

```
finance-flow/
├── docs/
│   ├── ARQUITETURA.md              # Documentação técnica detalhada
│   └── GUIA_ATUALIZACAO_DOCS.md    # Guia de atualização de documentação
├── src/
│   ├── components/
│   │   ├── Header.jsx               # Cabeçalho com resumo financeiro
│   │   ├── TransactionTable.jsx    # Tabela de transações
│   │   ├── TransactionModal.jsx     # Modal de criação/edição
│   │   └── Toast.jsx                # Notificações toast
│   ├── constants/
│   │   └── categories.js            # Categorias de Entrada e Saída
│   ├── services/
│   │   └── api.js                   # Simulação de API
│   ├── App.jsx                      # Componente raiz
│   ├── main.jsx                     # Ponto de entrada
│   └── index.css                    # Estilos globais
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```
 
> 📋 Para documentação técnica detalhada (RNs, Fluxos, Estruturas), consulte `docs/DOCUMENTACAO_TECNICA.md`  

