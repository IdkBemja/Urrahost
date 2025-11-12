/**
 * Service Worker Registration - Urra Hosting
 * Registers and manages service worker lifecycle
 */

(function() {
    'use strict';

    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
        console.warn('⚠️ Service Workers not supported in this browser');
        return;
    }

    const SWManager = {
        registration: null,

        // Initialize and register service worker
        async init() {
            try {
                // Register service worker
                this.registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });

                console.log('✅ Service Worker registered:', this.registration.scope);

                // Check for updates
                this.registration.addEventListener('updatefound', () => {
                    const newWorker = this.registration.installing;
                    console.log('🔄 New Service Worker found, installing...');

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available
                            this.showUpdateNotification();
                        }
                    });
                });

                // Listen for controller change
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('🔄 Service Worker controller changed');
                    window.location.reload();
                });

                // Check for updates periodically (every hour)
                setInterval(() => {
                    this.registration.update();
                }, 1000 * 60 * 60);

            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        },

        // Show update notification
        showUpdateNotification() {
            console.log('📢 New version available');

            // Create notification banner
            const banner = document.createElement('div');
            banner.className = 'sw-update-banner';
            banner.innerHTML = `
                <div class="sw-update-content">
                    <span>✨ Nueva versión disponible</span>
                    <button class="sw-update-button" onclick="SWManager.applyUpdate()">Actualizar</button>
                    <button class="sw-dismiss-button" onclick="this.parentElement.parentElement.remove()">✕</button>
                </div>
            `;

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .sw-update-banner {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--primary, #f97316);
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from {
                        transform: translateX(-50%) translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }

                .sw-update-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .sw-update-button {
                    background: white;
                    color: var(--primary, #f97316);
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.25rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .sw-update-button:hover {
                    transform: scale(1.05);
                }

                .sw-dismiss-button {
                    background: transparent;
                    color: white;
                    border: none;
                    padding: 0.5rem;
                    cursor: pointer;
                    font-size: 1.2rem;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }

                .sw-dismiss-button:hover {
                    opacity: 1;
                }

                @media (max-width: 768px) {
                    .sw-update-banner {
                        left: 1rem;
                        right: 1rem;
                        transform: translateX(0);
                    }

                    @keyframes slideUp {
                        from {
                            transform: translateY(100px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(banner);
        },

        // Apply update
        applyUpdate() {
            if (this.registration && this.registration.waiting) {
                // Send skip waiting message
                this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
        },

        // Clear cache
        async clearCache() {
            if (this.registration) {
                this.registration.active.postMessage({ type: 'CLEAR_CACHE' });
                console.log('🧹 Cache cleared');
            }
        },

        // Unregister service worker
        async unregister() {
            if (this.registration) {
                await this.registration.unregister();
                console.log('✅ Service Worker unregistered');
            }
        }
    };

    // Expose SWManager globally
    window.SWManager = SWManager;

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SWManager.init());
    } else {
        SWManager.init();
    }

    // Debug commands (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.debugSW = {
            update: () => SWManager.registration?.update(),
            unregister: () => SWManager.unregister(),
            clearCache: () => SWManager.clearCache(),
            info: () => SWManager.registration
        };
        console.log('🔧 SW Debug commands: debugSW.update(), debugSW.unregister(), debugSW.clearCache(), debugSW.info()');
    }

})();
