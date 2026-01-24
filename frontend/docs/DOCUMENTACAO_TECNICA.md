# Documentação Técnica - FinanceFlow

**Status:** ✅ Implementado  
**Versão Mínima:** v1.0.0  
**Módulos Afetados:** Gestão de Transações, Resumo Financeiro, Categorização.

---

## 1. Resumo e Objetivo

Automatizar o gerenciamento completo de transações financeiras pessoais através de uma interface web moderna. O sistema deve permitir criar, editar e excluir transações financeiras (entradas e saídas), com categorização automática baseada no tipo de transação, cálculo automático de resumo financeiro e persistência local dos dados. O sistema elimina a necessidade de planilhas manuais e oferece uma experiência fluida com simulação de API assíncrona para testes de resiliência.

---

## 2. Pré-condições e Configurações

Para que o sistema funcione corretamente, o ambiente deve atender rigorosamente à matriz abaixo:

| Categoria | Requisito / Configuração | Detalhe Técnico |
|-----------|--------------------------|-----------------|
| **Ambiente de Execução** | Node.js | Versão mínima v18.0.0 ou superior |
| **Gerenciador de Pacotes** | npm | Versão 9.0.0 ou superior |
| **Navegador** | Navegador Moderno | Chrome 90+, Firefox 88+, Edge 90+ ou Safari 14+ |
| **Armazenamento** | localStorage | Deve estar habilitado no navegador |
| **Build Tool** | Vite | Configurado via `vite.config.js` |
| **Framework CSS** | TailwindCSS | Versão 3.4.0, configurado via `tailwind.config.js` |
| **Dependências Core** | React | Versão 18.2.0 |
| **Persistência** | Chave localStorage | `finance_flow_transactions` (criada automaticamente) |
| **Configuração de Categorias** | Arquivo de Constantes | `src/constants/categories.js` deve existir |

⚠️ **Atenção (Compatibilidade):**

- O sistema utiliza `localStorage` para persistência. Em modo privado/incógnito, alguns navegadores podem bloquear o acesso.
- A simulação de API possui delay de 1-2 segundos intencional para simular comportamento real.
- Erros aleatórios (10% das requisições) são propositais para testes de resiliência.

---

## 3. Regras de Negócio (RNs)

### RN01 - Separação de Categorias por Tipo
**Descrição:** O sistema deve apresentar categorias diferentes baseadas no tipo de transação selecionado (Entrada ou Saída).

**Implementação:**
- Categorias de **Entrada**: Salário, Freelance, Investimentos, Vendas, Aluguel Recebido, Dividendos, Bonificação, Outros.
- Categorias de **Saída**: Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Contas, Compras, Impostos, Outros.

**Validação:** Ao mudar o tipo no formulário, a lista de categorias deve ser atualizada dinamicamente e a categoria selecionada deve ser limpa.

---

### RN02 - Conversão Automática de Valores
**Descrição:** O sistema deve converter automaticamente valores positivos para Entradas e negativos para Saídas no momento do armazenamento.

**Implementação:**
- No formulário, o valor é sempre inserido como positivo.
- Ao salvar:
  - Se tipo = "Entrada": `amount = parseFloat(value)`
  - Se tipo = "Saída": `amount = -Math.abs(parseFloat(value))`
- Na exibição, valores negativos são mostrados com sinal negativo e cor vermelha.

**Validação:** Transações de Entrada devem ter `amount >= 0` e transações de Saída devem ter `amount < 0`.

---

### RN03 - Cálculo Automático de Resumo
**Descrição:** O sistema deve calcular automaticamente o resumo financeiro (Entradas, Saídas e Saldo Total) sempre que houver alteração nas transações.

**Implementação:**
- **Entradas**: Soma de todas as transações com `amount > 0`
- **Saídas**: Valor absoluto da soma de todas as transações com `amount < 0`
- **Saldo Total**: `Entradas - Saídas`

**Validação:** O resumo deve ser atualizado imediatamente após criar, editar ou excluir transações.

---

### RN04 - Validação de Campos Obrigatórios
**Descrição:** Todos os campos do formulário de transação são obrigatórios e devem ser validados antes do envio.

**Campos Obrigatórios:**
- Tipo de Transação (select-type)
- Descrição (input-description)
- Valor (input-amount)
- Categoria (select-category)
- Data (input-date)
- Status (select-status)

**Implementação:** Utiliza atributo HTML5 `required` e validação no submit do formulário.

**Validação:** O botão "Salvar" não deve processar o formulário se algum campo obrigatório estiver vazio.

---

### RN05 - Persistência em localStorage
**Descrição:** Todas as transações devem ser persistidas no `localStorage` do navegador com a chave `finance_flow_transactions`.

**Estrutura de Dados:**
```json
{
  "id": "timestamp_string",
  "description": "string",
  "amount": "number (positivo ou negativo)",
  "category": "string",
  "date": "YYYY-MM-DD",
  "status": "Pendente | Pago",
  "createdAt": "ISO_timestamp",
  "updatedAt": "ISO_timestamp (opcional)"
}
```

**Validação:** Dados devem persistir após recarregar a página e fechar/abrir o navegador.

---

### RN06 - Simulação de Erro Aleatório
**Descrição:** O sistema deve simular falhas de requisição em 10% das chamadas de API para testar resiliência.

**Implementação:**
- Função `shouldSimulateError()` retorna `true` em 10% das execuções.
- Quando erro ocorre, retorna `Error('Erro 500: Falha na requisição simulada')`.
- Toast de erro deve ser exibido e operação não deve ser concluída.

**Validação:** Aproximadamente 1 em 10 requisições deve falhar propositalmente.

---

### RN07 - Delay Simulado de API
**Descrição:** Todas as requisições devem ter delay aleatório entre 1 e 2 segundos para simular comportamento de API real.

**Implementação:**
- Função `getRandomDelay()` retorna valor entre 1000ms e 2000ms.
- Delay aplicado via `setTimeout` antes de processar a operação.

**Validação:** Usuário deve perceber delay de 1-2 segundos em todas as operações CRUD.

---

### RN08 - Formatação de Valores e Datas
**Descrição:** Valores monetários e datas devem ser formatados conforme padrão brasileiro (pt-BR).

**Implementação:**
- **Valores**: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
  - Exemplo: `1234.56` → `R$ 1.234,56`
- **Datas**: `toLocaleDateString('pt-BR')`
  - Exemplo: `2024-01-15` → `15/01/2024`

**Validação:** Todos os valores e datas exibidos devem seguir formato pt-BR.

---

### RN09 - Identificação Visual por Tipo
**Descrição:** O sistema deve usar cores diferentes para identificar visualmente transações de Entrada e Saída.

**Implementação:**
- **Entrada**: Badge verde (`bg-green-100 text-green-800`), valor em verde (`text-green-600`)
- **Saída**: Badge vermelho (`bg-red-100 text-red-800`), valor em vermelho (`text-red-600`)

**Validação:** Cores devem ser consistentes em toda a aplicação (tabela, badges, valores).

---

### RN10 - Limpeza de Categoria ao Mudar Tipo
**Descrição:** Ao mudar o tipo de transação no formulário, a categoria selecionada deve ser limpa automaticamente.

**Implementação:**
- No evento `onChange` do `select-type`, se `name === 'type'`, limpar `category: ''`.

**Validação:** Ao alternar entre Entrada e Saída, categoria deve voltar para estado vazio.

---

## 4. Fluxo Principal (Caminho Feliz)

### 4.1. Fluxo de Criação de Transação

```
1. Usuário acessa a aplicação
   └─> Sistema carrega transações do localStorage (delay 1-2s)
       └─> Exibe resumo financeiro calculado
           └─> Exibe tabela de transações (ou mensagem de vazio)

2. Usuário clica em "Nova Transação" (btn-new-transaction)
   └─> Sistema abre modal (TransactionModal)
       └─> Modal exibe formulário vazio
           └─> Tipo padrão: "Entrada"
               └─> Data padrão: data atual
                   └─> Status padrão: "Pendente"

3. Usuário seleciona tipo "Entrada" ou "Saída" (select-type)
   └─> Sistema atualiza lista de categorias disponíveis
       └─> Se mudou tipo, limpa categoria selecionada

4. Usuário preenche formulário:
   - Descrição (input-description)
   - Valor (input-amount) - sempre positivo
   - Categoria (select-category) - baseada no tipo
   - Data (input-date)
   - Status (select-status)

5. Usuário clica em "Salvar" (btn-save)
   └─> Sistema valida campos obrigatórios
       └─> Se válido:
           └─> Converte valor conforme tipo:
               - Entrada: valor positivo
               - Saída: valor negativo
               └─> Sistema simula requisição (delay 1-2s)
                   ├─> 10% chance de erro → Toast de erro, mantém modal aberto
                   └─> 90% sucesso:
                       └─> Salva no localStorage
                           └─> Gera ID único (timestamp)
                               └─> Adiciona createdAt
                                   └─> Recarrega transações
                                       └─> Fecha modal
                                           └─> Exibe toast de sucesso
                                               └─> Atualiza resumo financeiro
                                                   └─> Atualiza tabela
```

### 4.2. Fluxo de Edição de Transação

```
1. Usuário visualiza tabela de transações
   └─> Sistema exibe todas as transações cadastradas

2. Usuário clica em "Editar" (btn-edit-{id})
   └─> Sistema abre modal com dados da transação
       └─> Detecta tipo automaticamente:
           - amount >= 0 → Tipo "Entrada"
           - amount < 0 → Tipo "Saída"
           └─> Converte valor para positivo no input
               └─> Carrega categorias do tipo correto
                   └─> Preenche todos os campos

3. Usuário modifica campos desejados
   └─> Sistema atualiza estado do formulário

4. Usuário clica em "Salvar" (btn-save)
   └─> Sistema valida campos
       └─> Converte valor conforme tipo
           └─> Simula requisição de atualização (delay 1-2s)
               ├─> Erro → Toast de erro
               └─> Sucesso:
                   └─> Atualiza no localStorage
                       └─> Adiciona updatedAt
                           └─> Recarrega transações
                               └─> Fecha modal
                                   └─> Toast de sucesso
                                       └─> Atualiza resumo e tabela
```

### 4.3. Fluxo de Exclusão de Transação

```
1. Usuário visualiza tabela de transações
   └─> Sistema exibe todas as transações

2. Usuário clica em "Excluir" (btn-delete-{id})
   └─> Sistema exibe diálogo de confirmação
       └─> window.confirm("Tem certeza que deseja excluir esta transação?")
           ├─> Usuário cancela → Nenhuma ação
           └─> Usuário confirma:
               └─> Sistema simula requisição de exclusão (delay 1-2s)
                   ├─> Erro → Toast de erro, transação mantida
                   └─> Sucesso:
                       └─> Remove do localStorage
                           └─> Recarrega transações
                               └─> Toast de sucesso
                                   └─> Atualiza resumo financeiro
                                       └─> Atualiza tabela (remove linha)
```

### 4.4. Fluxo de Cálculo de Resumo Financeiro

```
1. Sistema carrega transações do localStorage
   └─> Array de transações disponível

2. Sistema executa calculateSummary()
   └─> Filtra transações com amount > 0 → income
       └─> Soma valores → totalIncome
           └─> Filtra transações com amount < 0 → expenses
               └─> Soma valores absolutos → totalExpense
                   └─> Calcula balance = totalIncome - totalExpense
                       └─> Retorna { income, expense, balance }

3. Sistema passa resumo para componente Header
   └─> Header renderiza valores formatados
       └─> Aplica cores condicionais:
           - balance >= 0 → verde
           - balance < 0 → vermelho
```

---

## 5. Tratamento de Erros

### 5.1. Erro Aleatório (10% das requisições)

**Cenário:** Sistema tenta criar/editar/excluir transação e ocorre erro simulado.

**Fluxo:**
```
1. Requisição é processada
   └─> shouldSimulateError() retorna true (10% chance)
       └─> Promise é rejeitada com Error('Erro 500: Falha na requisição simulada')
           └─> catch block captura erro
               └─> showToast(error.message, 'error')
                   └─> Toast vermelho exibido
                       └─> Modal permanece aberto (se criação/edição)
                           └─> Dados não são salvos
                               └─> Tabela não é atualizada
```

### 5.2. Erro de Validação

**Cenário:** Usuário tenta salvar formulário com campos vazios.

**Fluxo:**
```
1. Usuário clica em "Salvar"
   └─> Formulário HTML5 valida campos required
       └─> Se campo vazio:
           └─> Navegador exibe mensagem nativa de validação
               └─> Submit é bloqueado
                   └─> Nenhuma requisição é enviada
```

### 5.3. Erro de Transação Não Encontrada

**Cenário:** Sistema tenta editar/excluir transação que não existe mais.

**Fluxo:**
```
1. Sistema tenta atualizar/excluir transação
   └─> Busca transação por ID no localStorage
       └─> Transação não encontrada (index === -1)
           └─> Lança Error('Transação não encontrada')
               └─> Toast de erro exibido
                   └─> Operação não é concluída
```

---

## 6. Estrutura de Dados

### 6.1. Transação (Transaction)

```typescript
interface Transaction {
  id: string;                    // Timestamp como string (ex: "1704067200000")
  description: string;             // Descrição da transação
  amount: number;                 // Valor: positivo (Entrada) ou negativo (Saída)
  category: string;                // Categoria da lista correspondente ao tipo
  date: string;                    // Data no formato ISO (YYYY-MM-DD)
  status: 'Pendente' | 'Pago';    // Status da transação
  createdAt: string;              // Timestamp ISO de criação
  updatedAt?: string;             // Timestamp ISO de atualização (opcional)
}
```

### 6.2. Resumo Financeiro (Summary)

```typescript
interface Summary {
  income: number;    // Total de entradas (soma de amount > 0)
  expense: number;   // Total de saídas (valor absoluto da soma de amount < 0)
  balance: number;   // Saldo total (income - expense)
}
```

### 6.3. Formulário de Transação (FormData)

```typescript
interface TransactionFormData {
  type: 'Entrada' | 'Saída';      // Tipo de transação
  description: string;            // Descrição
  amount: string;                  // Valor como string (sempre positivo no input)
  category: string;                // Categoria selecionada
  date: string;                    // Data (YYYY-MM-DD)
  status: 'Pendente' | 'Pago';    // Status
}
```

---

## 7. Componentes e Responsabilidades

### 7.1. App.jsx
- **Responsabilidade:** Gerenciamento de estado global e orquestração
- **Estados:** transactions, isModalOpen, editingTransaction, loading, toast
- **Funções Principais:** loadTransactions, handleSave, handleDelete, calculateSummary

### 7.2. TransactionModal.jsx
- **Responsabilidade:** Formulário de criação/edição
- **Props:** isOpen, onClose, transaction, onSave
- **Lógica:** Conversão de valores, validação, limpeza de categoria

### 7.3. TransactionTable.jsx
- **Responsabilidade:** Exibição de transações em tabela
- **Props:** transactions, onEdit, onDelete
- **Lógica:** Formatação de valores e datas, cores condicionais

### 7.4. Header.jsx
- **Responsabilidade:** Exibição do resumo financeiro
- **Props:** summary
- **Lógica:** Formatação de valores, cores condicionais

### 7.5. Toast.jsx
- **Responsabilidade:** Notificações temporárias
- **Props:** message, type, onClose
- **Lógica:** Auto-fechamento após 5 segundos

---

## 8. Configurações e Constantes

### 8.1. Categorias (src/constants/categories.js)

```javascript
// Categorias de Entrada
INCOME_CATEGORIES = [
  'Salário', 'Freelance', 'Investimentos', 'Vendas',
  'Aluguel Recebido', 'Dividendos', 'Bonificação', 'Outros'
]

// Categorias de Saída
EXPENSE_CATEGORIES = [
  'Alimentação', 'Transporte', 'Moradia', 'Saúde',
  'Educação', 'Lazer', 'Contas', 'Compras', 'Impostos', 'Outros'
]
```

### 8.2. API Simulation (src/services/api.js)

```javascript
// Configurações
STORAGE_KEY = 'finance_flow_transactions'
DELAY_MIN = 1000  // 1 segundo
DELAY_MAX = 2000  // 2 segundos
ERROR_RATE = 0.1  // 10% de chance de erro
```

---

## 9. Testes e Validação

### 9.1. Testes Manuais
Consulte `docs/CASOS_DE_TESTE_QA.md` para casos de teste detalhados.

### 9.2. Validações Automáticas
- Todos os elementos possuem `data-testid` para testes automatizados
- Estrutura de dados validada via TypeScript (se implementado)
- Validação HTML5 nos formulários

---

## 10. Troubleshooting

### Problema: Transações não persistem após recarregar
**Solução:** Verificar se localStorage está habilitado no navegador. Limpar cache e cookies.

### Problema: Erros frequentes ao salvar
**Solução:** Normal - 10% das requisições falham propositalmente. Repetir a operação.

### Problema: Categorias não aparecem corretamente
**Solução:** Verificar se `src/constants/categories.js` existe e está importado corretamente.

### Problema: Valores aparecem incorretos
**Solução:** Verificar se tipo está correto. Entradas devem ser positivas, Saídas negativas.

---

## 11. Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 2025 | Versão inicial com categorias separadas por tipo |

---

**Documento criado para:** Equipe de Desenvolvimento e QA  
**Última atualização:** 2025  
**Mantido por:** Equipe FinanceFlow

