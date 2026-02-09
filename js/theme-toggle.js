// =============================
// SISTEMA DE TOGGLE DE TEMA (CLARO/ESCURO)
// =============================

(function() {
    'use strict';

    const THEME_KEY = 'ronaldhonda-theme';
    const DARK_CLASS = 'dark-theme';
    const LIGHT_CLASS = 'light-theme';

    // =============================
    // FUNÇÕES PRINCIPAIS
    // =============================

    /**
     * Obtém a preferência de tema do sistema operacional
     */
    function getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Obtém o tema salvo no localStorage ou a preferência do sistema
     */
    function getSavedTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) {
            return saved;
        }
        // Por padrão, usar tema escuro para que o site carregue todo escuro
        return 'dark';
    }

    /**
     * Salva o tema no localStorage
     */
    function saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }

    /**
     * Aplica o tema ao documento
     */
    function applyTheme(theme) {
        const body = document.body;
        
        if (theme === 'dark') {
            body.classList.remove(LIGHT_CLASS);
            body.classList.add(DARK_CLASS);
            body.setAttribute('data-theme', 'dark');
        } else {
            body.classList.remove(DARK_CLASS);
            body.classList.add(LIGHT_CLASS);
            body.setAttribute('data-theme', 'light');
        }

        // Atualiza o ícone do botão de toggle
        updateToggleButton(theme);
    }

    /**
     * Atualiza o ícone do botão de toggle
     */
    function updateToggleButton(theme) {
        const toggleBtn = document.getElementById('themeToggle');
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('.theme-icon');
        const text = toggleBtn.querySelector('.theme-text');

        if (icon) {
            if (theme === 'dark') {
                icon.innerHTML = '☀️';
                icon.setAttribute('aria-label', 'Modo claro');
            } else {
                icon.innerHTML = '🌙';
                icon.setAttribute('aria-label', 'Modo escuro');
            }
        }

        if (text) {
            text.textContent = theme === 'dark' ? 'Claro' : 'Escuro';
        }

        toggleBtn.setAttribute('aria-pressed', theme === 'dark');
    }

    /**
     * Alterna entre os temas
     */
    function toggleTheme() {
        const currentTheme = document.body.classList.contains(DARK_CLASS) ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        saveTheme(newTheme);
    }

    /**
     * Cria e insere o botão de toggle no DOM
     */
    function createToggleButton() {
        // Verifica se o botão já existe
        if (document.getElementById('themeToggle')) return;

        const button = document.createElement('button');
        button.id = 'themeToggle';
        button.className = 'theme-toggle-btn';
        button.setAttribute('aria-label', 'Alternar tema');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('title', 'Alternar tema claro/escuro');
        
        button.innerHTML = `
            <span class="theme-icon" aria-hidden="true">🌙</span>
            <span class="theme-text">Escuro</span>
        `;

        button.addEventListener('click', toggleTheme);

        // Insere o botão no body
        document.body.appendChild(button);
    }

    /**
     * Escuta mudanças na preferência do sistema operacional
     */
    function listenToSystemChanges() {
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Só aplica se não houver preferência salva
                if (!localStorage.getItem(THEME_KEY)) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    /**
     * Inicializa o sistema de tema
     */
    function init() {
        // Aplica o tema inicial o mais rápido possível para evitar flash
        const theme = getSavedTheme();
        applyTheme(theme);

        // Persiste a preferência padrão se ainda não existir (evita flash em visitas seguintes)
        if (!localStorage.getItem(THEME_KEY)) {
            saveTheme(theme);
        }

        // Quando o DOM estiver pronto, cria o botão
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createToggleButton();
                updateToggleButton(theme);
            });
        } else {
            createToggleButton();
            updateToggleButton(theme);
        }

        // Escuta mudanças do sistema
        listenToSystemChanges();
    }

    // Exporta funções para uso externo se necessário
    window.ThemeToggle = {
        toggle: toggleTheme,
        setTheme: (theme) => {
            applyTheme(theme);
            saveTheme(theme);
        },
        getTheme: () => document.body.classList.contains(DARK_CLASS) ? 'dark' : 'light'
    };

    // Inicializa
    init();

})();
