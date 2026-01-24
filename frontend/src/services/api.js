// src/services/api.js

// Define a URL base.
// Se houver uma variável de ambiente (Vercel/Render), usa ela.
// Se não, usa o localhost do backend (nosso Docker/Node local).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  // Buscar todas as transações
  async getTransactions() {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      throw error; // Repassa o erro para o componente mostrar o Toast
    }
  },

  // Criar nova transação
  async createTransaction(transaction) {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar transação');
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar:", error);
      throw error;
    }
  },

  // Atualizar transação (Vai precisar implementar o PUT no backend depois)
  async updateTransaction(id, updatedTransaction) {
    try {
      // Nota: Ainda vamos criar essa rota no backend!
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'PUT', // ou PATCH
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTransaction),
      });

      if (!response.ok) throw new Error('Falha ao atualizar');
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      throw error;
    }
  },

  // Deletar transação (Vai precisar implementar o DELETE no backend depois)
  async deleteTransaction(id) {
    try {
      // Nota: Ainda vamos criar essa rota no backend!
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Falha ao deletar');
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar:", error);
      throw error;
    }
  },
};