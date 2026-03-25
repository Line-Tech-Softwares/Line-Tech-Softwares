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
        const altExtensions = ['.jpg', '.jpeg', '.png'];

        images.forEach(img => {
            const originalSrc = img.src;

            function getFallbackForPath(src) {
                try {
                    const url = new URL(src, window.location.href);
                    const extMatches = url.pathname.match(/\.(jpg|jpeg|png)$/i);
                    if (!extMatches) return null;
                    const currentExt = extMatches[0].toLowerCase();
                    const basePath = url.pathname.slice(0, -currentExt.length);

                    for (const ext of altExtensions) {
                        if (ext !== currentExt) {
                            const candidate = basePath + ext;
                            if (candidate) return candidate;
                        }
                    }
                } catch (e) {
                    return null;
                }
                return null;
            }

            img.addEventListener('error', function() {
                console.warn(`Image failed to load: ${originalSrc}`);

                if (img.getAttribute('data-fallback')) {
                    img.src = img.getAttribute('data-fallback');
                    console.log(`Using explicit data-fallback: ${img.src}`);
                    return;
                }

                const fallback = getFallbackForPath(img.src);
                if (fallback && fallback !== img.src && !img.dataset.fallbackTried) {
                    img.dataset.fallbackTried = 'true';
                    img.src = fallback;
                    console.log(`Trying fallback URL: ${fallback}`);
                    return;
                }

                if (!isDev) {
                    img.style.opacity = '0.35';
                    img.style.filter = 'grayscale(60%)';
                }
            });

            if (originalSrc && originalSrc.includes('ASSETS')) {
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
