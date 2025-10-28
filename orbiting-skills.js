// Orbiting Skills - Vanilla JavaScript Implementation

// =====================================================
// 📁 LOGO CONFIGURATION - UPLOAD YOUR CUSTOM LOGOS HERE
// =====================================================
//
// Instructions:
// 1. Upload your logo images to a folder (e.g., /assets/logos/)
// 2. Replace the URLs below with your uploaded logo paths
// 3. For best results, use:
//    - Square images (1:1 ratio)
//    - PNG format with transparent background
//    - Size: 256x256px or larger
//    - File size: Under 100KB for performance
//
// Example formats:
//   - Local path: '/assets/logos/mylogo.png'
//   - External URL: 'https://example.com/logo.png'
//   - Data URI: 'data:image/png;base64,iVBORw0KG...'
//
const CUSTOM_LOGO_PATHS = {
    html: null,        // Set to image path to use custom logo, e.g., '/assets/logos/html.png'
    css: null,         // null = use default SVG icon
    javascript: null,
    react: null,
    node: null,
    tailwind: null,
    claude: null,
    cursor: null,
    chatgpt: null,
    lovable: null
};
// =====================================================

class OrbitingSkills {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        this.time = 0;
        this.isPaused = false;
        this.animationId = null;
        this.lastTime = performance.now();
        this.hoveredIcon = null;

        // Configuration for orbiting skills
        this.skillsConfig = [
            // Inner orbit (web fundamentals) - Cyan glow
            {
                id: 'html',
                orbitRadius: 100,
                size: 40,
                speed: 1,
                iconType: 'html',
                phaseShift: 0,
                glowColor: 'cyan',
                label: 'HTML5'
            },
            {
                id: 'css',
                orbitRadius: 100,
                size: 45,
                speed: 1,
                iconType: 'css',
                phaseShift: (2 * Math.PI) / 3,
                glowColor: 'cyan',
                label: 'CSS3'
            },
            {
                id: 'javascript',
                orbitRadius: 100,
                size: 40,
                speed: 1,
                iconType: 'javascript',
                phaseShift: (4 * Math.PI) / 3,
                glowColor: 'cyan',
                label: 'JavaScript'
            },

            // Middle orbit (AI tools) - Purple glow
            {
                id: 'claude',
                orbitRadius: 140,
                size: 50,
                speed: -0.8,
                iconType: 'claude',
                phaseShift: 0,
                glowColor: 'purple',
                label: 'Claude AI'
            },
            {
                id: 'cursor',
                orbitRadius: 140,
                size: 45,
                speed: -0.8,
                iconType: 'cursor',
                phaseShift: (2 * Math.PI) / 3,
                glowColor: 'purple',
                label: 'Cursor'
            },
            {
                id: 'chatgpt',
                orbitRadius: 140,
                size: 50,
                speed: -0.8,
                iconType: 'chatgpt',
                phaseShift: (4 * Math.PI) / 3,
                glowColor: 'purple',
                label: 'ChatGPT'
            },

            // Outer orbit (frameworks + AI) - Cyan glow
            {
                id: 'lovable',
                orbitRadius: 180,
                size: 45,
                speed: -0.6,
                iconType: 'lovable',
                phaseShift: 0,
                glowColor: 'cyan',
                label: 'Lovable'
            },
            {
                id: 'react',
                orbitRadius: 180,
                size: 50,
                speed: -0.6,
                iconType: 'react',
                phaseShift: (2 * Math.PI) / 3,
                glowColor: 'cyan',
                label: 'React'
            },
            {
                id: 'node',
                orbitRadius: 180,
                size: 45,
                speed: -0.6,
                iconType: 'node',
                phaseShift: (4 * Math.PI) / 3,
                glowColor: 'cyan',
                label: 'Node.js'
            }
        ];

        this.orbitIcons = [];
        this.init();
    }

    init() {
        this.createStructure();
        this.setupEventListeners();
        this.startAnimation();
    }

    createStructure() {
        // Clear container
        this.container.innerHTML = '';

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'orbiting-skills-wrapper';

        // Create background pattern
        const background = document.createElement('div');
        background.className = 'orbit-background';
        wrapper.appendChild(background);

        // Create central code icon
        const center = this.createCenterIcon();
        wrapper.appendChild(center);

        // Create orbit paths
        const orbits = [
            { radius: 100, glowColor: 'cyan', delay: 0 },
            { radius: 140, glowColor: 'purple', delay: 1 },
            { radius: 180, glowColor: 'cyan', delay: 1.5 }
        ];

        orbits.forEach(orbit => {
            const path = this.createOrbitPath(orbit.radius, orbit.glowColor, orbit.delay);
            wrapper.appendChild(path);
        });

        // Create orbiting icons
        this.skillsConfig.forEach(config => {
            const icon = this.createOrbitIcon(config);
            this.orbitIcons.push({ element: icon, config });
            wrapper.appendChild(icon);
        });

        this.container.appendChild(wrapper);
    }

    createCenterIcon() {
        const center = document.createElement('div');
        center.className = 'orbit-center';

        center.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: relative; z-index: 10;">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#06B6D4" />
                        <stop offset="100%" stop-color="#9333EA" />
                    </linearGradient>
                </defs>
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
        `;

        return center;
    }

    createOrbitPath(radius, glowColor, delay) {
        const path = document.createElement('div');
        path.className = `orbit-path orbit-path-${glowColor}`;
        path.style.width = `${radius * 2}px`;
        path.style.height = `${radius * 2}px`;

        const inner = document.createElement('div');
        inner.className = 'orbit-path-inner';
        inner.style.animationDelay = `${delay}s`;

        path.appendChild(inner);
        return path;
    }

    createOrbitIcon(config) {
        const icon = document.createElement('div');
        icon.className = 'orbit-icon';
        icon.style.width = `${config.size}px`;
        icon.style.height = `${config.size}px`;
        icon.dataset.iconType = config.iconType;

        const svg = this.getIconSVG(config.iconType);
        icon.innerHTML = svg;

        // Create label
        const label = document.createElement('div');
        label.className = 'orbit-icon-label';
        label.textContent = config.label;
        icon.appendChild(label);

        // Add hover effects for glow AND pause animation
        icon.addEventListener('mouseenter', () => {
            const color = this.getIconColor(config.iconType);
            icon.style.setProperty('--icon-glow-color', color);

            // Store which icon is hovered
            this.hoveredIcon = icon;

            // Pause animation IMMEDIATELY when hovering individual icon
            this.pause();
        });

        icon.addEventListener('mouseleave', () => {
            // Clear hovered icon reference
            this.hoveredIcon = null;

            // Resume animation when leaving individual icon
            this.resume();
        });

        return icon;
    }

    getIconSVG(type) {
        // Check if custom logo is configured
        if (CUSTOM_LOGO_PATHS[type]) {
            return `<img src="${CUSTOM_LOGO_PATHS[type]}"
                         alt="${type}"
                         style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;"
                         onerror="this.style.display='none'">`;
        }

        // Otherwise, use default SVG icons
        const icons = {
            html: `<svg viewBox="0 0 512 512" fill="none" style="width: 100%; height: 100%;">
                <path d="M108.4 0h23v22.8h21.2V0h23v69h-23V46h-21.1v23h-23.1V0zM206 23h-20.3V0h63.7v23H229v46h-23V23zM259.5 0h24.1l14.8 24.3L313.2 0h24.1v69h-23V34.8l-15.8 24.5h-.4l-15.9-24.5V69h-22.5V0zM348.7 0h23v46.2h32.3V69h-55.3V0z" fill="#E34F26"/>
                <path d="M107.6 471l-33-370.4h362.8l-33 370.2L255.7 512" fill="#E34F26"/>
                <path d="M256 480.5V131H404.3L376 447" fill="#F06529"/>
                <path d="M142 176.3h114v45.4h-64.2l4.2 46.5h60v45.3H154.4M156.4 336.3H202l3.2 36.3 50.8 13.6v47.4l-93.2-26" fill="#EBEBEB"/>
                <path d="M369.6 176.3H255.8v45.4h109.6M361.3 268.2H255.8v45.4h56l-5.3 59-50.7 13.6v47.2l93-25.8" fill="#FFF"/>
            </svg>`,

            css: `<svg viewBox="0 0 512 512" fill="none" style="width: 100%; height: 100%;">
                <path d="M480 397.9L416 96H96L32 397.9l224 78.1z" fill="#264DE4"/>
                <path d="M416 96L256 448V96z" fill="#2965F1"/>
                <path d="M256 160h-96l6 48h90v48H144l-8-96h120V112H112l22 240 122 38V281H164l-4-49h96z" fill="#EBEBEB"/>
                <path d="M256 160v48h90l-6 48h-84v48h78l-8 89-78 22v50l144-44 18-228z" fill="#FFF"/>
            </svg>`,

            javascript: `<svg viewBox="0 0 24 24" fill="none" style="width: 100%; height: 100%;">
                <rect width="24" height="24" fill="#FFD700"/>
                <path d="M22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" fill="#323330"/>
            </svg>`,

            react: `<svg viewBox="0 0 24 24" fill="none" style="width: 100%; height: 100%;">
                <g stroke="#00D8FF" stroke-width="1" fill="none">
                    <circle cx="12" cy="12" r="2.05" fill="#00D8FF"/>
                    <ellipse cx="12" cy="12" rx="11" ry="4.2"/>
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)"/>
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)"/>
                </g>
            </svg>`,

            node: `<svg viewBox="0 0 512 512" fill="none" style="width: 100%; height: 100%;">
                <path d="M255.878 52.608c-5.12 0-10.24 1.365-14.677 3.755L94.87 131.9c-9.216 5.12-14.677 14.677-14.677 25.259v175.342c0 10.581 5.461 20.138 14.677 25.259l146.33 75.537c4.437 2.39 9.557 3.755 14.677 3.755s10.24-1.365 14.677-3.755l146.33-75.537c9.216-5.12 14.677-14.677 14.677-25.259V157.16c0-10.581-5.461-20.138-14.677-25.259L270.555 56.363c-4.437-2.39-9.557-3.755-14.677-3.755z" fill="#83CD29"/>
                <path d="M255.878 52.608v384.437c5.12 0 10.24-1.365 14.677-3.755l146.33-75.537c9.216-5.12 14.677-14.677 14.677-25.259V157.16c0-10.581-5.461-20.138-14.677-25.259L270.555 56.363c-4.437-2.39-9.557-3.755-14.677-3.755z" fill="#5FA021"/>
                <path d="M351.358 314.88c0 23.893-16.042 30.378-49.835 30.378-12.629 0-28.33-2.731-41.301-6.827-3.755-1.365-6.144-5.12-6.144-9.216v-16.384c0-6.144 6.485-10.581 12.288-8.533 10.581 3.755 23.552 6.144 34.816 6.144 18.091 0 24.576-4.096 24.576-13.653 0-5.803-2.39-10.24-15.36-13.312l-33.451-8.533c-22.528-5.803-36.181-18.091-36.181-42.325 0-27.989 23.552-36.864 49.493-36.864 12.629 0 23.893 1.365 35.157 4.437 4.096 1.024 6.827 4.779 6.827 8.875v15.701c0 5.803-5.803 10.24-11.605 8.875-9.899-2.731-21.163-4.096-30.037-4.096-15.701 0-22.187 4.437-22.187 11.947 0 6.827 3.072 9.899 18.091 13.312l33.109 8.533c23.893 6.144 32.427 19.456 32.427 41.301z" fill="#FFF"/>
            </svg>`,

            claude: `<svg viewBox="0 0 24 24" fill="none" style="width: 100%; height: 100%;">
                <rect width="24" height="24" rx="5" fill="#CC9B7A"/>
                <path d="M8.5 6.5C7.2 8.3 6.5 10.5 6.5 13s.7 4.7 2 6.5c1.2 1.8 2.9 3 4.9 3.5.5.1 1 .2 1.6.2s1.1-.1 1.6-.2c2-.5 3.7-1.7 4.9-3.5 1.3-1.8 2-4 2-6.5s-.7-4.7-2-6.5c-1.2-1.8-2.9-3-4.9-3.5-.5-.1-1-.2-1.6-.2s-1.1.1-1.6.2c-2 .5-3.7 1.7-4.9 3.5z" stroke="#ffffff" stroke-width="1.5" fill="none"/>
                <circle cx="12" cy="13" r="2" fill="#ffffff"/>
            </svg>`,

            cursor: `<svg viewBox="0 0 24 24" fill="none" style="width: 100%; height: 100%;">
                <rect width="24" height="24" rx="5" fill="#000000"/>
                <path d="M7 7L17 12L12 17L7 7Z" fill="url(#cursorGrad)" stroke="#000" stroke-width="0.5"/>
                <defs>
                    <linearGradient id="cursorGrad" x1="7" y1="7" x2="17" y2="17">
                        <stop offset="0%" stop-color="#00BFFF"/>
                        <stop offset="50%" stop-color="#00A3FF"/>
                        <stop offset="100%" stop-color="#0088FF"/>
                    </linearGradient>
                </defs>
            </svg>`,

            chatgpt: `<svg viewBox="0 0 24 24" fill="none" style="width: 100%; height: 100%;">
                <path d="M22.2819 9.8211C22.9577 10.8146 23.3333 11.9973 23.3333 13.25C23.3333 17.3286 20.0619 20.6 15.9833 20.6C15.0406 20.6 14.1363 20.4123 13.3095 20.0667L13.2821 20.0555L7.04991 22.6666L9.14991 16.9C8.56324 16.0146 8.23324 14.9633 8.23324 13.8333C8.23324 9.75469 11.5046 6.48333 15.5832 6.48333C16.9086 6.48333 18.1419 6.86 19.1952 7.52333L19.2119 7.53333L22.2819 9.8211Z" fill="#10A37F"/>
                <path d="M1.66675 13.0833C1.66675 8.55469 5.27141 4.85 9.73341 4.85C11.1367 4.85 12.4501 5.24667 13.5701 5.93333L10.5001 8.22L10.4834 8.23C9.68008 7.82667 8.76675 7.6 7.80008 7.6C4.59008 7.6 1.98341 10.2067 1.98341 13.4167C1.98341 14.7 2.44175 15.8733 3.20008 16.8L1.10008 22.55L7.33341 19.9389C8.16008 20.2856 9.06508 20.4733 10.0084 20.4733C13.2184 20.4733 15.8251 17.8667 15.8251 14.6567C15.8251 14.0733 15.7334 13.5089 15.5634 12.9789L17.6917 11.0478C18.1501 11.9978 18.4084 13.0656 18.4084 14.1889C18.4084 19.2511 14.3367 23.3333 9.28341 23.3333C7.43008 23.3333 5.71008 22.7733 4.27341 21.8156L0.666748 23.3333L2.18341 19.7267C1.22675 18.2889 0.666748 16.5689 0.666748 14.7156C0.666748 14.2733 0.708415 13.8389 0.783415 13.4167C0.933415 13.6167 1.11675 13.7944 1.33341 13.9456V13.0833H1.66675Z" fill="#10A37F"/>
            </svg>`,

            lovable: `<svg viewBox="0 0 24 24" fill="none" style="width: 100%; height: 100%;">
                <defs>
                    <linearGradient id="lovableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF1493"/>
                        <stop offset="100%" stop-color="#FF69B4"/>
                    </linearGradient>
                </defs>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#lovableGrad)" stroke="#FF1493" stroke-width="1"/>
            </svg>`,

            tailwind: `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%; color: #06B6D4;">
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
            </svg>`
        };

        return icons[type] || '';
    }

    getIconColor(type) {
        const colors = {
            html: '#FF6B35',        // Brighter orange (30% increase)
            css: '#2196F3',         // Brighter blue (30% increase)
            javascript: '#FFD700',  // Brighter gold (30% increase)
            react: '#00D8FF',       // Brighter cyan (30% increase)
            node: '#68D391',        // Brighter green (30% increase)
            tailwind: '#06B6D4',    // Keep cyan (already bright)
            claude: '#FF8C69',      // Brighter coral (30% increase)
            cursor: '#00BFFF',      // Brighter sky blue (30% increase)
            chatgpt: '#10A37F',     // Keep teal (authentic brand color)
            lovable: '#FF1493'      // Brighter deep pink (30% increase)
        };

        return colors[type] || '#06B6D4';
    }

    // Helper method to update logos dynamically (can be called from browser console)
    updateLogo(iconType, imagePath) {
        if (CUSTOM_LOGO_PATHS.hasOwnProperty(iconType)) {
            CUSTOM_LOGO_PATHS[iconType] = imagePath;
            // Refresh the display
            this.orbitIcons = [];
            this.createStructure();
            console.log(`✅ Updated ${iconType} logo to: ${imagePath}`);
        } else {
            console.error(`❌ Invalid icon type: ${iconType}. Valid types are: ${Object.keys(CUSTOM_LOGO_PATHS).join(', ')}`);
        }
    }

    setupEventListeners() {
        // Hover listeners are now added to individual icons in createOrbitIcon()
        // No container-level pause/resume needed
    }

    startAnimation() {
        const animate = (currentTime) => {
            if (!this.isPaused) {
                const deltaTime = (currentTime - this.lastTime) / 1000;
                this.lastTime = currentTime;
                this.time += deltaTime;
                this.updatePositions();
            } else {
                this.lastTime = currentTime;
            }

            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    updatePositions() {
        this.orbitIcons.forEach(({ element, config }) => {
            // Skip updating position for hovered icon
            if (element === this.hoveredIcon) {
                return;
            }

            const angle = this.time * config.speed + config.phaseShift;
            const x = Math.cos(angle) * config.orbitRadius;
            const y = Math.sin(angle) * config.orbitRadius;

            element.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
        });
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('orbitingSkillsContainer');
    if (container) {
        new OrbitingSkills('orbitingSkillsContainer');
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrbitingSkills;
}
