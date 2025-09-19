// Components.js - Modular Component System
class ComponentManager {
    constructor() {
        this.components = new Map();
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.initializeComponents();
        this.setupEventListeners();
        console.log('ComponentManager initialized');
    }

    // Component Registration
    register(name, component) {
        this.components.set(name, component);
        if (component.init) {
            component.init();
        }
    }

    get(name) {
        return this.components.get(name);
    }

    // Animation System
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all elements with animation attributes
        document.querySelectorAll('[data-aos]').forEach(el => {
            this.intersectionObserver.observe(el);
        });
    }

    triggerAnimation(element) {
        const animationType = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || 0;
        
        setTimeout(() => {
            element.classList.add('visible');
            this.runCustomAnimation(element, animationType);
        }, delay);
    }

    runCustomAnimation(element, type) {
        switch (type) {
            case 'fade-up':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
            case 'fade-down':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
            case 'fade-left':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
            case 'fade-right':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
            case 'scale-in':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
        }
    }

    // Component Initialization
    initializeComponents() {
        this.register('hero', new HeroComponent());
        this.register('workflow', new WorkflowComponent());
        this.register('particles', new ParticleSystem());
        this.register('contact', new ContactForm());
        this.register('navigation', new NavigationComponent());
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.main-nav');
        const toggle = document.getElementById('mobileMenuToggle');
        
        nav.classList.toggle('active');
        toggle.classList.toggle('active');
    }
}

// Hero Component
class HeroComponent {
    constructor() {
        this.heroCard = document.getElementById('heroCard');
        this.exploreBtn = document.getElementById('exploreBtn');
        this.contactBtn = document.getElementById('contactBtn');
    }

    init() {
        this.setupAnimations();
        this.setupInteractions();
    }

    setupAnimations() {
        if (this.heroCard) {
            // Floating animation for hero card
            setInterval(() => {
                this.heroCard.style.transform = `translateY(${Math.sin(Date.now() * 0.001) * 10}px)`;
            }, 16);
        }
    }

    setupInteractions() {
        if (this.exploreBtn) {
            this.exploreBtn.addEventListener('click', () => {
                document.getElementById('projects').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

        if (this.contactBtn) {
            this.contactBtn.addEventListener('click', () => {
                document.getElementById('contact').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }
}

// Workflow Component
class WorkflowComponent {
    constructor() {
        this.workflowNodes = document.getElementById('workflowNodes');
        this.nodes = [];
        this.connections = [];
    }

    init() {
        this.createWorkflowNodes();
        this.animateConnections();
    }

    createWorkflowNodes() {
        const nodeData = [
            { id: 'input', title: 'Data Input', icon: '📊', color: '#6366f1' },
            { id: 'process', title: 'AI Processing', icon: '🤖', color: '#8b5cf6' },
            { id: 'analyze', title: 'Analysis', icon: '🔍', color: '#06b6d4' },
            { id: 'output', title: 'Results', icon: '📈', color: '#10b981' }
        ];

        nodeData.forEach((node, index) => {
            const nodeElement = this.createNode(node, index);
            this.workflowNodes.appendChild(nodeElement);
            this.nodes.push(nodeElement);
        });

        this.createConnections();
    }

    createNode(data, index) {
        const node = document.createElement('div');
        node.className = 'workflow-node';
        node.style.animationDelay = `${index * 0.2}s`;
        node.innerHTML = `
            <div class="node-icon" style="background-color: ${data.color}">
                ${data.icon}
            </div>
            <div class="node-title">${data.title}</div>
            <div class="node-status">Ready</div>
        `;

        // Add click interaction
        node.addEventListener('click', () => {
            this.activateNode(node);
        });

        return node;
    }

    createConnections() {
        for (let i = 0; i < this.nodes.length - 1; i++) {
            const connection = document.createElement('div');
            connection.className = 'workflow-connection';
            connection.style.animationDelay = `${(i + 1) * 0.2}s`;
            this.workflowNodes.appendChild(connection);
            this.connections.push(connection);
        }
    }

    activateNode(node) {
        // Reset all nodes
        this.nodes.forEach(n => n.classList.remove('active'));
        
        // Activate clicked node
        node.classList.add('active');
        
        // Update status
        const status = node.querySelector('.node-status');
        status.textContent = 'Active';
        status.style.color = '#10b981';
    }

    animateConnections() {
        this.connections.forEach((connection, index) => {
            setTimeout(() => {
                connection.classList.add('active');
            }, index * 200);
        });
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        const heroParticles = document.getElementById('heroParticles');
        if (heroParticles) {
            heroParticles.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Contact Form Component
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
    }

    init() {
        if (this.form) {
            this.setupFormValidation();
            this.setupFormSubmission();
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 3 characters';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    async handleFormSubmission() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormError('Please fix the errors above');
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.simulateApiCall(data);
            this.showFormSuccess('Message sent successfully!');
            this.form.reset();
        } catch (error) {
            this.showFormError('Failed to send message. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateApiCall(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure
                if (Math.random() > 0.1) {
                    resolve(data);
                } else {
                    reject(new Error('API Error'));
                }
            }, 2000);
        });
    }

    showFormSuccess(message) {
        this.showFormMessage(message, 'success');
    }

    showFormError(message) {
        this.showFormMessage(message, 'error');
    }

    showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        this.form.appendChild(messageDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Navigation Component
class NavigationComponent {
    constructor() {
        this.nav = document.querySelector('.main-nav');
        this.header = document.querySelector('.portfolio-header');
        this.navLinks = document.querySelectorAll('.nav-link');
    }

    init() {
        this.setupScrollEffect();
        this.setupActiveLink();
    }

    setupScrollEffect() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
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

    static getRandomColor() {
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    static animateValue(element, start, end, duration) {
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
    }

    static easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.componentManager = new ComponentManager();
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});

// Export for use in other files
window.ComponentManager = ComponentManager;
window.Utils = Utils;
