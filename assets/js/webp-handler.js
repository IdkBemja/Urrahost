/**
 * WebP Image Handler - Urra Hosting
 * Optimización de carga de imágenes con soporte WebP y lazy loading
 */

(function() {
    'use strict';

    const WebPHandler = {
        // Configuration
        config: {
            enableLazyLoading: true,
            rootMargin: '50px',
            threshold: 0.01,
            fallbackFormat: 'jpg'
        },

        // Check WebP support
        supportsWebP: null,

        // Initialize
        init() {
            this.checkWebPSupport().then(supported => {
                this.supportsWebP = supported;
                console.log(`✅ WebP Support: ${supported ? 'YES' : 'NO'}`);
                
                if (this.config.enableLazyLoading) {
                    this.setupLazyLoading();
                } else {
                    this.loadAllImages();
                }
            });
        },

        // Check if browser supports WebP
        checkWebPSupport() {
            return new Promise(resolve => {
                const webP = new Image();
                webP.onload = webP.onerror = () => {
                    resolve(webP.height === 2);
                };
                webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
            });
        },

        // Setup lazy loading with Intersection Observer
        setupLazyLoading() {
            if (!('IntersectionObserver' in window)) {
                console.warn('⚠️ IntersectionObserver not supported, loading all images');
                this.loadAllImages();
                return;
            }

            const imageObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: this.config.rootMargin,
                    threshold: this.config.threshold
                }
            );

            // Observe all lazy images
            document.querySelectorAll('img[data-src], picture source[data-srcset]').forEach(element => {
                imageObserver.observe(element.closest('picture') || element);
            });

            console.log('✅ Lazy loading initialized');
        },

        // Load single image
        loadImage(element) {
            if (element.tagName === 'PICTURE') {
                // Load picture element
                const sources = element.querySelectorAll('source[data-srcset]');
                sources.forEach(source => {
                    source.srcset = source.dataset.srcset;
                    source.removeAttribute('data-srcset');
                });

                const img = element.querySelector('img[data-src]');
                if (img) {
                    img.src = img.dataset.src;
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
            } else if (element.tagName === 'IMG') {
                // Load img element
                element.src = element.dataset.src;
                if (element.dataset.srcset) {
                    element.srcset = element.dataset.srcset;
                }
                element.removeAttribute('data-src');
                element.classList.add('loaded');
            }
        },

        // Load all images immediately (fallback)
        loadAllImages() {
            document.querySelectorAll('img[data-src], picture source[data-srcset]').forEach(element => {
                const parent = element.closest('picture');
                this.loadImage(parent || element);
            });
        },

        // Create responsive image element
        createResponsiveImage(config) {
            const {
                src,
                webpSrc,
                alt = '',
                width,
                height,
                className = '',
                lazy = true,
                sizes = '100vw'
            } = config;

            const picture = document.createElement('picture');

            // WebP source
            if (webpSrc && this.supportsWebP) {
                const webpSource = document.createElement('source');
                webpSource.type = 'image/webp';
                
                if (lazy) {
                    webpSource.dataset.srcset = webpSrc;
                } else {
                    webpSource.srcset = webpSrc;
                }
                
                if (sizes) webpSource.sizes = sizes;
                picture.appendChild(webpSource);
            }

            // Fallback source
            const fallbackSource = document.createElement('source');
            fallbackSource.type = this.getMimeType(src);
            
            if (lazy) {
                fallbackSource.dataset.srcset = src;
            } else {
                fallbackSource.srcset = src;
            }
            
            if (sizes) fallbackSource.sizes = sizes;
            picture.appendChild(fallbackSource);

            // Image element
            const img = document.createElement('img');
            
            if (lazy) {
                img.dataset.src = src;
                img.src = this.getPlaceholder(width, height);
            } else {
                img.src = src;
            }
            
            img.alt = alt;
            if (width) img.width = width;
            if (height) img.height = height;
            if (className) img.className = className;
            img.loading = lazy ? 'lazy' : 'eager';
            
            picture.appendChild(img);

            return picture;
        },

        // Get MIME type from extension
        getMimeType(src) {
            const ext = src.split('.').pop().toLowerCase();
            const mimeTypes = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'svg': 'image/svg+xml',
                'webp': 'image/webp'
            };
            return mimeTypes[ext] || 'image/jpeg';
        },

        // Generate placeholder (data URI)
        getPlaceholder(width = 1, height = 1) {
            return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3C/svg%3E`;
        },

        // Convert existing img to picture element with WebP
        enhanceImage(img) {
            const src = img.src || img.dataset.src;
            if (!src) return;

            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            const alt = img.alt;
            const width = img.width || img.getAttribute('width');
            const height = img.height || img.getAttribute('height');
            const className = img.className;
            const lazy = img.hasAttribute('loading') && img.getAttribute('loading') === 'lazy';

            const picture = this.createResponsiveImage({
                src,
                webpSrc,
                alt,
                width,
                height,
                className,
                lazy
            });

            img.replaceWith(picture);
        },

        // Auto-enhance all images on page
        enhanceAllImages() {
            document.querySelectorAll('img:not([data-no-enhance])').forEach(img => {
                // Skip if already inside picture element
                if (img.parentElement.tagName !== 'PICTURE') {
                    this.enhanceImage(img);
                }
            });
            console.log('✅ All images enhanced with WebP support');
        }
    };

    // Helper function to create WebP images
    window.createWebPImage = function(config) {
        return WebPHandler.createResponsiveImage(config);
    };

    // Expose WebPHandler globally
    window.WebPHandler = WebPHandler;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => WebPHandler.init());
    } else {
        WebPHandler.init();
    }

    // Add CSS for image transitions
    const style = document.createElement('style');
    style.textContent = `
        img[data-src] {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        img.loaded {
            opacity: 1;
        }
        picture {
            display: inline-block;
        }
    `;
    document.head.appendChild(style);

})();
