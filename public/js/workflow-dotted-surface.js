// Workflow Dotted Surface - 3D animated background with Three.js
// Uses global THREE from CDN

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
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        // Get container dimensions
        const rect = this.container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0a0a0a, 2000, 10000);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            60,
            width / height,
            1,
            10000
        );
        this.camera.position.set(0, 355, 1220);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(this.scene.fog.color, 0);
        
        this.container.appendChild(this.renderer.domElement);
        
        // Create particles
        this.createParticles();
        
        // Handle resize
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
        
        // Start animation
        this.animate();
    }
    
    createParticles() {
        const positions = [];
        const colors = [];
        
        // Create geometry for all particles
        const geometry = new THREE.BufferGeometry();
        
        for (let ix = 0; ix < this.AMOUNTX; ix++) {
            for (let iy = 0; iy < this.AMOUNTY; iy++) {
                const x = ix * this.SEPARATION - (this.AMOUNTX * this.SEPARATION) / 2;
                const y = 0; // Will be animated
                const z = iy * this.SEPARATION - (this.AMOUNTY * this.SEPARATION) / 2;
                
                positions.push(x, y, z);
                
                // Purple-ish color for brand consistency
                colors.push(142, 45, 226); // RGB values
            }
        }
        
        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );
        geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3)
        );
        
        // Create material
        const material = new THREE.PointsMaterial({
            size: 6,
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            sizeAttenuation: true,
        });
        
        // Create points object
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
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
                
                // Animate Y position with sine waves
                positions[index + 1] =
                    Math.sin((ix + this.count) * 0.3) * 50 +
                    Math.sin((iy + this.count) * 0.5) * 50;
                
                i++;
            }
        }
        
        positionAttribute.needsUpdate = true;
        
        this.renderer.render(this.scene, this.camera);
        this.count += 0.05; // Slower wave motion
    }
    
    handleResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        
        const rect = this.container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    destroy() {
        window.removeEventListener('resize', this.handleResize);
        
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const workflowContainer = document.querySelector('.workflow-display-container');
    
    if (workflowContainer) {
        // Create container for dotted surface
        const surfaceContainer = document.createElement('div');
        surfaceContainer.className = 'workflow-dotted-surface';
        surfaceContainer.style.position = 'absolute';
        surfaceContainer.style.top = '0';
        surfaceContainer.style.left = '0';
        surfaceContainer.style.width = '100%';
        surfaceContainer.style.height = '100%';
        surfaceContainer.style.zIndex = '0';
        surfaceContainer.style.pointerEvents = 'none';
        
        // Insert at the beginning of the container (behind other content)
        workflowContainer.insertBefore(surfaceContainer, workflowContainer.firstChild);
        
        // Initialize dotted surface
        window.workflowDottedSurface = new WorkflowDottedSurface(surfaceContainer);
    }
});

// Export to global scope for non-module usage
if (typeof window !== 'undefined') {
    window.WorkflowDottedSurface = WorkflowDottedSurface;
}


