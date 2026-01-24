import React, { useState, useEffect } from 'react';
import { useGremlins, GREMLIN_TYPES } from '../hooks/useGremlins.js';

interface GremlinControllerProps {
  defaultActive?: boolean;
}

/**
 * Componente de controle para ativar/desativar gremlins
 * Útil para desenvolvimento e testes
 */
const GremlinController: React.FC<GremlinControllerProps> = ({
  defaultActive = false
}) => {
  // 1. MUDANÇA: Inicializa lendo do LocalStorage ou usa o padrão
  const [active, setActive] = useState(() => {
    const saved = localStorage.getItem('finance_flow_chaos');
    return saved ? JSON.parse(saved).active : defaultActive;
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [attackChance, setAttackChance] = useState(0.2);
  const [attackInterval, setAttackInterval] = useState(5000);

  // 2. MUDANÇA: Inicializa gremlins selecionados do LocalStorage
  const [selectedGremlins, setSelectedGremlins] = useState(() => {
    const saved = localStorage.getItem('finance_flow_chaos');
    // Garante que pega os tipos novos (como NETWORK_ERROR) se existirem
    return saved ? JSON.parse(saved).selectedGremlins : Object.values(GREMLIN_TYPES);
  });

  const allGremlins = Object.values(GREMLIN_TYPES);

  const clearGremlins = useGremlins({
    active,
    attackChance,
    attackInterval,
    gremlinTypes: selectedGremlins,
    onGremlinAttack: (type: string) => {
      console.log(`🎯 Gremlin atacou: ${type}`);
    },
  });

  // 3. MUDANÇA: Efeito para salvar no LocalStorage sempre que mudar algo
  useEffect(() => {
    const config = {
      active,
      selectedGremlins,
      attackChance,
      attackInterval
    };
    localStorage.setItem('finance_flow_chaos', JSON.stringify(config));
  }, [active, selectedGremlins, attackChance, attackInterval]);

  const toggleGremlin = (gremlin: string) => {
    setSelectedGremlins((prev: string[]) =>
      prev.includes(gremlin)
        ? prev.filter((g) => g !== gremlin)
        : [...prev, gremlin]
    );
  };

  const handleClearAllGremlins = () => {
    clearGremlins();
    // Opcional: Se quiser limpar a seleção também, descomente a linha abaixo
    // setSelectedGremlins([]); 
  };

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-yellow-800">
          😈 Gremlins Controller
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="px-2 py-1 rounded text-xs font-medium bg-gray-500 text-white hover:bg-gray-600"
            title={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            onClick={() => setActive(!active)}
            className={`px-3 py-1 rounded text-xs font-medium ${active
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
              }`}
          >
            {active ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {active && (
            <>
              <div className="mb-3">
                <label className="block text-xs text-yellow-800 mb-1">
                  Chance de Ataque: {(attackChance * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={attackChance}
                  onChange={(e) => setAttackChance(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs text-yellow-800 mb-1">
                  Intervalo: {attackInterval / 1000}s
                </label>
                <input
                  type="range"
                  min="2000"
                  max="10000"
                  step="1000"
                  value={attackInterval}
                  onChange={(e) => setAttackInterval(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs text-yellow-800 mb-2">
                  Gremlins Ativos:
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                  {allGremlins.map((gremlin) => (
                    <label
                      key={gremlin}
                      className="flex items-center text-xs text-yellow-800 cursor-pointer hover:bg-yellow-200 rounded p-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGremlins.includes(gremlin)}
                        onChange={() => toggleGremlin(gremlin)}
                        className="mr-2"
                      />
                      {gremlin}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleClearAllGremlins}
                className="w-full px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600"
              >
                🧹 Limpar Bagunça
              </button>
            </>
          )}
        </>
      )}

      <div className="mt-2 text-xs text-yellow-700">
        Status: {active ? '🟢 Ativo' : '🔴 Inativo'}
      </div>
    </div>
  );
};

export default GremlinController;