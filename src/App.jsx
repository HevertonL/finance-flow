import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TransactionTable from './components/TransactionTable';
import TransactionModal from './components/TransactionModal';
import Toast from './components/Toast';
import GremlinController from './components/GremlinController';
import { api } from './services/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Calcular resumo financeiro
  const calculateSummary = () => {
    const income = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = Math.abs(
      transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    
    const balance = income - expense;

    return { income, expense, balance };
  };

  // Carregar transações
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar toast
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  // Fechar toast
  const closeToast = () => {
    setToast(null);
  };

  // Abrir modal para nova transação
  const handleNewTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar transação
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  // Salvar transação (criar ou atualizar)
  const handleSave = async (transactionData) => {
    setLoading(true);
    try {
      if (editingTransaction) {
        await api.updateTransaction(editingTransaction.id, transactionData);
        showToast('Transação atualizada com sucesso!', 'success');
      } else {
        await api.createTransaction(transactionData);
        showToast('Transação criada com sucesso!', 'success');
      }
      await loadTransactions();
      handleCloseModal();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Deletar transação
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    setLoading(true);
    try {
      await api.deleteTransaction(id);
      showToast('Transação excluída com sucesso!', 'success');
      await loadTransactions();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Carregar transações ao montar o componente
  useEffect(() => {
    loadTransactions();
  }, []);

  const summary = calculateSummary();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header summary={summary} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleNewTransaction}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-md"
            data-testid="btn-new-transaction"
            disabled={loading}
          >
            Nova Transação
          </button>
        </div>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="text-center py-12" data-testid="loading">
          <p className="text-gray-500">Carregando transações...</p>
        </div>
      ) : (
        <TransactionTable
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={editingTransaction}
        onSave={handleSave}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Gremlin Controller - Apenas em desenvolvimento */}
      <GremlinController defaultActive={false} />
    </div>
  );
}

export default App;

