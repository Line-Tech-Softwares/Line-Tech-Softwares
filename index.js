// ===== MAIN JAVASCRIPT - index.js =====

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    initializeHeader();
    initializeHamburgerMenu();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeServiceFilter();
    initializeContactForm();
    initializeScrollEffects();
}

// ===== HEADER FUNCTIONALITY =====
function initializeHeader() {
    const header = document.querySelector('.header');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== HAMBURGER MENU =====
function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('nav-mobile');
    const navLinks = document.querySelectorAll('.nav-link-mobile');
    
    if (!hamburger || !navMobile) return;
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        toggleMobileMenu();
    });
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('nav-mobile');
    
    hamburger.classList.toggle('active');
    navMobile.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMobile.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('nav-mobile');
    
    hamburger.classList.remove('active');
    navMobile.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== SERVICE FILTER =====
function initializeServiceFilter() {
    const filterToggle = document.getElementById('filter-toggle');
    const filterOptions = document.getElementById('filter-options');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const servicesGrid = document.getElementById('services-grid');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (!filterBtns.length || !serviceCards.length) return;
    
    // Set initial active state for all cards
    serviceCards.forEach(card => {
        card.classList.add('active');
    });
    
    // Filter button click handler
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter service cards
            serviceCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.add('active');
                } else if (card.getAttribute('data-filter') === filterValue) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            
            // Close filter options on mobile if open
            if (filterOptions && filterOptions.classList.contains('active')) {
                filterOptions.classList.remove('active');
                if (filterToggle) {
                    filterToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Mobile filter toggle
    if (filterToggle && filterOptions) {
        filterToggle.addEventListener('click', function() {
            filterOptions.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Hide filter on outside click
        document.addEventListener('click', function(e) {
            if (filterToggle && filterOptions && !filterToggle.contains(e.target) && !filterOptions.contains(e.target)) {
                filterOptions.classList.remove('active');
                filterToggle.classList.remove('active');
            }
        });
    }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = servicesSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Initialize AOS (Animate On Scroll) alternative
    initializeScrollAnimations();
    
    // Add loading animations
    addLoadingAnimations();
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

function addLoadingAnimations() {
    // Add staggered animations to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animations to testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const loadingSpinner = submitButton.querySelector('.loading-spinner');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateContactForm()) {
            return;
        }
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Hide loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            // Show success message
            showFormMessage('success');
            
            // Reset form
            contactForm.reset();
            clearFormErrors();
        }, 2000);
    });
    
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateContactForm() {
    const form = document.getElementById('contact-form');
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate name
    if (!name.value.trim()) {
        showFieldError(name, 'Please enter your name.');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        showFieldError(email, 'Please enter your email address.');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email address.');
        isValid = false;
    }
    
    // Validate phone
    if (!phone.value.trim()) {
        showFieldError(phone, 'Please enter your phone number.');
        isValid = false;
    } else if (!isValidSouthAfricanPhone(phone.value)) {
        showFieldError(phone, 'Please enter a valid South African phone number.');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    
    clearFieldError(field);
    
    switch(fieldName) {
        case 'name':
            if (!value) {
                showFieldError(field, 'Please enter your name.');
                return false;
            }
            break;
            
        case 'email':
            if (!value) {
                showFieldError(field, 'Please enter your email address.');
                return false;
            } else if (!isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address.');
                return false;
            }
            break;
            
        case 'phone':
            if (!value) {
                showFieldError(field, 'Please enter your phone number.');
                return false;
            } else if (!isValidSouthAfricanPhone(value)) {
                showFieldError(field, 'Please enter a valid South African phone number.');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    field.style.borderColor = '#ef4444';
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    field.style.borderColor = '';
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(error => {
        error.classList.remove('show');
    });
    
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea');
    formInputs.forEach(input => {
        input.style.borderColor = '';
    });
}

function showFormMessage(type) {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Hide all messages first
    successMessage.classList.remove('show');
    errorMessage.classList.remove('show');
    
    // Show appropriate message
    if (type === 'success') {
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    } else {
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
}

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidSouthAfricanPhone(phone) {
    // Remove spaces and check if it matches South African mobile pattern
    const cleanPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^[6-8][0-9]{8}$/;
    return phoneRegex.test(cleanPhone);
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Update active navigation link based on scroll position
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Tab navigation for mobile menu
    if (e.key === 'Tab') {
        const navMobile = document.getElementById('nav-mobile');
        if (navMobile && navMobile.classList.contains('active')) {
            const focusableElements = navMobile.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});

// ===== BROWSER COMPATIBILITY =====
// Check for required features
if (!window.IntersectionObserver) {
    // Fallback for older browsers
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('aos-animate');
    });
}

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        toggleMobileMenu,
        closeMobileMenu,
        validateContactForm,
        isValidEmail,
        isValidSouthAfricanPhone
    };
}