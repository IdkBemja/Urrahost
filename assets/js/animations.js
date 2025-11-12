/**
 * Urra Hosting - Animations & Interactions
 * Modern JavaScript animations with Intersection Observer
 */

// ==================== Scroll Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, delay);
        }
    });
}, observerOptions);

// Observe all elements with data-animate attribute
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach((el) => observer.observe(el));
});

// ==================== Navbar Scroll Effect ====================
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ==================== Mobile Navigation Toggle ====================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ==================== Active Navigation Link ====================
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ==================== Smooth Scroll ====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#"
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
        }
    });
});

// ==================== Service Cards Hover Effect ====================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(-10px) scale(1)';
    });
});

// ==================== Contact Buttons with WhatsApp ====================
const contactTriggers = document.querySelectorAll('.contact-trigger');

contactTriggers.forEach((button) => {
    button.addEventListener('click', function (e) {
        e.preventDefault();

        const service = this.dataset.service;
        let message = '';

        // Validación: verificar que el servicio existe
        if (!service) {
            console.error('Error: No se especificó un servicio');
            return;
        }

        switch (service) {
            case 'web':
                message =
                    'Hola! Me interesa el plan de Alojamiento Web. ¿Podrían darme más información?';
                break;
            case 'db':
                message =
                    'Hola! Me interesa el plan de Base de Datos. ¿Podrían darme más información?';
                break;
            case 'development':
                message =
                    'Hola! Me interesa el servicio de Desarrollo Web. ¿Podrían enviarme una cotización?';
                break;
            default:
                message = 'Hola! Me interesa conocer más sobre sus servicios.';
        }

        // Validación: verificar que el mensaje no esté vacío
        if (!message || message.trim().length === 0) {
            console.error('Error: El mensaje no puede estar vacío');
            return;
        }

        const whatsappNumber = '56937641844';
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';

            // Validación: intentar abrir WhatsApp con manejo de errores
            try {
                window.open(whatsappURL, '_blank');
            } catch (error) {
                console.error('Error al abrir WhatsApp:', error);
                // Fallback: copiar mensaje al portapapeles
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(message).then(() => {
                        alert(
                            'No se pudo abrir WhatsApp. El mensaje se ha copiado al portapapeles.'
                        );
                    });
                }
            }
        }, 150);
    });
});

// ==================== Parallax Effect on landing ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const landingContent = document.querySelector('.landing-content');
    const landingVisual = document.querySelector('.landing-visual');

    if (landingContent && scrolled < window.innerHeight) {
        landingContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        landingContent.style.opacity = 1 - scrolled / 500;
    }

    if (landingVisual && scrolled < window.innerHeight) {
        landingVisual.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});

// ==================== Floating Shapes Animation ====================
const shapes = document.querySelectorAll('.shape');

function animateShapes() {
    shapes.forEach((shape, index) => {
        const speed = 0.001 + index * 0.0005;
        const currentTransform = shape.style.transform || 'translate(0, 0) rotate(0deg)';

        // Get scroll position
        const scroll = window.pageYOffset * speed;

        // Update position based on scroll
        shape.style.transform = `translate(${Math.sin(scroll) * 20}px, ${
            Math.cos(scroll) * 20
        }px) rotate(${scroll * 10}deg)`;
    });

    requestAnimationFrame(animateShapes);
}

animateShapes();

// ==================== Number Counter Animation ====================
const stats = document.querySelectorAll('.stat-number');

const countUp = (element, target) => {
    let count = 0;
    const increment = target / 50;

    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(count);
        }
    }, 30);
};

const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target.textContent;
                // Only animate if it's a number
                if (!isNaN(target)) {
                    countUp(entry.target, parseInt(target));
                }
                statsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

stats.forEach((stat) => {
    if (stat.textContent && !isNaN(stat.textContent.replace(/[^0-9]/g, ''))) {
        statsObserver.observe(stat);
    }
});

// ==================== Visual Cards Animation ====================
const visualCards = document.querySelectorAll('.visual-card');

visualCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.3}s`;
});

// ==================== Loading Animation ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ==================== Scroll Indicator Click ====================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ==================== Tilt Effect on Service Cards ====================
serviceCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Limitar el área de efecto tilt (solo en el centro de la tarjeta)
        const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDistance = Math.min(rect.width, rect.height) / 2;

        // Solo aplicar tilt si el mouse está cerca del centro
        if (distanceFromCenter < maxDistance * 0.8) {
            const rotateX = (y - centerY) / 30; // Reducido de 20 a 30
            const rotateY = (centerX - x) / 30; // Reducido de 20 a 30

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        } else {
            // Reducir gradualmente el efecto en los bordes
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});
