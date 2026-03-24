// Tools Landing JS
// Hamburger nav from shared, smooth scroll

document.addEventListener('DOMContentLoaded', () => {
    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('nav-mobile');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMobile.classList.toggle('active');
    });

    // Smooth scroll for sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Active nav
    const current = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(link => {
        if (link.getAttribute('href') === current || link.getAttribute('href') === './tools.html') {
            link.classList.add('active');
        }
    });

    console.log('Tools landing ready');
});

