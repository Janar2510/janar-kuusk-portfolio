// Main Script - Portfolio Page
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🚀 Portfolio Page Loading...', 'color: #40ffaa; font-size: 16px; font-weight: bold;');
    
    // Initialize all components
    initializeComponents();
    
    // Initialize splash cursor
    initializeSplashCursor();
    
    // Setup global event listeners
    setupGlobalEventListeners();
    
    // Console welcome message
    console.log('%c🚀 Welcome to Janar Kuusk\'s Portfolio!', 'color: #40ffaa; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with modern web technologies and AI-powered solutions.', 'color: #4079ff; font-size: 14px;');
});

// Initialize all components
function initializeComponents() {
    // Wait for ComponentManager to be available
    if (typeof ComponentManager === 'undefined') {
        setTimeout(initializeComponents, 100);
        return;
    }
    
    console.log('Initializing components...');
    
    // Components are automatically initialized by ComponentManager
    // Additional component-specific initialization can be added here
}

// Splash Cursor Initialization
function initializeSplashCursor() {
    console.log('Attempting to initialize SplashCursorReact...');
    
    // Wait for SplashCursorReact to be available
    if (typeof SplashCursorReact === 'undefined') {
        console.log('SplashCursorReact not found, retrying in 100ms...');
        setTimeout(initializeSplashCursor, 100);
        return;
    }
    
    console.log('SplashCursorReact found, initializing...');
    
    try {
        // Initialize splash cursor with custom settings
        const splashCursor = new SplashCursorReact({
            SIM_RESOLUTION: 128,
            DYE_RESOLUTION: 1440,
            CAPTURE_RESOLUTION: 512,
            DENSITY_DISSIPATION: 3.5,
            VELOCITY_DISSIPATION: 2,
            PRESSURE: 0.1,
            PRESSURE_ITERATIONS: 20,
            CURL: 3,
            SPLAT_RADIUS: 0.2,
            SPLAT_FORCE: 6000,
            SHADING: true,
            COLOR_UPDATE_SPEED: 10,
            BACK_COLOR: { r: 0.5, g: 0, b: 0 },
            TRANSPARENT: true
        });
        
        console.log('%c💫 Splash cursor initialized successfully!', 'color: #a855f7; font-size: 16px; font-weight: bold;');
        console.log('SplashCursorReact instance:', splashCursor);
        
        // Store reference for cleanup if needed
        window.splashCursorInstance = splashCursor;
    } catch (error) {
        console.error('Splash cursor failed to initialize:', error);
        console.error('Error details:', error.stack);
    }
}

// Setup global event listeners
function setupGlobalEventListeners() {
    // Smooth scrolling for anchor links
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

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('.main-nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // Header scroll effect - visible only at top of page, disappears when scrolling
    const header = document.querySelector('.portfolio-header');
    const topThreshold = 10; // Show header when within 10px of top
    
    if (header) {
        // Function to check scroll position and update header visibility
        const checkScrollPosition = () => {
            const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            
            // Show header only when at the very top of the page
            if (currentScrollY <= topThreshold) {
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
            } else {
                // Hide header when scrolled down
                header.classList.remove('header-visible');
                header.classList.add('header-hidden');
            }
        };
        
        // Check initial state immediately (in case page loaded scrolled)
        checkScrollPosition();
        
        // Check on scroll with throttling for better performance
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    checkScrollPosition();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        // Check on scroll
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Also check on load and after delays to ensure DOM is ready
        window.addEventListener('load', () => {
            checkScrollPosition();
        });
        
        // Multiple checks to ensure it works
        setTimeout(checkScrollPosition, 50);
        setTimeout(checkScrollPosition, 200);
    }

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });

    // Resize handler
    window.addEventListener('resize', Utils.debounce(() => {
        // Handle responsive adjustments
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    }, 250));
}

// Utility functions
const Utils = {
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: function(func, limit) {
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
    },

    // Smooth scroll to element
    scrollToElement: function(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get random color from palette
    getRandomColor: function() {
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Animate number counting
    animateNumber: function(element, start, end, duration) {
        const startTimestamp = performance.now();
        const step = (timestamp) => {
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = start + (end - start) * this.easeOutCubic(progress);
            element.textContent = Math.floor(value);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    },

    // Easing function
    easeOutCubic: function(t) {
        return 1 - Math.pow(1 - t, 3);
    }
};

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`%c⚡ Page loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`, 
                'color: #10b981; font-size: 14px; font-weight: bold;');
        }, 0);
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// Export utilities for use in other scripts
window.Utils = Utils;