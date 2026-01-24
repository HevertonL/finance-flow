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

window.fetch = async (...args) => {
  // Lê a configuração salva pelo Controller no LocalStorage
  const chaosConfig = JSON.parse(localStorage.getItem('finance_flow_chaos') || '{}');
  
  // Só ataca se estiver ATIVO e tiver chance
  if (chaosConfig.active && Math.random() < (chaosConfig.attackChance || 0.3)) {
    const gremlins = chaosConfig.selectedGremlins || [];

    // 1. Gremlin de Erro 500
    if (gremlins.includes('NETWORK_ERROR') || gremlins.includes('Erro 500 (API)')) {
      console.warn('🔥 Gremlin de Rede: Simulando Erro 500');
      return new Response(JSON.stringify({ error: "Chaos Server Error" }), { 
        status: 500, 
        statusText: "Internal Server Error" 
      });
    }

    // 2. Gremlin de Lentidão (Delay)
    if (gremlins.includes('RANDOM_DELAY') || gremlins.includes('Latencia de Rede')) {
      const delay = Math.floor(Math.random() * 3000) + 1000; // 1s a 4s de atraso
      console.warn(`🐢 Gremlin de Rede: Atrasando resposta em ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Se o caos não atacar, segue a vida normal
  return originalFetch(...args);
};
// --- FIM DO CHAOS MODE ---

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

