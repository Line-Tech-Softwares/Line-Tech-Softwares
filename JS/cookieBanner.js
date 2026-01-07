/**
 * Cookie Banner Management
 * Handles cookie consent with 6-month expiration and 2-week extension on return visits
 */

function initCookieBanner() {
  const COOKIE_CONSENT_KEY = 'linetech_cookie_consent';
  const COOKIE_TIMESTAMP_KEY = 'linetech_cookie_timestamp';
  const SIX_MONTHS_MS = 6 * 30.44 * 24 * 60 * 60 * 1000; // ~6 months in milliseconds
  const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds

  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');

  if (!cookieBanner || !acceptButton) {
    console.warn('Cookie banner elements not found');
    return;
  }

  /**
   * Check if user has accepted cookies and if consent is still valid
   */
  function shouldShowBanner() {
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
    const consentTimestamp = localStorage.getItem(COOKIE_TIMESTAMP_KEY);

    if (!hasConsent) {
      return true; // First time visitor
    }

    if (!consentTimestamp) {
      return true; // Invalid state, show banner
    }

    const lastConsentTime = parseInt(consentTimestamp, 10);
    const currentTime = Date.now();
    const timeSinceConsent = currentTime - lastConsentTime;

    // If consent expired (6 months), show banner again
    if (timeSinceConsent > SIX_MONTHS_MS) {
      return true;
    }

    return false;
  }

  /**
   * Accept cookies and set consent timestamp
   */
  function acceptCookies() {
    const currentTime = Date.now();
    
    // Set consent
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    
    // Set/update timestamp with 6-month expiration
    localStorage.setItem(COOKIE_TIMESTAMP_KEY, currentTime.toString());
    
    // Hide banner with animation
    hideBanner();
  }

  /**
   * Hide the cookie banner with fade-out animation
   */
  function hideBanner() {
    cookieBanner.style.animation = 'slideOut 0.4s ease-in-out forwards';
    setTimeout(() => {
      cookieBanner.style.display = 'none';
    }, 400);
  }

  /**
   * Extend consent by 2 weeks on return visit
   */
  function extendConsent() {
    const consentTimestamp = localStorage.getItem(COOKIE_TIMESTAMP_KEY);
    
    if (consentTimestamp) {
      const lastConsentTime = parseInt(consentTimestamp, 10);
      const currentTime = Date.now();
      const timeSinceConsent = currentTime - lastConsentTime;

      // If within 6 months and last visit was more than 2 weeks ago, extend by 2 weeks
      if (timeSinceConsent < SIX_MONTHS_MS && timeSinceConsent > TWO_WEEKS_MS) {
        // Extend the timestamp forward by resetting it to current time
        localStorage.setItem(COOKIE_TIMESTAMP_KEY, currentTime.toString());
      }
    }
  }

  // Check and show/hide banner on load
  if (shouldShowBanner()) {
    cookieBanner.style.display = 'flex';
    cookieBanner.style.animation = 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
  } else {
    cookieBanner.style.display = 'none';
    // Extend consent on return visit
    extendConsent();
  }

  // Accept button click handler
  acceptButton.addEventListener('click', acceptCookies);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieBanner);
} else {
  initCookieBanner();
}
