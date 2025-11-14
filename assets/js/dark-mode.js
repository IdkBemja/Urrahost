/**
 * DARK MODE TOGGLE
 * Maneja el cambio entre modo claro y oscuro
 * Persistencia en localStorage
 * Respeta preferencias del sistema
 */

(function() {
    'use strict';
    
    const STORAGE_KEY = 'urrahosting-theme';
    
    /**
     * Obtiene la preferencia del sistema
     */
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    /**
     * Obtiene la preferencia guardada o del sistema
     */
    function getSavedTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        return savedTheme || getSystemTheme();
    }
    
    /**
     * Aplica el tema al documento
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color para mobile
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content', 
                theme === 'dark' ? '#0a0e1a' : '#f97316'
            );
        }
        
        // Actualizar navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.transition = 'all 0.3s ease';
        }
    }
    
    /**
     * Guarda la preferencia en localStorage
     */
    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // Failed to save theme preference
        }
    }
    
    /**
     * Toggle entre temas
     */
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        saveTheme(newTheme);
        
        // Feedback háptico en móviles (si está disponible)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Actualizar aria-label
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.setAttribute(
                'aria-label',
                `Cambiar a tema ${newTheme === 'dark' ? 'claro' : 'oscuro'}`
            );
        }
    }
    
    /**
     * Inicialización
     */
    function init() {
        // Aplicar tema guardado inmediatamente (antes de DOMContentLoaded)
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupToggleButton);
        } else {
            setupToggleButton();
        }
        
        // Marcar que el tema está cargado (evitar flash)
        setTimeout(() => {
            document.body.classList.add('theme-loaded');
        }, 50);
    }
    
    /**
     * Configurar el botón de toggle
     */
    function setupToggleButton() {
        const toggleButton = document.getElementById('theme-toggle');
        
        if (!toggleButton) {
            console.warn('Botón de theme toggle no encontrado');
            return;
        }
        
        // Event listener para click
        toggleButton.addEventListener('click', toggleTheme);
        
        // Event listener para teclado (accesibilidad)
        toggleButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
        
        // Actualizar aria-label inicial
        const currentTheme = document.documentElement.getAttribute('data-theme');
        toggleButton.setAttribute(
            'aria-label',
            `Cambiar a tema ${currentTheme === 'dark' ? 'claro' : 'oscuro'}`
        );
    }
    
    /**
     * Escuchar cambios en preferencias del sistema
     */
    function watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Listener para cambios (solo si no hay preferencia guardada)
        mediaQuery.addEventListener('change', function(e) {
            // Solo aplicar si no hay preferencia manual guardada
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // Inicializar inmediatamente
    init();
    
    // Watch system theme changes
    watchSystemTheme();
    
    // Exponer función global para debug
    window.themeManager = {
        toggle: toggleTheme,
        set: function(theme) {
            if (theme === 'dark' || theme === 'light') {
                applyTheme(theme);
                saveTheme(theme);
            }
        },
        get: function() {
            return document.documentElement.getAttribute('data-theme');
        },
        reset: function() {
            localStorage.removeItem(STORAGE_KEY);
            applyTheme(getSystemTheme());
        }
    };
    
})();
