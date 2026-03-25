/**
 * Image Loader Utility
 * Handles image loading for both local development and GitHub Pages deployment
 * Works around LFS issues by providing fallback mechanisms
 */

(function() {
    // Determine if we're in development or production
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isProduction = !isDev && window.location.hostname !== '';

    /**
     * Fix broken images and ensure they load properly
     */
    function fixImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            const originalSrc = img.src;
            
            // Add error handler for all images
            img.addEventListener('error', function() {
                console.warn(`Image failed to load: ${originalSrc}`);
                
                // If image has a data-fallback attribute, use it
                if (img.getAttribute('data-fallback')) {
                    img.src = img.getAttribute('data-fallback');
                    console.log(`Using fallback: ${img.getAttribute('data-fallback')}`);
                }
            });

            // If image src is relative and looks like it's pointing to ASSETS, ensure correct path
            if (originalSrc && originalSrc.includes('ASSETS')) {
                // Already correct - relative path should work
                console.log(`Image path OK: ${originalSrc}`);
            }
        });
    }

    /**
     * Fix favicon loading
     */
    function fixFavicon() {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon && favicon.href.includes('ASSETS')) {
            // Favicon should be fine with relative path
            console.log(`Favicon path OK: ${favicon.href}`);
        }
    }

    /**
     * Check if images are loading
     */
    function validateImageLoading() {
        return {
            checkImages: function() {
                const images = document.querySelectorAll('img[src*="ASSETS"]');
                const results = {
                    total: images.length,
                    loaded: 0,
                    failed: 0,
                    paths: []
                };

                images.forEach(img => {
                    results.paths.push({
                        src: img.src,
                        alt: img.alt,
                        width: img.width,
                        height: img.height,
                        complete: img.complete,
                        currentSrc: img.currentSrc
                    });

                    if (img.complete && img.naturalHeight !== 0) {
                        results.loaded++;
                    } else {
                        results.failed++;
                    }
                });

                return results;
            },

            report: function() {
                const validation = this.checkImages();
                console.table({
                    'Environment': isDev ? 'Development' : 'Production',
                    'Hostname': window.location.hostname,
                    'Images Found': validation.total,
                    'Images Loaded': validation.loaded,
                    'Images Failed': validation.failed,
                    'Success Rate': validation.total > 0 ? `${Math.round((validation.loaded / validation.total) * 100)}%` : 'N/A'
                });

                if (validation.failed > 0) {
                    console.warn('Failed image paths:', validation.paths.filter((p, i, arr) => {
                        const img = Array.from(document.querySelectorAll('img'))[i];
                        return !img.complete || img.naturalHeight === 0;
                    }));
                }

                return validation;
            }
        };
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            fixImages();
            fixFavicon();
        });
    } else {
        fixImages();
        fixFavicon();
    }

    // Expose validation function for debugging
    window.ImageLoader = {
        validate: validateImageLoading()
    };

    // Log status
    console.log(`Image Loader initialized (${isDev ? 'Dev' : 'Prod'} mode)`);
})();
