import React from 'react';

const Header = ({ summary }) => {
  const { income, expense, balance } = summary;

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-800" data-testid="header-logo">
              💰 FinanceFlow
            </h1>
          </div>
          <div className="flex gap-6">
            <div className="text-center" data-testid="summary-income">
              <p className="text-sm text-gray-600">Entradas</p>
              <p className="text-2xl font-semibold text-green-600">
                R$ {income.toFixed(2)}
              </p>
            </div>
            <div className="text-center" data-testid="summary-expense">
              <p className="text-sm text-gray-600">Saídas</p>
              <p className="text-2xl font-semibold text-red-600">
                R$ {expense.toFixed(2)}
              </p>
            </div>
            <div className="text-center" data-testid="summary-balance">
              <p className="text-sm text-gray-600">Saldo Total</p>
              <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

