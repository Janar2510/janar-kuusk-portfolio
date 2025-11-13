// Workflow Dotted Surface - 3D animated background with Three.js
(() => {
const THREE = window.THREE;

if (!THREE) {
    console.warn('[WorkflowDottedSurface] Three.js not found on window. Include Three.js before workflow-dotted-surface.js.');
    return;
}

class WorkflowDottedSurface {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.animationId = null;
        this.count = 0;

        // Configuration
        this.SEPARATION = 150;
        this.AMOUNTX = 40;
        this.AMOUNTY = 60;

        // Theme helpers
        this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        this.handleColorSchemeChange = this.handleColorSchemeChange.bind(this);

        this.handleResize = this.handleResize.bind(this);

        this.init();
    }

    init() {
        if (!this.container) return;

        const { width, height } = this.getContainerSize();
        if (width === 0 || height === 0) return;

        const colors = this.getThemeColors();

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(colors.fog, 2000, 10000);

        this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
        this.camera.position.set(0, 355, 1220);

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(this.scene.fog.color, 0);

        this.container.appendChild(this.renderer.domElement);

        this.createParticles(colors.particle);

        window.addEventListener('resize', this.handleResize);
        if (typeof this.prefersDarkScheme.addEventListener === 'function') {
            this.prefersDarkScheme.addEventListener('change', this.handleColorSchemeChange);
        } else if (typeof this.prefersDarkScheme.addListener === 'function') {
            // Safari fallback
            this.prefersDarkScheme.addListener(this.handleColorSchemeChange);
        }

        if (typeof ResizeObserver === 'function') {
            this.resizeObserver = new ResizeObserver(() => this.handleResize());
            this.resizeObserver.observe(this.container);
        }

        this.animate();
    }

    getContainerSize() {
        const rect = this.container.getBoundingClientRect();
        return {
            width: rect.width || this.container.offsetWidth || window.innerWidth,
            height: rect.height || this.container.offsetHeight || window.innerHeight,
        };
    }

    getThemeColors() {
        const styles = getComputedStyle(document.documentElement);
        const fog = this.normalizeColor(
            styles.getPropertyValue('--workflow-fog-color') || styles.getPropertyValue('--bg-primary')
        );

        const prefersDark = this.isDarkMode();
        const particleColorValue = prefersDark
            ? styles.getPropertyValue('--workflow-particle-color-dark') || styles.getPropertyValue('--gray-100')
            : styles.getPropertyValue('--workflow-particle-color-light') || styles.getPropertyValue('--gray-800');
        const particle = new THREE.Color(this.normalizeColor(particleColorValue));

        return {
            fog: this.normalizeColor(fog),
            particle,
        };
    }

    normalizeColor(colorValue) {
        const trimmed = (colorValue || '').trim();
        if (!trimmed) {
            return '#000000';
        }
        if (trimmed.startsWith('rgb')) {
            return trimmed;
        }
        if (trimmed.startsWith('#')) {
            return trimmed;
        }
        return `#${trimmed}`;
    }

    isDarkMode() {
        const explicitTheme = document.documentElement.dataset?.theme || document.body.dataset?.theme;
        if (explicitTheme) {
            return explicitTheme === 'dark';
        }
        return this.prefersDarkScheme.matches;
    }

    createParticles(particleColor) {
        const positions = [];
        const colors = [];

        const geometry = new THREE.BufferGeometry();

        for (let ix = 0; ix < this.AMOUNTX; ix++) {
            for (let iy = 0; iy < this.AMOUNTY; iy++) {
                const x = ix * this.SEPARATION - (this.AMOUNTX * this.SEPARATION) / 2;
                const y = 0;
                const z = iy * this.SEPARATION - (this.AMOUNTY * this.SEPARATION) / 2;

                positions.push(x, y, z);
                colors.push(particleColor.r, particleColor.g, particleColor.b);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 6,
            vertexColors: true,
            transparent: true,
            opacity: 0.35,
            sizeAttenuation: true,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    updateParticleColors() {
        if (!this.particles) return;

        const { particle } = this.getThemeColors();
        const colorAttribute = this.particles.geometry.getAttribute('color');
        const array = colorAttribute.array;

        for (let i = 0; i < array.length; i += 3) {
            array[i] = particle.r;
            array[i + 1] = particle.g;
            array[i + 2] = particle.b;
        }

        colorAttribute.needsUpdate = true;
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.particles) return;

        const geometry = this.particles.geometry;
        const positionAttribute = geometry.attributes.position;
        const positions = positionAttribute.array;

        let i = 0;
        for (let ix = 0; ix < this.AMOUNTX; ix++) {
            for (let iy = 0; iy < this.AMOUNTY; iy++) {
                const index = i * 3;
                positions[index + 1] =
                    Math.sin((ix + this.count) * 0.3) * 50 +
                    Math.sin((iy + this.count) * 0.5) * 50;
                i++;
            }
        }

        positionAttribute.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
        this.count += 0.08;
    }

    handleResize() {
        if (!this.container || !this.camera || !this.renderer) return;

        const { width, height } = this.getContainerSize();
        if (width === 0 || height === 0) return;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    handleColorSchemeChange() {
        this.updateParticleColors();
        const { fog } = this.getThemeColors();
        this.scene.fog.color = new THREE.Color(fog);
        this.renderer.setClearColor(this.scene.fog.color, 0);
    }

    destroy() {
        window.removeEventListener('resize', this.handleResize);
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        if (typeof this.prefersDarkScheme.removeEventListener === 'function') {
            this.prefersDarkScheme.removeEventListener('change', this.handleColorSchemeChange);
        } else if (typeof this.prefersDarkScheme.removeListener === 'function') {
            this.prefersDarkScheme.removeListener(this.handleColorSchemeChange);
        }

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.scene) {
            this.scene.traverse((object) => {
                if (object instanceof THREE.Points) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }

        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
    }
}

function initWorkflowDottedSurface() {
    const workflowCard = document.querySelector('.workflow-display-container');

    if (!workflowCard) {
        console.warn('[WorkflowDottedSurface] Container not found: .workflow-display-container');
        return;
    }

    const surfaceContainer = document.createElement('div');
    surfaceContainer.className = 'workflow-dotted-surface';

    workflowCard.prepend(surfaceContainer);

    workflowCard.dataset.hasDottedSurface = 'true';
    if (!workflowCard.style.position || workflowCard.style.position === 'static') {
        workflowCard.style.position = 'relative';
    }

    window.workflowDottedSurface = new WorkflowDottedSurface(surfaceContainer);
    console.log('[WorkflowDottedSurface] Initialized successfully');
}

// Try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkflowDottedSurface);
} else {
    // DOM already loaded, initialize immediately
    initWorkflowDottedSurface();
}

window.WorkflowDottedSurface = WorkflowDottedSurface;
})();
