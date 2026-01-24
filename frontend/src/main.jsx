import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- INÍCIO DO CHAOS MODE (MONKEY PATCH) ---
// Isso intercepta todas as chamadas de rede (fetch) do navegador
const originalFetch = window.fetch;

// src/main.jsx (Trecho do Monkey Patch)

window.fetch = async (...args) => {
  const chaosConfig = JSON.parse(localStorage.getItem('finance_flow_chaos') || '{}');
  
  if (chaosConfig.active && Math.random() < (chaosConfig.attackChance || 0.3)) {
    const gremlins = chaosConfig.selectedGremlins || [];

    // 1. Gremlin de Erro 500 (Agora busca pela string correta 'NETWORK_ERROR')
    if (gremlins.includes('NETWORK_ERROR')) {
      console.warn('🔥 Gremlin de Rede: Simulando Erro 500');
      return new Response(JSON.stringify({ error: "Chaos Server Error" }), { 
        status: 500, 
        statusText: "Internal Server Error" 
      });
    }

    // 2. Gremlin de Lentidão (Busca por 'RANDOM_DELAY')
    if (gremlins.includes('RANDOM_DELAY')) {
      const delay = Math.floor(Math.random() * 3000) + 1000;
      console.warn(`🐢 Gremlin de Rede: Atrasando resposta em ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return originalFetch(...args);
};
// --- FIM DO CHAOS MODE ---

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

