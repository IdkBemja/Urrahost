/* 
 * detect-browser.js
 * Detecta el tipo de dispositivo (móvil o PC) y adapta la interfaz según corresponda:
 * - Muestra/oculta las hojas de estilos apropiadas usando media queries
 * - Añade/elimina el botón de menú móvil dinámicamente
 * - Configura la interacción para el menú móvil
 */

document.addEventListener('DOMContentLoaded', function() {
    function isMobileDevice() {
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return mobileRegex.test(navigator.userAgent) || window.innerWidth < 1024;
    }

    function loadAppropriateStylesheet() {
        try {
            const isMobile = isMobileDevice();
            const head = document.getElementsByTagName('head')[0];
            
            if (!head) {
                throw new Error('Head element not found');
            }
            
            // Buscar hojas de estilo existentes
            let mobileStylesheet = document.querySelector('link[href*="mobile-app"]');
            let desktopStylesheet = document.querySelector('link[href*="app"]:not([href*="mobile"])');
            
            // Crear mobile stylesheet minificado si no existe
            if (!mobileStylesheet) {
                mobileStylesheet = document.createElement('link');
                mobileStylesheet.rel = 'stylesheet';
                mobileStylesheet.href = 'assets/css/mobile-app.min.css';
                mobileStylesheet.media = '(max-width: 1023px)';
                mobileStylesheet.onerror = function() {
                    console.error('[ERROR] Failed to load mobile CSS - Critical error');
                    if (window.ErrorHandler) {
                        window.ErrorHandler.logError('CSS Critical', { file: 'mobile-app.min.css' });
                    }
                };
                head.appendChild(mobileStylesheet);
            }
            
            // Crear desktop stylesheet minificado si no existe
            if (!desktopStylesheet) {
                desktopStylesheet = document.createElement('link');
                desktopStylesheet.rel = 'stylesheet';
                desktopStylesheet.href = 'assets/css/app.min.css';
                desktopStylesheet.media = '(min-width: 1024px)';
                desktopStylesheet.onerror = function() {
                    console.error('[ERROR] Failed to load desktop CSS - Critical error');
                    if (window.ErrorHandler) {
                        window.ErrorHandler.logError('CSS Critical', { file: 'app.min.css' });
                    }
                };
                head.appendChild(desktopStylesheet);
            }
            
            // Configurar clases y menú según el dispositivo
            if (isMobile) {
                document.body.classList.add('mobile-device');
                document.body.classList.remove('desktop-device');
                setupMobileMenu();
            } else {
                document.body.classList.add('desktop-device');
                document.body.classList.remove('mobile-device');
                removeMobileMenu();
            }
            
            console.log(`[SUCCESS] CSS loaded successfully: ${isMobile ? 'Mobile' : 'Desktop'} mode`);
        } catch (error) {
            console.error('[ERROR] Error in loadAppropriateStylesheet:', error);
            // Fallback: Load basic CSS
            if (window.ErrorHandler) {
                window.ErrorHandler.logError('CSS Loading Error', {
                    error: error.message,
                    stack: error.stack
                });
            }
        }
    }
    
    function setupMobileMenu() {
        const navbar = document.querySelector('.navbar');
        const navContainer = document.querySelector('.nav-container');
        let navToggle = document.querySelector('.nav-toggle');
        let navMenu = document.querySelector('.nav-menu');
        
        // Si no existe el botón en el HTML, crearlo
        if (!navToggle) {
            navToggle = document.createElement('button');
            navToggle.className = 'nav-toggle';
            navToggle.id = 'navToggle';
            navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.innerHTML = `
                <span class="nav-toggle-line"></span>
                <span class="nav-toggle-line"></span>
                <span class="nav-toggle-line"></span>
            `;
            
            const navBrand = document.querySelector('.nav-brand');
            if (navBrand && navContainer) {
                navBrand.parentNode.insertBefore(navToggle, navBrand.nextSibling);
            }
        }
        
        // Asegurar que el toggle sea visible
        navToggle.style.display = 'flex';
        
        if (navMenu) {
            // Remover listeners previos clonando el elemento
            const newNavToggle = navToggle.cloneNode(true);
            navToggle.parentNode.replaceChild(newNavToggle, navToggle);
            navToggle = newNavToggle;
            
            navMenu.classList.remove('active');
            
            // Event listener para el toggle
            navToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                // Actualizar aria-expanded
                navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            });
            
            // Cerrar menú al hacer click en un link
            const navLinks = navMenu.querySelectorAll('.nav-link, .nav-btn');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });
            
            // Cerrar menú al hacer click fuera
            document.addEventListener('click', function(e) {
                if (navMenu.classList.contains('active') && 
                    !navMenu.contains(e.target) && 
                    !navToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    
    
    function removeMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            // Ocultar en lugar de eliminar (por si está en el HTML)
            navToggle.style.display = 'none';
            navToggle.classList.remove('active');
        }
        
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        
        document.body.classList.remove('menu-open');
    }
    
    // Inicializar
    loadAppropriateStylesheet();
    
    // Reinicializar en resize (con debounce)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            loadAppropriateStylesheet();
        }, 250);
    });
});