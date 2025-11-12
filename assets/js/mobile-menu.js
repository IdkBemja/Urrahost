/**
 * mobile-menu.js
 * Script para manejar el menú móvil
 * Urra Hosting - 2025
 */

<<<<<<< Updated upstream
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
=======
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');

    // Toggle menu móvil
    if (navToggle && navMenu) {
        // Ajustar posición del menú basado en altura del navbar
        if (navbar && window.innerWidth <= 768) {
            const navbarHeight = navbar.offsetHeight;
            navMenu.style.top = navbarHeight + 'px';
        }

        navToggle.addEventListener('click', function (e) {
            // Toggle clase active en el botón y el menú
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);

            // Prevenir scroll cuando el menú está abierto
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
>>>>>>> Stashed changes
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