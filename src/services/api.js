// Simulação de API com localStorage e delay assíncrono
const STORAGE_KEY = 'finance_flow_transactions';
const DELAY_MIN = 1000;
const DELAY_MAX = 2000;

// Função para gerar delay aleatório
const getRandomDelay = () => {
  return Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN + 1)) + DELAY_MIN;
};

// Função para simular erro aleatório (1 em 10 requisições)
const shouldSimulateError = () => {
  return Math.random() < 0.1; // 10% de chance de erro
};

// Função para obter transações do localStorage
const getTransactionsFromStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Função para salvar transações no localStorage
const saveTransactionsToStorage = (transactions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

// Simular requisição com delay e possível erro
const simulateRequest = async (operation) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSimulateError()) {
        reject(new Error('Erro 500: Falha na requisição simulada'));
      } else {
        resolve(operation());
      }
    }, getRandomDelay());
  });
};

export const api = {
  // Buscar todas as transações
  async getTransactions() {
    return simulateRequest(() => {
      return getTransactionsFromStorage();
    });
  },

  // Criar nova transação
  async createTransaction(transaction) {
    return simulateRequest(() => {
      const transactions = getTransactionsFromStorage();
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      transactions.push(newTransaction);
      saveTransactionsToStorage(transactions);
      return newTransaction;
    });
  },

  // Atualizar transação existente
  async updateTransaction(id, updatedTransaction) {
    return simulateRequest(() => {
      const transactions = getTransactionsFromStorage();
      const index = transactions.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Transação não encontrada');
      }
      transactions[index] = {
        ...transactions[index],
        ...updatedTransaction,
        updatedAt: new Date().toISOString(),
      };
      saveTransactionsToStorage(transactions);
      return transactions[index];
    });
  },

  // Deletar transação
  async deleteTransaction(id) {
    return simulateRequest(() => {
      const transactions = getTransactionsFromStorage();
      const filtered = transactions.filter((t) => t.id !== id);
      if (filtered.length === transactions.length) {
        throw new Error('Transação não encontrada');
      }
      saveTransactionsToStorage(filtered);
      return { success: true };
    });
  },
};

