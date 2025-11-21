// Testimonials Slider - Vanilla JavaScript Implementation

const testimonials = [
    {
        id: 1,
        name: "Maria Andersson",
        affiliation: "CEO, Nordic Tech Solutions",
        quote: "The AI implementation transformed our entire sales process. We saw immediate results and the ROI exceeded all expectations.",
        imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop",
        thumbnailSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Erik Johansson",
        affiliation: "Operations Director, Baltic Manufacturing",
        quote: "Janar's expertise in automation and process optimization helped us reduce costs by 40% while improving quality standards.",
        imageSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop",
        thumbnailSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Sofia Larsen",
        affiliation: "Founder, GreenTech Innovations",
        quote: "Working with Color Disain Studio was game-changing. The custom CRM solution perfectly fits our renewable energy business model.",
        imageSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop",
        thumbnailSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Mikael Virtanen",
        affiliation: "CTO, FinTech Solutions Group",
        quote: "The level of technical expertise and attention to detail is outstanding. Our digital transformation exceeded all our targets.",
        imageSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop",
        thumbnailSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Anna Kask",
        affiliation: "Managing Director, Solar Dynamics",
        quote: "From concept to deployment, the entire process was seamless. The AI-powered analytics give us insights we never had before.",
        imageSrc: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop",
        thumbnailSrc: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop"
    }
];

class TestimonialsSlider {
    constructor() {
        this.currentIndex = 0;
        this.testimonials = testimonials;
        this.isTransitioning = false;
        
        // DOM elements
        this.mainImageContainer = document.getElementById('mainImageContainer');
        this.testimonialContent = document.getElementById('testimonialContent');
        this.thumbnailNav = document.getElementById('thumbnailNav');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentNumber = document.querySelector('.current-number');
        this.totalNumber = document.querySelector('.total-number');
        
        // Listen for language changes
        this.setupLanguageListener();
        
        this.init();
    }
    
    setupLanguageListener() {
        // Listen for custom language change event
        window.addEventListener('languageChanged', () => {
            this.updateCurrentSlideLanguage();
        });
        
        // Also check for language switcher updates
        if (window.languageSwitcher) {
            const originalUpdateContent = window.languageSwitcher.updateContent.bind(window.languageSwitcher);
            window.languageSwitcher.updateContent = (lang) => {
                originalUpdateContent(lang);
                setTimeout(() => {
                    this.updateCurrentSlideLanguage();
                }, 100);
            };
        }
    }
    
    updateCurrentSlideLanguage() {
        const currentSlide = this.testimonialContent.querySelector('.testimonial-slide.active');
        if (!currentSlide) return;
        
        const index = this.currentIndex;
        const currentLang = window.currentLanguage || localStorage.getItem('preferredLanguage') || 'en';
        const translations = window.translations || window.testimonialsTranslations;
        
        if (translations && translations[currentLang] && translations[currentLang].testimonials) {
            const testimonialKey = `testimonial${index + 1}`;
            const testimonialData = translations[currentLang].testimonials[testimonialKey];
            
            if (testimonialData) {
                const affiliationEl = currentSlide.querySelector('.testimonial-affiliation');
                const nameEl = currentSlide.querySelector('.testimonial-name');
                const quoteEl = currentSlide.querySelector('.testimonial-quote');
                
                if (affiliationEl) affiliationEl.textContent = testimonialData.affiliation || this.testimonials[index].affiliation;
                if (nameEl) nameEl.textContent = testimonialData.name || this.testimonials[index].name;
                if (quoteEl) quoteEl.textContent = testimonialData.quote || this.testimonials[index].quote;
            }
        }
    }
    
    init() {
        // Set total number
        this.totalNumber.textContent = String(this.testimonials.length).padStart(2, '0');
        
        // Create initial slides
        this.createMainImageSlide(0);
        this.createTestimonialSlide(0);
        this.createThumbnails();
        
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Auto-advance (optional)
        this.startAutoPlay();
    }
    
    createMainImageSlide(index) {
        const testimonial = this.testimonials[index];
        const slide = document.createElement('div');
        slide.className = 'main-image-slide active';
        slide.innerHTML = `
            <img src="${testimonial.imageSrc}" 
                 alt="${testimonial.name}"
                 onerror="this.src='https://via.placeholder.com/600x800/1a1a1a/00e5ff?text=${encodeURIComponent(testimonial.name)}'">
        `;
        this.mainImageContainer.appendChild(slide);
    }
    
    createTestimonialSlide(index) {
        const testimonial = this.testimonials[index];
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide active';
        
        // Get current language
        const currentLang = window.currentLanguage || localStorage.getItem('preferredLanguage') || 'en';
        const translations = window.translations || window.testimonialsTranslations;
        
        // Get translated content if available
        let name = testimonial.name;
        let affiliation = testimonial.affiliation;
        let quote = testimonial.quote;
        
        if (translations && translations[currentLang] && translations[currentLang].testimonials) {
            const testimonialKey = `testimonial${index + 1}`;
            const testimonialData = translations[currentLang].testimonials[testimonialKey];
            if (testimonialData) {
                name = testimonialData.name || name;
                affiliation = testimonialData.affiliation || affiliation;
                quote = testimonialData.quote || quote;
            }
        }
        
        slide.innerHTML = `
            <p class="testimonial-affiliation" data-testimonial-index="${index}" data-testimonial-field="affiliation">${affiliation}</p>
            <h3 class="testimonial-name" data-testimonial-index="${index}" data-testimonial-field="name">${name}</h3>
            <blockquote class="testimonial-quote" data-testimonial-index="${index}" data-testimonial-field="quote">${quote}</blockquote>
        `;
        this.testimonialContent.appendChild(slide);
    }
    
    createThumbnails() {
        this.thumbnailNav.innerHTML = '';
        
        // Show next 3 testimonials (excluding current)
        const thumbnails = this.testimonials
            .map((t, i) => ({ ...t, originalIndex: i }))
            .filter((_, i) => i !== this.currentIndex)
            .slice(0, 3);
        
        thumbnails.forEach(testimonial => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail-item';
            thumb.innerHTML = `
                <img src="${testimonial.thumbnailSrc}" 
                     alt="${testimonial.name}"
                     onerror="this.src='https://via.placeholder.com/200x300/1a1a1a/00e5ff?text=${encodeURIComponent(testimonial.name)}'">
            `;
            thumb.addEventListener('click', () => this.goTo(testimonial.originalIndex));
            this.thumbnailNav.appendChild(thumb);
        });
    }
    
    next() {
        if (this.isTransitioning) return;
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.goTo(nextIndex);
    }
    
    prev() {
        if (this.isTransitioning) return;
        const prevIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.goTo(prevIndex);
    }
    
    goTo(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        this.isTransitioning = true;
        
        // Update counter
        this.currentNumber.textContent = String(index + 1).padStart(2, '0');
        
        // Transition main image
        this.transitionMainImage(index);
        
        // Transition testimonial content
        this.transitionTestimonial(index);
        
        // Update thumbnails
        this.createThumbnails();
        
        // Update current index
        this.currentIndex = index;
        
        // Reset transition lock
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }
    
    transitionMainImage(newIndex) {
        const currentSlide = this.mainImageContainer.querySelector('.main-image-slide.active');
        
        if (currentSlide) {
            currentSlide.classList.remove('active');
            currentSlide.classList.add('exiting');
            
            setTimeout(() => {
                currentSlide.remove();
            }, 600);
        }
        
        this.createMainImageSlide(newIndex);
    }
    
    transitionTestimonial(newIndex) {
        const currentSlide = this.testimonialContent.querySelector('.testimonial-slide.active');
        
        if (currentSlide) {
            currentSlide.classList.remove('active');
            currentSlide.classList.add('exiting');
            
            setTimeout(() => {
                currentSlide.remove();
            }, 600);
        }
        
        this.createTestimonialSlide(newIndex);
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 12000); // Change slide every 12 seconds
        
        // Pause on hover
        const slider = document.getElementById('testimonialsSlider');
        slider.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
}

// Header Navigation Component
class HeaderNavigation {
    constructor() {
        this.header = document.querySelector('.portfolio-header');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mainNav = document.querySelector('.main-nav');
        this.navOverlay = document.getElementById('navOverlay');
        this.init();
    }
    
    init() {
        // Always show header on testimonials page
        if (this.header) {
            this.header.classList.add('header-visible');
        }
        
        // Setup scroll effect
        this.setupScrollEffect();
        
        // Setup mobile menu
        this.setupMobileMenu();
    }
    
    setupScrollEffect() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop <= 10) {
                // At the top - show header
                this.header.classList.add('header-visible');
                this.header.classList.remove('header-hidden');
            } else if (scrollTop > lastScrollTop) {
                // Scrolling down - hide header
                this.header.classList.remove('header-visible');
                this.header.classList.add('header-hidden');
            } else {
                // Scrolling up - show header
                this.header.classList.add('header-visible');
                this.header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    setupMobileMenu() {
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.mobileMenuToggle.classList.toggle('active');
                this.mainNav.classList.toggle('active');
                this.navOverlay.classList.toggle('active');
                document.body.style.overflow = this.mainNav.classList.contains('active') ? 'hidden' : '';
            });
        }
        
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => {
                this.mobileMenuToggle.classList.remove('active');
                this.mainNav.classList.remove('active');
                this.navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close menu on nav link click
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.mainNav.classList.contains('active')) {
                    this.mobileMenuToggle.classList.remove('active');
                    this.mainNav.classList.remove('active');
                    this.navOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
}

// Initialize slider when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsSlider();
    new HeaderNavigation();
});

// Add smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

