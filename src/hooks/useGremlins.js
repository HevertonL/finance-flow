import { useEffect, useRef } from 'react';

// Tipos de gremlins disponíveis
export const GREMLIN_TYPES = {
  GHOST_BUTTON: 'GHOST_BUTTON',
  FROZEN_INPUT: 'FROZEN_INPUT',
  MATH_ERROR: 'MATH_ERROR',
  INVISIBLE_OVERLAY: 'INVISIBLE_OVERLAY',
  DISAPPEARING_TOAST: 'DISAPPEARING_TOAST',
  FROZEN_MODAL: 'FROZEN_MODAL',
  RANDOM_DELAY: 'RANDOM_DELAY',
};

/**
 * Hook para simular erros aleatórios na UI (Chaos Engineering para QA)
 * 
 * @param {Object} config - Configuração do hook
 * @param {boolean} config.active - Ativa/desativa gremlins
 * @param {number} config.attackInterval - Intervalo entre tentativas (ms)
 * @param {number} config.attackChance - Chance de ataque (0-1)
 * @param {string[]} config.gremlinTypes - Tipos de gremlins habilitados
 * @param {function} config.onGremlinAttack - Callback quando gremlin ataca
 * @returns {function} Função para limpar todos os gremlins ativos
 * 
 * @example
 * ```jsx
 * const clearGremlins = useGremlins({
 *   active: true,
 *   attackInterval: 5000,
 *   attackChance: 0.2,
 *   onGremlinAttack: (type) => console.log(`Gremlin: ${type}`)
 * });
 * ```
 */
export const useGremlins = (config = { active: true }) => {
  const {
    active = true,
    attackInterval = 5000,
    attackChance = 0.2,
    gremlinTypes,
    onGremlinAttack,
  } = config;

  // Tipos de gremlins disponíveis
  const allGremlins = Object.values(GREMLIN_TYPES);

  // Gremlins habilitados (ou todos se não especificado)
  const enabledGremlins = gremlinTypes || allGremlins;

  // Armazena estados originais para restauração
  const originalStatesRef = useRef(new Map());
  const intervalRef = useRef(null);

  /**
   * Salva o estado original de um elemento
   */
  const saveOriginalState = (element, property, key) => {
    const currentValue = property.includes('.')
      ? property.split('.').reduce((obj, prop) => obj?.[prop], element)
      : element[property];

    if (!originalStatesRef.current.has(key)) {
      originalStatesRef.current.set(key, {
        element,
        property,
        value: currentValue,
      });
    }
  };

  /**
   * Restaura o estado original de um elemento
   */
  const restoreOriginalState = (key) => {
    const state = originalStatesRef.current.get(key);
    if (state) {
      if (state.property.includes('.')) {
        const [obj, prop] = state.property.split('.');
        state.element[obj][prop] = state.value;
      } else {
        state.element[state.property] = state.value;
      }
      originalStatesRef.current.delete(key);
    }
  };

  /**
   * Limpa todos os gremlins ativos
   */
  const clearAllGremlins = () => {
    // Restaura todos os estados originais
    originalStatesRef.current.forEach((_, key) => {
      restoreOriginalState(key);
    });

    // Remove overlay se existir
    const overlay = document.getElementById('gremlin-overlay');
    if (overlay) overlay.remove();

    console.log('🧹 Todos os gremlins foram limpos');
  };

  /**
   * Gremlin: GHOST_BUTTON
   * Faz um botão sumir visualmente, mas continua no DOM
   */
  const attackGhostButton = () => {
    const buttons = document.querySelectorAll('button:not([disabled])');
    if (buttons.length === 0) return;

    const btn = buttons[Math.floor(Math.random() * buttons.length)];
    const btnId = `ghost-${Date.now()}-${Math.random()}`;

    saveOriginalState(btn, 'style.opacity', btnId);
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
      restoreOriginalState(btnId);
      btn.style.pointerEvents = '';
    }, 4000);
  };

  /**
   * Gremlin: FROZEN_INPUT
   * Torna um input read-only temporariamente
   */
  const attackFrozenInput = () => {
    const inputs = document.querySelectorAll('input:not([readonly]):not([disabled])');
    if (inputs.length === 0) return;

    const input = inputs[Math.floor(Math.random() * inputs.length)];
    const inputId = `frozen-${Date.now()}-${Math.random()}`;

    saveOriginalState(input, 'readOnly', inputId);
    saveOriginalState(input, 'style.backgroundColor', `${inputId}-bg`);

    input.readOnly = true;
    input.style.backgroundColor = '#f0f0f0';
    input.style.cursor = 'not-allowed';

    setTimeout(() => {
      restoreOriginalState(inputId);
      restoreOriginalState(`${inputId}-bg`);
      input.style.cursor = '';
    }, 5000);
  };

  /**
   * Gremlin: MATH_ERROR
   * Altera valores monetários na tabela para simular erro de cálculo
   */
  const attackMathError = () => {
    // Busca células de valor na tabela
    const amountCells = document.querySelectorAll('[data-testid^="cell-amount-"]');
    if (amountCells.length === 0) return;

    const cell = amountCells[Math.floor(Math.random() * amountCells.length)];
    const cellId = `math-${Date.now()}-${Math.random()}`;

    saveOriginalState(cell, 'innerText', cellId);

    const originalText = cell.innerText;
    cell.innerText = 'NaN';
    cell.style.color = '#ef4444';
    cell.style.fontWeight = 'bold';

    setTimeout(() => {
      restoreOriginalState(cellId);
      cell.style.color = '';
      cell.style.fontWeight = '';
    }, 4000);
  };

  /**
   * Gremlin: INVISIBLE_OVERLAY
   * Cria uma div transparente que bloqueia cliques
   */
  const attackInvisibleOverlay = () => {
    // Remove overlay existente se houver
    const existing = document.getElementById('gremlin-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'gremlin-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'not-allowed';
    overlay.style.backgroundColor = 'transparent';
    overlay.setAttribute('data-gremlin', 'overlay');

    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
    }, 3000);
  };

  /**
   * Gremlin: DISAPPEARING_TOAST
   * Fecha o toast imediatamente após aparecer
   */
  const attackDisappearingToast = () => {
    const toast = document.querySelector('[data-testid="toast"]');
    if (!toast) return;

    const closeButton = toast.querySelector('[data-testid="toast-close"]');
    if (closeButton) {
      setTimeout(() => {
        closeButton.click();
      }, 500); // Fecha após 500ms
    }
  };

  /**
   * Gremlin: FROZEN_MODAL
   * Impede fechamento do modal temporariamente
   */
  const attackFrozenModal = () => {
    const modal = document.querySelector('[data-testid="modal"]');
    const closeButton = document.querySelector('[data-testid="modal-close"]');
    const overlay = document.querySelector('[data-testid="modal-overlay"]');

    if (!modal || !closeButton) return;

    const closeId = `frozen-close-${Date.now()}`;
    const overlayId = `frozen-overlay-${Date.now()}`;

    // Desabilita botão de fechar
    saveOriginalState(closeButton, 'style.pointerEvents', closeId);
    closeButton.style.pointerEvents = 'none';
    closeButton.style.opacity = '0.5';

    // Desabilita clique no overlay
    if (overlay) {
      saveOriginalState(overlay, 'style.pointerEvents', overlayId);
      overlay.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      restoreOriginalState(closeId);
      if (overlay) restoreOriginalState(overlayId);
      closeButton.style.opacity = '';
    }, 4000);
  };

  /**
   * Gremlin: RANDOM_DELAY
   * Adiciona delay extra em operações (simula lentidão de rede)
   */
  const attackRandomDelay = () => {
    // Este gremlin é mais sutil - apenas loga
    // O delay real já existe na API simulation
    console.warn('⚠️ Gremlin RANDOM_DELAY: Simulando lentidão de rede...');
  };

  /**
   * Executa um ataque de gremlin
   */
  const executeAttack = () => {
    if (!active || enabledGremlins.length === 0) return;

    // Verifica chance de ataque
    if (Math.random() > attackChance) return;

    // Seleciona gremlin aleatório
    const chosenGremlin = enabledGremlins[
      Math.floor(Math.random() * enabledGremlins.length)
    ];

    console.log(`😈 GREMLIN ATACOU: ${chosenGremlin}`, {
      timestamp: new Date().toISOString(),
      enabledGremlins: enabledGremlins.length,
    });

    // Executa ataque
    try {
      switch (chosenGremlin) {
        case GREMLIN_TYPES.GHOST_BUTTON:
          attackGhostButton();
          break;
        case GREMLIN_TYPES.FROZEN_INPUT:
          attackFrozenInput();
          break;
        case GREMLIN_TYPES.MATH_ERROR:
          attackMathError();
          break;
        case GREMLIN_TYPES.INVISIBLE_OVERLAY:
          attackInvisibleOverlay();
          break;
        case GREMLIN_TYPES.DISAPPEARING_TOAST:
          attackDisappearingToast();
          break;
        case GREMLIN_TYPES.FROZEN_MODAL:
          attackFrozenModal();
          break;
        case GREMLIN_TYPES.RANDOM_DELAY:
          attackRandomDelay();
          break;
        default:
          console.warn(`Gremlin desconhecido: ${chosenGremlin}`);
      }

      // Callback opcional
      if (onGremlinAttack) {
        onGremlinAttack(chosenGremlin);
      }
    } catch (error) {
      console.error('❌ Erro ao executar gremlin:', error);
    }
  };

  useEffect(() => {
    if (!active) {
      // Limpa gremlins ao desativar
      clearAllGremlins();
      return;
    }

    // Inicia intervalo de ataques
    intervalRef.current = setInterval(executeAttack, attackInterval);

    // Limpa ao desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearAllGremlins();
    };
  }, [active, attackInterval, attackChance, enabledGremlins.join(',')]);

  // Retorna função para limpar gremlins manualmente
  return clearAllGremlins;
};

