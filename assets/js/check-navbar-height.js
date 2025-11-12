/**
 * Verificador de altura del navbar
 * Ejecuta este script en la consola del navegador para ver la altura real
 */

(function () {
    const navbar = document.querySelector('.navbar');
    const navContainer = document.querySelector('.nav-container');

    if (navbar && navContainer) {
        const navbarHeight = navbar.offsetHeight;
        const navbarComputedHeight = window.getComputedStyle(navbar).height;
        const containerHeight = navContainer.offsetHeight;

        console.log('📏 ALTURA DEL NAVBAR:');
        console.log('  - Navbar offsetHeight:', navbarHeight + 'px');
        console.log('  - Navbar computed height:', navbarComputedHeight);
        console.log('  - Container height:', containerHeight + 'px');
        console.log('  - Menu top debería ser:', navbarHeight + 'px');

        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            const menuTop = window.getComputedStyle(navMenu).top;
            console.log('  - Menu top actual:', menuTop);

            if (parseInt(menuTop) !== navbarHeight) {
                console.warn(
                    '⚠️ ADVERTENCIA: El top del menú no coincide con la altura del navbar!'
                );
                console.log('   Cambiar en CSS: top: ' + navbarHeight + 'px;');
            } else {
                console.log('✅ El top del menú está correctamente configurado');
            }
        }

        // Crear alerta visual
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: ${navbarHeight}px;
            left: 50%;
            transform: translateX(-50%);
            background: #4caf50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        alert.textContent = `Altura del navbar: ${navbarHeight}px`;
        document.body.appendChild(alert);

        setTimeout(() => alert.remove(), 3000);
    } else {
        console.error('❌ No se encontró el navbar o nav-container');
    }
})();
