/**
 * mobile-menu.js
 * Script para manejar el menú móvil
 * Urra Hosting - 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const toggleMenu = document.getElementById('toggleMenu');
    const mainNav = document.getElementById('mainNav');
    
    // Verificar si estamos en un dispositivo móvil
    const isMobile = document.body.classList.contains('mobile-device');
    
    // Si es un dispositivo móvil, inicializar el menú como colapsado
    if (isMobile) {
        mainNav.classList.add('nav-collapsed');
        
        // Función para alternar la visibilidad del menú
        toggleMenu.addEventListener('click', function() {
            mainNav.classList.toggle('nav-collapsed');
            
            // Cambiar el icono del botón
            const icon = toggleMenu.querySelector('i');
            if (mainNav.classList.contains('nav-collapsed')) {
                icon.classList.remove('bi-x-lg');
                icon.classList.add('bi-list');
            } else {
                icon.classList.remove('bi-list');
                icon.classList.add('bi-x-lg');
            }
        });
        
        // Cerrar el menú cuando se hace click en un enlace del menú
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
});