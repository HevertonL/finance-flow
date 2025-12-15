import React, { useEffect } from 'react';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      } text-white min-w-[300px]`}
      data-testid="toast"
    >
      <div className="flex items-center justify-between">
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
          data-testid="toast-close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;

