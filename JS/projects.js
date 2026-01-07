// ===== PROJECTS PAGE JAVASCRIPT - projects.js =====

document.addEventListener('DOMContentLoaded', function() {
    // Add entrance animations to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
        card.style.opacity = '0';
    });

    // Add hover effects for image fallback
    const projectImages = document.querySelectorAll('.project-image img');
    projectImages.forEach(img => {
        img.addEventListener('error', function() {
            // Fallback to a nice gradient if image fails to load
            this.style.display = 'none';
            this.parentElement.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))';
        });
    });

    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
