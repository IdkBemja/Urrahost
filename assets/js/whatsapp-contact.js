/* 
 * whatsapp-contact.js
 * Gestiona las redirecciones a WhatsApp con mensajes predefinidos según el servicio.
 */

document.addEventListener('DOMContentLoaded', function() {
    const whatsappNumber = '56937641844';
    
    const messages = {
        'contact-web': 'Hola, estoy interesado en conocer más sobre el servicio de Alojamiento Web. ¿Podrían proporcionarme más información?',
        'contact-db': 'Hola, me gustaría recibir información sobre el servicio de Alojamiento de Base de Datos. ¿Podrían ayudarme?',
        'contact-development': 'Hola, estoy interesado en el servicio de Desarrollo Web. Quisiera discutir un proyecto y recibir más información.'
    };
    
    function redirectToWhatsApp(buttonId) {
        const message = encodeURIComponent(messages[buttonId] || 'Hola, me gustaría recibir información sobre sus servicios.');
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }
    
    Object.keys(messages).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                redirectToWhatsApp(buttonId);
            });
        }
    });
});