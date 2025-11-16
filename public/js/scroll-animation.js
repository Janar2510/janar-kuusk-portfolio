// Container Scroll Animation
class ScrollAnimation {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.warn(`ScrollAnimation: Container "${containerSelector}" not found`);
            return;
        }

        this.title = this.container.querySelector('.scroll-title');
        this.card = this.container.querySelector('.scroll-card-container');
        this.isMobile = window.innerWidth <= 768;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Only initialize if not reduced motion preference
        if (!this.isReducedMotion) {
            this.init();
        } else {
            // Set default state for reduced motion
            this.setDefaultState();
        }
    }

    init() {
        this.setupScrollListener();
        this.setupResizeListener();

        // Initial update
        this.updateAnimation();

        console.log('ScrollAnimation initialized');
    }

    setDefaultState() {
        // Set final state (no animation)
        if (this.card) {
            this.card.style.transform = 'perspective(1000px) rotateX(0deg) scale(1)';
        }
    }

    setupScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateAnimation();
                    ticking = false;
                });

                ticking = true;
            }
        }, { passive: true });
    }

    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.isMobile = window.innerWidth <= 768;
                this.updateAnimation();
            }, 100);
        });
    }

    updateAnimation() {
        const rect = this.container.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate scroll progress (0 to 1)
        // When section enters viewport (bottom of section at bottom of screen) = 0
        // When section is centered in viewport = 0.5
        // When section top reaches top of viewport = 1
        const scrollStart = rect.bottom - windowHeight;
        const scrollEnd = -rect.top;
        const scrollRange = scrollStart + scrollEnd;
        const currentScroll = -scrollStart;

        let scrollProgress = Math.max(0, Math.min(1, currentScroll / scrollRange));

        // Ease the progress for smoother animation
        scrollProgress = this.easeOutCubic(scrollProgress);

        // Title translate (moves up as you scroll)
        const titleTranslate = scrollProgress * -100;
        if (this.title) {
            this.title.style.transform = `translateY(${titleTranslate}px)`;
            this.title.style.opacity = Math.max(0.3, 1 - scrollProgress * 0.7);
        }

        // Card rotate (20deg to 0deg)
        const rotate = 20 - (scrollProgress * 20);

        // Card scale
        // Desktop: 1.05 to 1
        // Mobile: 0.7 to 0.9
        const scaleStart = this.isMobile ? 0.7 : 1.05;
        const scaleEnd = this.isMobile ? 0.9 : 1;
        const scale = scaleStart - (scrollProgress * (scaleStart - scaleEnd));

        // Card translate (optional: slight upward movement)
        const cardTranslate = scrollProgress * -20;

        if (this.card) {
            this.card.style.transform =
                `perspective(1000px) rotateX(${rotate}deg) scale(${scale}) translateY(${cardTranslate}px)`;
        }
    }

    // Easing function for smoother animation
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Cleanup method
    destroy() {
        // Remove event listeners if needed
        window.removeEventListener('scroll', this.updateAnimation);
        window.removeEventListener('resize', this.setupResizeListener);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animation for summary section
    const scrollAnim = new ScrollAnimation('.scroll-animation-container');

    // Make it globally accessible for debugging
    window.scrollAnimation = scrollAnim;
});

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollAnimation;
}
