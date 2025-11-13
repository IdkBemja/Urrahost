/**
 * Error Handler - Urra Hosting
 * Global error handling and logging
 */

(function() {
    'use strict';

    const ErrorHandler = {
        // Configuration
        config: {
            enableLogging: true,
            enableConsole: true,
            logToServer: false,
            serverEndpoint: '/api/log-error'
        },

        // Initialize error handlers
        init() {
            this.setupGlobalErrorHandler();
            this.setupUnhandledRejectionHandler();
            this.setupResourceErrorHandler();
            console.log('✅ Error Handler initialized');
        },

        // Global JavaScript error handler
        setupGlobalErrorHandler() {
            window.addEventListener('error', (event) => {
                const error = {
                    message: event.message,
                    source: event.filename,
                    line: event.lineno,
                    column: event.colno,
                    error: event.error?.stack || 'No stack trace',
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                };

                this.logError('JavaScript Error', error);
                
                // Prevent default error handling in production
                if (this.isProduction()) {
                    event.preventDefault();
                }
            });
        },

        // Unhandled promise rejection handler
        setupUnhandledRejectionHandler() {
            window.addEventListener('unhandledrejection', (event) => {
                const error = {
                    reason: event.reason,
                    promise: event.promise,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                };

                this.logError('Unhandled Promise Rejection', error);
                
                // Prevent default handling in production
                if (this.isProduction()) {
                    event.preventDefault();
                }
            });
        },

        // Resource loading error handler
        setupResourceErrorHandler() {
            window.addEventListener('error', (event) => {
                if (event.target !== window) {
                    const error = {
                        type: 'Resource Loading Error',
                        element: event.target.tagName,
                        source: event.target.src || event.target.href,
                        timestamp: new Date().toISOString(),
                        url: window.location.href
                    };

                    this.logError('Resource Error', error);
                }
            }, true);
        },

        // Log error
        logError(type, error) {
            if (this.config.enableConsole) {
                console.group(`❌ ${type}`);
                console.error(error);
                console.groupEnd();
            }

            if (this.config.logToServer) {
                this.sendToServer(type, error);
            }

            // Store in localStorage for debugging
            this.storeLocally(type, error);
        },

        // Send error to server
        sendToServer(type, error) {
            if (!this.config.serverEndpoint) return;

            try {
                fetch(this.config.serverEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type,
                        error,
                        timestamp: new Date().toISOString()
                    })
                }).catch(err => {
                    console.warn('Failed to send error to server:', err);
                });
            } catch (err) {
                console.warn('Error in sendToServer:', err);
            }
        },

        // Store error locally
        storeLocally(type, error) {
            try {
                const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
                errors.push({
                    type,
                    error,
                    timestamp: new Date().toISOString()
                });

                // Keep only last 50 errors
                if (errors.length > 50) {
                    errors.shift();
                }

                localStorage.setItem('errorLog', JSON.stringify(errors));
            } catch (err) {
                console.warn('Failed to store error locally:', err);
            }
        },

        // Check if production environment
        isProduction() {
            return window.location.hostname !== 'localhost' && 
                   !window.location.hostname.includes('127.0.0.1');
        },

        // Get stored errors
        getStoredErrors() {
            try {
                return JSON.parse(localStorage.getItem('errorLog') || '[]');
            } catch (err) {
                return [];
            }
        },

        // Clear stored errors
        clearStoredErrors() {
            try {
                localStorage.removeItem('errorLog');
                console.log('[SUCCESS] Error log cleared');
            } catch (err) {
                console.warn('Failed to clear error log:', err);
            }
        }
    };

    // Safe function wrapper
    window.safeExecute = function(fn, fallback = null) {
        try {
            return fn();
        } catch (error) {
            ErrorHandler.logError('Safe Execute Caught Error', {
                error: error.message,
                stack: error.stack
            });
            return fallback;
        }
    };

    // Safe async function wrapper
    window.safeExecuteAsync = async function(fn, fallback = null) {
        try {
            return await fn();
        } catch (error) {
            ErrorHandler.logError('Safe Execute Async Caught Error', {
                error: error.message,
                stack: error.stack
            });
            return fallback;
        }
    };

    // Expose ErrorHandler globally
    window.ErrorHandler = ErrorHandler;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ErrorHandler.init());
    } else {
        ErrorHandler.init();
    }

    // Debug commands for console
    if (!ErrorHandler.isProduction()) {
        window.debugErrors = {
            view: () => ErrorHandler.getStoredErrors(),
            clear: () => ErrorHandler.clearStoredErrors(),
            test: () => {
                throw new Error('Test error from debugErrors.test()');
            }
        };
        console.log('🔧 Debug commands available: debugErrors.view(), debugErrors.clear(), debugErrors.test()');
    }

})();
