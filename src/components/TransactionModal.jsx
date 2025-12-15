import React, { useState, useEffect } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/categories';

const TransactionModal = ({ isOpen, onClose, transaction, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'Entrada', // 'Entrada' ou 'Saída'
    description: '',
    amount: '',
    category: '',
    date: '',
    status: 'Pendente',
  });

  useEffect(() => {
    if (transaction) {
      // Determina o tipo baseado no valor (positivo = Entrada, negativo = Saída)
      const type = transaction.amount >= 0 ? 'Entrada' : 'Saída';
      setFormData({
        type,
        description: transaction.description || '',
        amount: Math.abs(transaction.amount || 0), // Valor sempre positivo no input
        category: transaction.category || '',
        date: transaction.date || '',
        status: transaction.status || 'Pendente',
      });
    } else {
      setFormData({
        type: 'Entrada',
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pendente',
      });
    }
  }, [transaction, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Converte o valor: positivo para Entrada, negativo para Saída
    const amount = formData.type === 'Entrada' 
      ? parseFloat(formData.amount) 
      : -Math.abs(parseFloat(formData.amount));
    
    onSave({
      ...formData,
      amount,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Se mudar o tipo, limpa a categoria para forçar nova seleção
    if (name === 'type') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        category: '', // Limpa categoria ao mudar tipo
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Obtém as categorias baseado no tipo selecionado
  const getAvailableCategories = () => {
    return formData.type === 'Entrada' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      data-testid="modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        data-testid="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800" data-testid="modal-title">
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            data-testid="modal-close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Transação
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="select-type"
            >
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-description"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-amount"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="select-category"
            >
              <option value="">Selecione uma categoria</option>
              {getAvailableCategories().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-date"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="select-status"
            >
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              data-testid="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              data-testid="btn-save"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;

