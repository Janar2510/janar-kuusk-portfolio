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
            this.videos = Array.from(container.querySelectorAll('.website-video'));
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
            this.videosLoaded = false;
            this.videoAspectRatios = [];

            this.init();
        }

        init() {
            // Initialize thumbnail videos
            this.initThumbnailVideos();
            
            // Preload videos
            this.preloadVideos().then(() => {
                this.videosLoaded = true;
                this.setupAnimation();
            });
        }

        initThumbnailVideos() {
            // Get all thumbnail videos
            const thumbVideos = document.querySelectorAll('.thumb-video');
            thumbVideos.forEach((video) => {
                // Load video metadata to show first frame
                video.load();
                // Seek to 0.5 seconds to show an actual frame (not just black)
                video.addEventListener('loadedmetadata', () => {
                    video.currentTime = 0.5;
                }, { once: true });
            });
        }

        preloadVideos() {
            return new Promise((resolve) => {
                if (!this.videos || this.videos.length === 0) {
                    resolve();
                    return;
                }

                let loaded = 0;
                const total = this.videos.length;

                this.videos.forEach((video, index) => {
                    // Get video source URL
                    const source = video.querySelector('source');
                    const videoUrl = source ? source.getAttribute('src') : video.src;

                    if (!videoUrl) {
                        loaded++;
                        if (loaded === total) resolve();
                        return;
                    }

                    // Handle video loadedmetadata event
                    const handleLoadedMetadata = () => {
                        loaded++;
                        // Store aspect ratio for each video (for reference, but container uses fixed 16:9)
                        if (video.videoWidth > 0 && video.videoHeight > 0) {
                            this.videoAspectRatios[index] = video.videoWidth / video.videoHeight;
                        }
                        if (loaded === total) resolve();
                        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                    };

                    video.addEventListener('loadedmetadata', handleLoadedMetadata);
                    
                    // Handle errors
                    video.addEventListener('error', () => {
                        loaded++;
                        if (loaded === total) resolve();
                        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                    });

                    // Load video
                    video.load();
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

            // Set initial videos position
            this.videos.forEach((video, i) => {
                if (i === 0) {
                    gsap.set(video, { xPercent: 0 });
                    // Ensure first video loads - autoplay will be handled by setupScrollAutoplay
                    video.load();
                    // Don't try to play here - let setupScrollAutoplay handle it when section is visible
                } else {
                    gsap.set(video, { xPercent: 15 });
                    // Pause other videos
                    video.pause();
                    video.load(); // Preload other videos
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

            // Setup scroll-triggered autoplay
            this.setupScrollAutoplay();

            // Initial animation
            this.gotoSection(0, 1);
        }

        setupScrollAutoplay() {
            // Find the website design section container
            const section = this.container.closest('.website-design-section');
            if (!section) return;

            // Find the first video
            const firstVideo = this.videos[0];
            if (!firstVideo) {
                console.warn('First video not found for autoplay');
                return;
            }

            let hasPlayed = false;
            let isPlaying = false;

            // Function to ensure video is ready and play it
            const ensureVideoPlays = () => {
                if (hasPlayed || isPlaying) return;
                
                // Force video to load if not already loaded
                if (firstVideo.readyState < 2) {
                    firstVideo.load();
                }

                // Try to play immediately if ready
                const attemptPlay = () => {
                    if (isPlaying || !firstVideo.paused) return;
                    
                    isPlaying = true;
                    firstVideo.play()
                        .then(() => {
                            hasPlayed = true;
                            console.log('First video started playing');
                        })
                        .catch((error) => {
                            isPlaying = false;
                            console.log('Autoplay prevented, will retry:', error);
                            // Retry after a short delay
                            setTimeout(() => {
                                if (!hasPlayed) {
                                    firstVideo.play()
                                        .then(() => {
                                            hasPlayed = true;
                                            console.log('First video started playing on retry');
                                        })
                                        .catch(() => {
                                            // If still fails, wait for user interaction
                                            const handleInteraction = () => {
                                                firstVideo.play().catch(() => {});
                                                document.removeEventListener('click', handleInteraction);
                                                document.removeEventListener('touchstart', handleInteraction);
                                                document.removeEventListener('scroll', handleInteraction);
                                            };
                                            document.addEventListener('click', handleInteraction, { once: true });
                                            document.addEventListener('touchstart', handleInteraction, { once: true });
                                            document.addEventListener('scroll', handleInteraction, { once: true });
                                        });
                                }
                            }, 200);
                        });
                };

                // Check if video is ready
                if (firstVideo.readyState >= 2) {
                    attemptPlay();
                } else {
                    // Wait for video to be ready
                    const onCanPlay = () => {
                        attemptPlay();
                        firstVideo.removeEventListener('canplay', onCanPlay);
                    };
                    firstVideo.addEventListener('canplay', onCanPlay, { once: true });
                    firstVideo.load();
                }
            };

            // Check if section is already visible on page load
            const checkInitialVisibility = () => {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
                if (isVisible) {
                    // Start playing when section is visible
                    ensureVideoPlays();
                }
            };

            // Check after initialization
            setTimeout(checkInitialVisibility, 800);

            // Create Intersection Observer with lower threshold to trigger earlier
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !hasPlayed) {
                            // Section is entering viewport, start playing video
                            ensureVideoPlays();
                        }
                    });
                },
                {
                    threshold: 0.1, // Trigger when just 10% of section is visible (much earlier)
                    rootMargin: '100px 0px' // Start checking 100px before section enters viewport
                }
            );

            observer.observe(section);

            // Also add scroll listener as backup
            let scrollTimeout;
            const handleScroll = () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (!hasPlayed) {
                        const rect = section.getBoundingClientRect();
                        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                        if (isVisible) {
                            ensureVideoPlays();
                        }
                    }
                }, 100);
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
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
                // Pause current video
                if (this.videos[this.currentIndex]) {
                    this.videos[this.currentIndex].pause();
                }
                this.timeline
                    .to(this.videos[this.currentIndex], { xPercent: -15 * dFactor })
                    .set(this.sections[this.currentIndex], { autoAlpha: 0 }, 0);
            }

            // Show new section
            gsap.set(this.sections[index], { autoAlpha: 1, zIndex: 1 });
            
            // Play new video
            if (this.videos[index]) {
                const video = this.videos[index];
                video.load();
                const playVideo = () => {
                    video.play().catch(() => {
                        setTimeout(() => video.play().catch(() => {}), 100);
                    });
                };
                if (video.readyState >= 2) {
                    playVideo();
                } else {
                    video.addEventListener('canplay', playVideo, { once: true });
                }
            }
            
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
                    this.videos[index],
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

