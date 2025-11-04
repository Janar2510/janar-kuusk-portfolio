// Website Scroll Animation - Converted from React/GSAP to Vanilla JS
(function() {
    'use strict';

    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof Observer !== 'undefined') {
        gsap.registerPlugin(Observer);
    }

    class WebsiteScrollAnimation {
        constructor(container) {
            this.container = container;
            if (!container) return;

            this.sections = Array.from(container.querySelectorAll('.website-scroll-section'));
            this.images = Array.from(container.querySelectorAll('.website-bg'));
            this.outerWrappers = Array.from(container.querySelectorAll('.website-outer'));
            this.innerWrappers = Array.from(container.querySelectorAll('.website-inner'));
            this.headings = Array.from(container.querySelectorAll('.website-heading'));
            this.thumbs = Array.from(container.querySelectorAll('.website-thumb'));
            this.counterWrapper = container.querySelector('.counter-wrapper');
            this.counterCurrent = container.querySelector('.counter-current');
            this.counterNext = container.querySelector('.counter-next');
            
            this.currentIndex = 0;
            this.animating = false;
            this.observer = null;
            this.timeline = null;
            this.imagesLoaded = false;
            this.imageAspectRatios = [];

            this.init();
        }

        init() {
            // Preload images
            this.preloadImages().then(() => {
                this.imagesLoaded = true;
                this.setupAnimation();
            });
        }

        preloadImages() {
            return new Promise((resolve) => {
                const imageUrls = this.images.map(img => {
                    const bgImage = img.style.backgroundImage;
                    const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    return match ? match[1] : null;
                }).filter(url => url);

                let loaded = 0;
                const total = imageUrls.length;
                let firstImageAspectRatio = null;

                if (total === 0) {
                    resolve();
                    return;
                }

                imageUrls.forEach((url, index) => {
                    const img = new Image();
                    img.onload = () => {
                        loaded++;
                        // Store aspect ratio for each image
                        if (img.width > 0 && img.height > 0) {
                            this.imageAspectRatios[index] = img.width / img.height;
                            // If this is the first image, set initial height
                            if (index === 0) {
                                this.updateContainerHeight(0);
                            }
                        }
                        if (loaded === total) resolve();
                    };
                    img.onerror = () => {
                        loaded++;
                        if (loaded === total) resolve();
                    };
                    img.src = url;
                });
            });
        }

        setupAnimation() {
            // Set initial positions
            this.outerWrappers.forEach((wrapper, i) => {
                if (i === 0) {
                    gsap.set(wrapper, { xPercent: 0 });
                } else {
                    gsap.set(wrapper, { xPercent: 100 });
                }
            });

            this.innerWrappers.forEach((wrapper, i) => {
                if (i === 0) {
                    gsap.set(wrapper, { xPercent: 0 });
                } else {
                    gsap.set(wrapper, { xPercent: -100 });
                }
            });

            // Set initial section visibility
            this.sections.forEach((section, i) => {
                if (i === 0) {
                    gsap.set(section, { autoAlpha: 1, zIndex: 2 });
                } else {
                    gsap.set(section, { autoAlpha: 0, zIndex: 1 });
                }
            });

            // Set initial images position
            this.images.forEach((img, i) => {
                if (i === 0) {
                    gsap.set(img, { xPercent: 0 });
                } else {
                    gsap.set(img, { xPercent: 15 });
                }
            });

            // Ensure headings are always fully visible with no animations
            this.headings.forEach((heading) => {
                gsap.set(heading, { opacity: 1, yPercent: 0, clearProps: 'all' });
            });

            // Update thumbnails
            this.updateThumbnails(0);

            // Setup scroll observer
            this.setupObserver();

            // Setup thumbnail clicks
            this.setupThumbnailClicks();

            // Initial animation
            this.gotoSection(0, 1);
            
            // Add resize handler to recalculate height on window resize
            this.resizeHandler = () => {
                if (this.imageAspectRatios[this.currentIndex]) {
                    this.updateContainerHeight(this.currentIndex);
                }
            };
            window.addEventListener('resize', this.resizeHandler);
        }

        updateContainerHeight(imageIndex) {
            if (!this.container || !this.imageAspectRatios[imageIndex]) return;
            
            // Get the design container (parent of scroll-animation)
            const designContainer = this.container.closest('.website-design-container');
            if (!designContainer) return;
            
            // Get available width (100% of parent, which accounts for 50px padding)
            const containerWidth = designContainer.offsetWidth || designContainer.clientWidth;
            
            // Get aspect ratio for this specific image
            const aspectRatio = this.imageAspectRatios[imageIndex];
            
            // Calculate height based on image aspect ratio
            const calculatedHeight = containerWidth / aspectRatio;
            
            // Get max available height (viewport minus 100px for padding)
            const maxHeight = window.innerHeight - 100;
            
            // Use the smaller of calculated height or max height
            const finalHeight = Math.min(calculatedHeight, maxHeight);
            
            // Set height on both containers
            designContainer.style.height = `${finalHeight}px`;
            this.container.style.height = `${finalHeight}px`;
        }

        setupObserver() {
            if (typeof Observer === 'undefined') {
                console.warn('GSAP Observer not loaded');
                return;
            }

            this.observer = Observer.create({
                target: this.container,
                type: 'wheel,touch,pointer',
                wheelSpeed: -1,
                onDown: () => {
                    if (!this.animating) {
                        this.gotoSection(this.currentIndex - 1, -1);
                    }
                },
                onUp: () => {
                    if (!this.animating) {
                        this.gotoSection(this.currentIndex + 1, 1);
                    }
                },
                tolerance: 10,
                preventDefault: true
            });
        }

        setupThumbnailClicks() {
            this.thumbs.forEach((thumb, index) => {
                thumb.addEventListener('click', () => {
                    if (this.currentIndex !== index && !this.animating) {
                        const direction = index > this.currentIndex ? 1 : -1;
                        this.gotoSection(index, direction);
                    }
                });
            });
        }

        gotoSection(index, direction) {
            if (this.animating || !this.container) return;

            const wrap = gsap.utils.wrap(0, this.sections.length);
            index = wrap(index);
            this.animating = true;

            const fromTop = direction === -1;
            const dFactor = fromTop ? -1 : 1;

            this.timeline = gsap.timeline({
                defaults: { duration: 1.25, ease: 'power1.inOut' },
                onComplete: () => {
                    this.animating = false;
                }
            });

            // Hide current section
            if (this.currentIndex >= 0) {
                gsap.set(this.sections[this.currentIndex], { zIndex: 0 });
                this.timeline
                    .to(this.images[this.currentIndex], { xPercent: -15 * dFactor })
                    .set(this.sections[this.currentIndex], { autoAlpha: 0 }, 0);
            }

            // Show new section
            gsap.set(this.sections[index], { autoAlpha: 1, zIndex: 1 });
            
            // Update container height to match this image's aspect ratio
            this.updateContainerHeight(index);
            
            // Ensure heading is immediately visible with no animation
            if (this.headings[index]) {
                this.timeline.set(this.headings[index], { 
                    opacity: 1, 
                    yPercent: 0, 
                    clearProps: 'all',
                    immediateRender: true
                }, 0);
            }

            this.timeline
                .fromTo(
                    [this.outerWrappers[index], this.innerWrappers[index]],
                    {
                        xPercent: (i) => (i ? -100 * dFactor : 100 * dFactor)
                    },
                    { xPercent: 0 },
                    0
                )
                .fromTo(
                    this.images[index],
                    { xPercent: 15 * dFactor },
                    { xPercent: 0 },
                    0
                );

            // Animate counter
            this.animateCounter(index, direction);

            this.currentIndex = index;
            this.updateThumbnails(index);
        }

        animateCounter(index, direction) {
            if (!this.counterCurrent || !this.counterNext) return;

            const nextValue = String(index + 1);
            this.counterNext.textContent = nextValue;
            gsap.set(this.counterNext, { opacity: 1, yPercent: 100 * direction });

            this.timeline.to(
                this.counterCurrent,
                {
                    yPercent: -100 * direction,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                },
                0.4
            );

            this.timeline.to(
                this.counterNext,
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                },
                0.4
            ).add(() => {
                this.counterCurrent.textContent = nextValue;
                gsap.set(this.counterNext, { opacity: 0, clearProps: 'all' });
                gsap.set(this.counterCurrent, { yPercent: 0 });
            });
        }

        updateThumbnails(activeIndex) {
            this.thumbs.forEach((thumb, index) => {
                if (index === activeIndex) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });
        }

        destroy() {
            if (this.observer) {
                this.observer.kill();
                this.observer = null;
            }
            if (this.timeline) {
                this.timeline.kill();
                this.timeline = null;
            }
            if (this.resizeHandler) {
                window.removeEventListener('resize', this.resizeHandler);
                this.resizeHandler = null;
            }
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('websiteScrollAnimation');
        if (container && typeof gsap !== 'undefined') {
            window.websiteScrollAnimation = new WebsiteScrollAnimation(container);
        } else if (!container) {
            console.warn('Website scroll animation container not found');
        } else {
            console.warn('GSAP not loaded');
        }
    });
})();

