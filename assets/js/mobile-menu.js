/**
 * mobile-menu.js
 * Script para manejar el menú móvil
 * Urra Hosting - 2025
 */

document.addEventListener('DOMContentLoaded', function () {
<<<<<<< Updated upstream
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');

    // Toggle menu móvil
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            // Toggle clase active en el botón y el menú
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);

            // Prevenir scroll cuando el menú está abierto
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
=======
    // Referencias a elementos del DOM
    const toggleMenu = document.getElementById('toggleMenu');
    const mainNav = document.getElementById('mainNav');

    // Verificar si estamos en un dispositivo móvil
    const isMobile = document.body.classList.contains('mobile-device');

    // Si es un dispositivo móvil, inicializar el menú como colapsado
    if (isMobile) {
        mainNav.classList.add('nav-collapsed');

        // Función para alternar la visibilidad del menú
        toggleMenu.addEventListener('click', function () {
            mainNav.classList.toggle('nav-collapsed');

            // Cambiar el icono del botón
            const icon = toggleMenu.querySelector('i');
            if (mainNav.classList.contains('nav-collapsed')) {
                icon.classList.remove('bi-x-lg');
                icon.classList.add('bi-list');
>>>>>>> Stashed changes
            } else {
                document.body.style.overflow = '';
            }
        });

<<<<<<< Updated upstream
        // Cerrar menú al hacer click en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
=======
        // Cerrar el menú cuando se hace click en un enlace del menú
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach((link) => {
            link.addEventListener('click', function () {
                mainNav.classList.add('nav-collapsed');
                const icon = toggleMenu.querySelector('i');
                icon.classList.remove('bi-x-lg');
                icon.classList.add('bi-list');
>>>>>>> Stashed changes
            });
        });

        // Cerrar menú al hacer click fuera de él
        document.addEventListener('click', function (event) {
            if (
                navMenu.classList.contains('active') &&
                !navMenu.contains(event.target) &&
                !navToggle.contains(event.target)
            ) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
<<<<<<< Updated upstream

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    function setActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach((section) => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach((link) => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNav);
=======
>>>>>>> Stashed changes
});
