const display = document.getElementById('display');
const buttons = document.querySelectorAll('.button-grid button');
const displayContainer = document.querySelector('.display-container');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Panel Avanzado
const menuToggle = document.getElementById('menu-toggle');
const advancedPanel = document.getElementById('advanced-panel');
const closePanel = document.getElementById('close-panel');

// sonidos y Hapticos
const soundToggle = document.getElementById('sound-toggle');
let soundEnabled = true;
let hapticEnabled = true;

// Memoria
const memoryClear = document.getElementById('memory-clear');
const memoryRecall = document.getElementById('memory-recall');
const memoryAdd = document.getElementById('memory-add');
const memorySubtract = document.getElementById('memory-subtract');
const memoryIndicator = document.getElementById('memory-indicator');
let memory = 0;

// Historial
const clearHistory = document.getElementById('clear-history');
const exportHistory = document.getElementById('export-history');
const historyList = document.getElementById('history-list');
let calculationHistory = [];

// Statistics
const operationCount = document.getElementById('operation-count');
const mostUsed = document.getElementById('most-used');
let operationStats = {};

// Utilities
const copyResult = document.getElementById('copy-result');
const pasteValue = document.getElementById('paste-value');
const showShortcuts = document.getElementById('show-shortcuts');

// Modal
const shortcutsModal = document.getElementById('shortcuts-modal');
const closeShortcuts = document.getElementById('close-shortcuts');

// Scientific functions
const sciButtons = document.querySelectorAll('.sci-btn');

// Mapa de operadores visuales y sus equivalentes internos
const operatorMap = {
    '/': '÷',
    '*': '×'
};

// Función para agregar efecto visual al display
function addDisplayEffect() {
    displayContainer.classList.add('calculating');
    setTimeout(() => {
        displayContainer.classList.remove('calculating');
    }, 500);
}

// Función para formatear números grandes
function formatNumber(num) {
    if (num.toString().length > 12) {
        return parseFloat(num).toExponential(6);
    }
    return num;
}

// Función para validar entrada
function isValidInput(value) {
    const lastChar = display.value.slice(-1);
    const operators = ['+', '-', '×', '÷', '%'];

    // No permitir múltiples operadores consecutivos
    if (operators.includes(lastChar) && operators.includes(value)) {
        return false;
    }

    // No permitir múltiples puntos decimales
    if (value === '.' && display.value.includes('.')) {
        return false;
    }

    return true;
}

// Event listeners for calculator buttons (removed duplicate section)

// ===== THEME MANAGEMENT =====
// Función para inicializar el tema
function initializeTheme() {
    const savedTheme = localStorage.getItem('calculator-theme') || 'light';
    setTheme(savedTheme);
}

// Función para cambiar el tema
function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('calculator-theme', theme);

    // Actualizar icono
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
}

// Función para alternar tema
function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Event listener para el botón de tema
themeToggle.addEventListener('click', toggleTheme);

// Inicializar tema al cargar la página
document.addEventListener('DOMContentLoaded', initializeTheme);

// ===== ADVANCED PANEL FUNCTIONALITY =====

// Panel Toggle
menuToggle.addEventListener('click', () => {
    advancedPanel.classList.toggle('open');
    playSound('click');
    hapticFeedback();
});

closePanel.addEventListener('click', () => {
    advancedPanel.classList.remove('open');
    playSound('click');
    hapticFeedback();
});

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    if (!advancedPanel.contains(e.target) && !menuToggle.contains(e.target)) {
        advancedPanel.classList.remove('open');
    }
});

// ===== SOUND AND HAPTIC FEEDBACK =====

// Sound Effects
function playSound(type) {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
        case 'click':
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'calculate':
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'error':
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
    }
}

// Haptic Feedback
function hapticFeedback() {
    if (!hapticEnabled || !navigator.vibrate) return;
    navigator.vibrate(50);
}

// Sound Toggle
soundToggle.addEventListener('change', (e) => {
    soundEnabled = e.target.checked;
    localStorage.setItem('calculator-sound', soundEnabled);
    playSound('click');
});

// ===== MEMORY FUNCTIONS =====

memoryClear.addEventListener('click', () => {
    memory = 0;
    updateMemoryIndicator();
    playSound('click');
    hapticFeedback();
});

memoryRecall.addEventListener('click', () => {
    if (memory !== 0) {
        display.value = memory.toString();
        playSound('click');
        hapticFeedback();
    }
});

memoryAdd.addEventListener('click', () => {
    const currentValue = parseFloat(display.value) || 0;
    memory += currentValue;
    updateMemoryIndicator();
    playSound('click');
    hapticFeedback();
});

memorySubtract.addEventListener('click', () => {
    const currentValue = parseFloat(display.value) || 0;
    memory -= currentValue;
    updateMemoryIndicator();
    playSound('click');
    hapticFeedback();
});

function updateMemoryIndicator() {
    if (memory !== 0) {
        memoryIndicator.innerHTML = `<i class="fas fa-circle"></i> Memoria: ${memory}`;
        memoryIndicator.classList.add('has-memory');
    } else {
        memoryIndicator.innerHTML = `<i class="fas fa-circle"></i> Sin memoria`;
        memoryIndicator.classList.remove('has-memory');
    }
}

// ===== CALCULATION HISTORY =====

function addToHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().toLocaleTimeString()
    };

    calculationHistory.unshift(historyItem);

    // Keep only last 50 calculations
    if (calculationHistory.length > 50) {
        calculationHistory = calculationHistory.slice(0, 50);
    }

    updateHistoryDisplay();
    updateStatistics();
}

function updateHistoryDisplay() {
    if (calculationHistory.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                <i class="fas fa-clock"></i>
                <p>No hay cálculos recientes</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = calculationHistory.map(item => `
        <div class="history-item" onclick="useHistoryItem('${item.expression}', '${item.result}')">
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">= ${item.result}</div>
        </div>
    `).join('');
}

function useHistoryItem(expression, result) {
    display.value = result;
    playSound('click');
    hapticFeedback();
}

clearHistory.addEventListener('click', () => {
    calculationHistory = [];
    updateHistoryDisplay();
    updateStatistics();
    playSound('click');
    hapticFeedback();
});

exportHistory.addEventListener('click', () => {
    if (calculationHistory.length === 0) return;

    const csvContent = "Expression,Result,Timestamp\n" +
        calculationHistory.map(item => `"${item.expression}","${item.result}","${item.timestamp}"`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculadora-historial-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    playSound('click');
    hapticFeedback();
});

// ===== STATISTICS =====

function updateStatistics() {
    operationCount.textContent = calculationHistory.length;

    if (calculationHistory.length > 0) {
        const operators = calculationHistory.map(item => {
            const expr = item.expression;
            if (expr.includes('+')) return '+';
            if (expr.includes('-')) return '-';
            if (expr.includes('×')) return '×';
            if (expr.includes('÷')) return '÷';
            return 'number';
        });

        const operatorCounts = operators.reduce((acc, op) => {
            acc[op] = (acc[op] || 0) + 1;
            return acc;
        }, {});

        const mostUsedOperator = Object.keys(operatorCounts).reduce((a, b) =>
            operatorCounts[a] > operatorCounts[b] ? a : b
        );

        mostUsed.textContent = mostUsedOperator;
    } else {
        mostUsed.textContent = '-';
    }
}

// ===== UTILITY FUNCTIONS =====

copyResult.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(display.value);
        showNotification('Resultado copiado al portapapeles');
        playSound('click');
        hapticFeedback();
    } catch (err) {
        console.error('Error copying to clipboard:', err);
    }
});

pasteValue.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        if (!isNaN(text)) {
            display.value = text;
            playSound('click');
            hapticFeedback();
        }
    } catch (err) {
        console.error('Error reading from clipboard:', err);
    }
});

showShortcuts.addEventListener('click', () => {
    shortcutsModal.classList.add('open');
    playSound('click');
    hapticFeedback();
});

// ===== SCIENTIFIC FUNCTIONS =====

sciButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const functionName = btn.getAttribute('data-function');
        const currentValue = parseFloat(display.value) || 0;
        let result;

        try {
            switch (functionName) {
                case 'sin':
                    result = Math.sin(currentValue * Math.PI / 180);
                    break;
                case 'cos':
                    result = Math.cos(currentValue * Math.PI / 180);
                    break;
                case 'tan':
                    result = Math.tan(currentValue * Math.PI / 180);
                    break;
                case 'log':
                    result = Math.log10(currentValue);
                    break;
                case 'ln':
                    result = Math.log(currentValue);
                    break;
                case 'sqrt':
                    result = Math.sqrt(currentValue);
                    break;
                case 'square':
                    result = currentValue * currentValue;
                    break;
                case 'pi':
                    result = Math.PI;
                    break;
                case 'e':
                    result = Math.E;
                    break;
                case 'factorial':
                    result = factorial(currentValue);
                    break;
            }

            if (isNaN(result) || !isFinite(result)) {
                display.value = 'Error';
                playSound('error');
            } else {
                display.value = formatNumber(result);
                playSound('calculate');
            }

            hapticFeedback();
        } catch (error) {
            display.value = 'Error';
            playSound('error');
            hapticFeedback();
        }
    });
});

function factorial(n) {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// ===== MODAL FUNCTIONALITY =====

closeShortcuts.addEventListener('click', () => {
    shortcutsModal.classList.remove('open');
    playSound('click');
    hapticFeedback();
});

// Close modal when clicking outside
shortcutsModal.addEventListener('click', (e) => {
    if (e.target === shortcutsModal) {
        shortcutsModal.classList.remove('open');
    }
});

// ===== NOTIFICATION SYSTEM =====

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== ENHANCED CALCULATOR LOGIC =====

// Override the original calculation logic to include history and statistics
const originalCalculate = buttons.forEach;
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value') || btn.textContent;

        // Efecto visual del botón
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);

        if (btn.id === 'ac') {
            display.value = '';
            display.placeholder = '0';
            playSound('click');
            hapticFeedback();
        } else if (btn.id === 'de') {
            if (display.value.length > 0) {
                display.value = display.value.slice(0, -1);
                if (display.value === '') {
                    display.placeholder = '0';
                }
            }
            playSound('click');
            hapticFeedback();
        } else if (btn.id === '=') {
            if (display.value === '') return;

            addDisplayEffect();

            const originalExpression = display.value;

            // Reemplaza los símbolos visuales por operadores internos
            let expr = display.value
                .replace(/÷/g, '/')
                .replace(/×/g, '*');

            try {
                const result = eval(expr);
                if (isNaN(result) || !isFinite(result)) {
                    display.value = 'Error';
                    playSound('error');
                } else {
                    display.value = formatNumber(result);
                    addToHistory(originalExpression, result);
                    playSound('calculate');
                }
            } catch {
                display.value = 'Error';
                playSound('error');
            }
            hapticFeedback();
        } else {
            // Validar entrada antes de agregar
            if (isValidInput(value)) {
                if (display.value === '0' && !['.', '+', '-', '×', '÷', '%'].includes(value)) {
                    display.value = value;
                } else {
                    // Convertir símbolos internos a símbolos visuales
                    let displayValue = value;
                    if (value === '/') displayValue = '÷';
                    if (value === '*') displayValue = '×';
                    display.value += displayValue;
                }
                playSound('click');
                hapticFeedback();
            }
        }
    });
});

// ===== KEYBOARD SUPPORT =====
// Soporte para teclado
document.addEventListener('keydown', (e) => {
    const key = e.key;
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.', '=', 'Enter', 'Escape', 'Backspace'];

    if (!allowedKeys.includes(key)) return;

    e.preventDefault();

    if (key === 'Enter' || key === '=') {
        document.getElementById('=').click();
    } else if (key === 'Escape') {
        document.getElementById('ac').click();
    } else if (key === 'Backspace') {
        document.getElementById('de').click();
    } else {
        const button = Array.from(buttons).find(btn =>
            btn.getAttribute('data-value') === key ||
            btn.textContent === key
        );
        if (button) button.click();
    }
});

// ===== INITIALIZATION =====

// Initialize settings from localStorage
document.addEventListener('DOMContentLoaded', () => {
    // Load sound preference
    const savedSound = localStorage.getItem('calculator-sound');
    if (savedSound !== null) {
        soundEnabled = savedSound === 'true';
        soundToggle.checked = soundEnabled;
    }

    // Load memory
    const savedMemory = localStorage.getItem('calculator-memory');
    if (savedMemory !== null) {
        memory = parseFloat(savedMemory);
        updateMemoryIndicator();
    }

    // Load history
    const savedHistory = localStorage.getItem('calculator-history');
    if (savedHistory !== null) {
        calculationHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
        updateStatistics();
    }
});

// Save settings to localStorage
window.addEventListener('beforeunload', () => {
    localStorage.setItem('calculator-memory', memory);
    localStorage.setItem('calculator-history', JSON.stringify(calculationHistory));
});
