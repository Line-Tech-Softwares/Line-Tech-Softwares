document.addEventListener('DOMContentLoaded', function () {
	const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
	const navMobile = document.getElementById('nav-mobile') || document.querySelector('.nav-mobile');
	const body = document.body;

	function openMenu() {
		try {
			navMobile.classList.add('active');
			hamburger.classList.add('active');
			body.classList.add('no-scroll');
			if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
			// move focus to first link for accessibility
			const firstLink = navMobile.querySelector('.nav-link-mobile');
			if (firstLink) firstLink.focus();
		} catch (err) {
			console.error('Error opening menu:', err);
		}
	}

	function closeMenu() {
		try {
			navMobile.classList.remove('active');
			hamburger.classList.remove('active');
			body.classList.remove('no-scroll');
			if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
			if (hamburger) hamburger.focus();
		} catch (err) {
			console.error('Error closing menu:', err);
		}
	}

	if (hamburger && navMobile) {
		// ensure ARIA
		hamburger.setAttribute('aria-controls', 'nav-mobile');
		hamburger.setAttribute('aria-expanded', 'false');
		hamburger.setAttribute('aria-label', 'Toggle navigation');

		hamburger.addEventListener('click', function (e) {
			e.stopPropagation();
			if (navMobile.classList.contains('active')) {
				closeMenu();
			} else {
				openMenu();
			}
		});

		// explicit close button injection removed — hamburger is the single control
		// Close when clicking a mobile nav link
		navMobile.querySelectorAll('.nav-link-mobile').forEach(link => {
			link.addEventListener('click', function () {
				closeMenu();
			});
		});

		// Close when clicking the overlay / background
		navMobile.addEventListener('click', function (e) {
			if (e.target === navMobile) {
				closeMenu();
			}
		});

		// Close on Escape key
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && navMobile.classList.contains('active')) {
				closeMenu();
			}
		});

	} else {
		console.warn('Hamburger or nav-mobile element not found:', {hamburger, navMobile});
	}

	// ===== SERVICE FILTER =====
	function initializeServiceFilter() {
		const filterToggle = document.getElementById('filter-toggle');
		const filterOptions = document.getElementById('filter-options');
		const filterText = document.getElementById('filter-text');
		const filterBtns = filterOptions ? filterOptions.querySelectorAll('.filter-btn') : [];
		const serviceCards = document.querySelectorAll('.service-card');

		if (!serviceCards.length) return;

		// Ensure all services visible initially
		serviceCards.forEach(card => card.classList.remove('hidden'));

		// Button handlers
		filterBtns.forEach(btn => {
			btn.addEventListener('click', function (e) {
				e.stopPropagation();
				const filterValue = this.getAttribute('data-filter');

				filterBtns.forEach(b => b.classList.toggle('active', b === this));

				// update toggle text
				if (filterText) {
					const displayText = filterValue === 'all' ? 'Default' : this.textContent.trim();
					filterText.textContent = displayText;
				}

				serviceCards.forEach(card => {
					if (filterValue === 'all' || card.getAttribute('data-filter') === filterValue) {
						card.classList.remove('hidden');
					} else {
						card.classList.add('hidden');
					}
				});

				// close options after selection
				if (filterOptions) filterOptions.classList.remove('open');
			});
		});

		// Toggle options on filter button click
		if (filterToggle && filterOptions) {
			filterToggle.addEventListener('click', function (e) {
				e.stopPropagation();
				filterOptions.classList.toggle('open');
			});

			document.addEventListener('click', function (e) {
				if (!filterToggle.contains(e.target) && !filterOptions.contains(e.target)) {
					filterOptions.classList.remove('open');
				}
			});
		}
	}

	// Initialize filter when DOM is ready
	try {
		initializeServiceFilter();
	} catch (err) {
		console.error('Error initializing service filter:', err);
	}

	// ===== TESTIMONIALS CAROUSEL (pop in/out, 2 on desktop, 1 on mobile) =====
	function initializeTestimonialsCarousel() {
		const carousel = document.getElementById('testimonials-carousel');
		if (!carousel) return;
		const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
		if (slides.length === 0) return;

		let currentIndex = 0;
		const isMobile = () => window.innerWidth <= 768;
		const slidesPerView = () => isMobile() ? 1 : 4; // 4 slides on desktop, 1 on mobile

		function showSlides() {
			const perView = slidesPerView();
			slides.forEach((slide, idx) => {
				const isInRange = idx >= currentIndex && idx < currentIndex + perView;
				if (isInRange) slide.classList.add('active');
				else slide.classList.remove('active');
			});
		}

		// Disable autoplay on desktop (show all 4), enable on mobile (pop animations)
		let autoplay = null;
		if (isMobile()) {
			autoplay = setInterval(() => {
				const perView = slidesPerView();
				currentIndex = (currentIndex + perView) % slides.length;
				showSlides();
			}, 5000);
		}

		carousel.addEventListener('mouseenter', () => {
			if (autoplay) clearInterval(autoplay);
		});
		carousel.addEventListener('mouseleave', () => {
			if (isMobile() && !autoplay) {
				autoplay = setInterval(() => {
					const perView = slidesPerView();
					currentIndex = (currentIndex + perView) % slides.length;
					showSlides();
				}, 5000);
			}
		});

		// Handle window resize to update slides per view
		window.addEventListener('resize', () => {
			const newIsMobile = isMobile();
			if (newIsMobile && !autoplay) {
				autoplay = setInterval(() => {
					const perView = slidesPerView();
					currentIndex = (currentIndex + perView) % slides.length;
					showSlides();
				}, 5000);
			} else if (!newIsMobile && autoplay) {
				clearInterval(autoplay);
				autoplay = null;
			}
			showSlides();
		});

		// show initial slides
		showSlides();
	}

	try {
		initializeTestimonialsCarousel();
	} catch (err) {
		console.error('Error initializing testimonials carousel:', err);
	}

	// ===== HERO IMAGE SLIDER =====
	function initializeHeroSlider() {
		const slider = document.getElementById('hero-slider');
		if (!slider) return;
		const track = slider.querySelector('.hero-track');
		const slides = Array.from(slider.querySelectorAll('.hero-slide'));
		if (!track || slides.length === 0) return;

		let index = 0;
		function goTo(i) {
			const next = (i + slides.length) % slides.length;
			slides.forEach((s, idx) => {
				if (idx === next) s.classList.add('active');
				else s.classList.remove('active');
			});
			index = next;
		}

		// autoplay every 4 seconds (pop in/out)
		let autoplayInterval = 4000;
		let autoplay = setInterval(() => goTo(index + 1), autoplayInterval);
		slider.addEventListener('mouseenter', () => clearInterval(autoplay));
		slider.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(index + 1), autoplayInterval); });

		// touch support for swiping (passive start)
		let startX = 0;
		track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
		track.addEventListener('touchend', (e) => {
			const dx = e.changedTouches[0].clientX - startX;
			if (dx > 30) goTo(index - 1);
			else if (dx < -30) goTo(index + 1);
		});

		// show first slide
		goTo(0);
	}

	try {
		// Resolve image paths with fallbacks for both hero and team images
		function resolveImagePaths() {
			// Selectors for hero and team images
			const heroImgs = document.querySelectorAll('.hero-img');
			const teamImg = document.querySelector('.team-image');
			const allImgs = Array.from(heroImgs);
			if (teamImg) allImgs.push(teamImg);
			if (!allImgs.length) return;

			// Fallback paths: relative paths work best on GitHub Pages with custom domains
			const fallbackPaths = {
				'team-collaboration-DibbwOOP': [
					'ASSETS/images/team-collaboration-DibbwOOP.webp',
					'ASSETS/images/team-collaboration-DibbwOOP.jpg',
					'ASSETS/images/team-collaboration-DibbwOOP.png',
					'./ASSETS/images/team-collaboration-DibbwOOP.webp',
					'./ASSETS/images/team-collaboration-DibbwOOP.jpg',
					'./ASSETS/images/team-collaboration-DibbwOOP.png',
				],
				'hero': [
					'ASSETS/Hero/',
					'./ASSETS/Hero/',
					'ASSETS/hero/',
					'./ASSETS/hero/',
				]
			};

			allImgs.forEach(img => {
				const orig = img.getAttribute('src') || '';
				const file = orig.split('/').pop() || '';
				const dot = file.lastIndexOf('.');
				const nameNoExt = dot > 0 ? file.slice(0, dot) : file;
				const exts = ['.jpg', '.jpeg', '.png', '.webp'];
				const tries = [];

				// Keep original first
				if (orig) tries.push(orig);

				// Add fallback paths
				if (img.classList.contains('hero-img')) {
					// Hero images: use prefixes + extensions
					fallbackPaths['hero'].forEach(p => exts.forEach(e => tries.push(p + nameNoExt + e)));
				} else if (img.classList.contains('team-image')) {
					// Team image: use predefined fallback paths
					tries.push(...fallbackPaths['team-collaboration-DibbwOOP']);
				}

				let attempt = 0;
				function tryNext() {
					if (attempt >= tries.length) {
						console.error('Image not found after fallbacks:', file);
						return;
					}
					const url = tries[attempt];
					img.onerror = () => { attempt++; tryNext(); };
					img.onload = () => { console.log('Image loaded:', url); };
					img.src = url;
				}
				tryNext();
			});
		}

		resolveImagePaths();
		initializeHeroSlider();
	} catch (err) {
		console.error('Error initializing hero slider:', err);
	}

});
