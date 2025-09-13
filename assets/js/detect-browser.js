/* 
 * detect-browser.js
 * Detecta el tipo de dispositivo (móvil o PC) y adapta la interfaz según corresponda:
 * - Carga la hoja de estilos apropiada
 * - Añade/elimina el botón de menú móvil dinámicamente
 * - Configura la interacción para el menú móvil
 */

document.addEventListener('DOMContentLoaded', function() {
    function isMobileDevice() {
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return mobileRegex.test(navigator.userAgent) || window.innerWidth < 768;
    }

    function loadAppropriateStylesheet() {
        const isMobile = isMobileDevice();
        const head = document.getElementsByTagName('head')[0];
        const existingStylesheets = document.querySelectorAll('link[rel="stylesheet"][href*="app.css"]');
        
        existingStylesheets.forEach(stylesheet => {
            if (stylesheet.getAttribute('href').includes('mobile-app.css') || 
                stylesheet.getAttribute('href').includes('app.css')) {
                head.removeChild(stylesheet);
            }
        });
        
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        
        if (isMobile) {
            linkElement.href = 'assets/css/mobile-app.css';
            document.body.classList.add('mobile-device');
            document.body.classList.remove('desktop-device');
            setupMobileMenu();
        } else {
            linkElement.href = 'assets/css/app.css';
            document.body.classList.add('desktop-device');
            document.body.classList.remove('mobile-device');
            removeMobileMenu();
        }
        
        head.appendChild(linkElement);
    }
    
    function setupMobileMenu() {
        const header = document.querySelector('header');
        const logoContainer = document.querySelector('.logo-container');
        let mobileMenuBtn = document.getElementById('toggleMenu');
        
        if (!mobileMenuBtn) {
            mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-button';
            mobileMenuBtn.id = 'toggleMenu';
            mobileMenuBtn.innerHTML = '<i class="bi bi-list"></i>';
            
            if (logoContainer && logoContainer.nextSibling) {
                header.insertBefore(mobileMenuBtn, logoContainer.nextSibling);
            } else if (logoContainer) {
                header.appendChild(mobileMenuBtn);
            }
            
            setupMobileMenuEvents();
        }
        
        const nav = document.querySelector('header nav');
        if (nav && !nav.id) {
            nav.id = 'mainNav';
        }
        
        const mainNav = document.getElementById('mainNav');
        if (mainNav) {
            mainNav.classList.add('nav-collapsed');
        }
    }
    
    function setupMobileMenuEvents() {
        const toggleMenu = document.getElementById('toggleMenu');
        const mainNav = document.getElementById('mainNav');
        
        if (toggleMenu && mainNav) {
            toggleMenu.addEventListener('click', function() {
                mainNav.classList.toggle('nav-collapsed');
                
                const icon = toggleMenu.querySelector('i');
                if (mainNav.classList.contains('nav-collapsed')) {
                    icon.classList.remove('bi-x-lg');
                    icon.classList.add('bi-list');
                } else {
                    icon.classList.remove('bi-list');
                    icon.classList.add('bi-x-lg');
                }
            });
            
            const navLinks = mainNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mainNav.classList.add('nav-collapsed');
                    const icon = toggleMenu.querySelector('i');
                    icon.classList.remove('bi-x-lg');
                    icon.classList.add('bi-list');
                });
            });
        }
    }
    
    function removeMobileMenu() {
        const mobileMenuBtn = document.getElementById('toggleMenu');
        if (mobileMenuBtn) {
            mobileMenuBtn.parentNode.removeChild(mobileMenuBtn);
        }
        
        const mainNav = document.getElementById('mainNav');
        if (mainNav) {
            mainNav.classList.remove('nav-collapsed');
        }
    }
    
    loadAppropriateStylesheet();
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            loadAppropriateStylesheet();
        }, 250);
    });
});