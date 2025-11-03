// Workflow Dotted Surface Animation - Vanilla JavaScript/Three.js
// Converted from React component for HTML/CSS/JS portfolio

(function() {
    'use strict';

    function initDottedSurface(containerElement) {
        if (!containerElement || typeof THREE === 'undefined') {
            console.warn('Three.js not loaded or container not found');
            return null;
        }

        const SEPARATION = 150;
        const AMOUNTX = 40;
        const AMOUNTY = 60;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

        // Get container dimensions
        const containerRect = containerElement.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;

        const camera = new THREE.PerspectiveCamera(
            60,
            width / height,
            1,
            10000
        );
        camera.position.set(0, 355, 1220);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.setClearColor(scene.fog.color, 0);

        // Create wrapper for canvas
        const canvasWrapper = document.createElement('div');
        canvasWrapper.style.position = 'absolute';
        canvasWrapper.style.inset = '0';
        canvasWrapper.style.pointerEvents = 'none';
        canvasWrapper.style.zIndex = '1';
        canvasWrapper.style.overflow = 'hidden';
        canvasWrapper.style.borderRadius = 'inherit';
        
        canvasWrapper.appendChild(renderer.domElement);
        containerElement.appendChild(canvasWrapper);

        // Create particles
        const positions = [];
        const colors = [];

        // Create geometry for all particles
        const geometry = new THREE.BufferGeometry();

        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                const y = 0; // Will be animated
                const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

                positions.push(x, y, z);
                // Light gray/white for dark theme
                colors.push(200, 200, 200);
            }
        }

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Create material
        const material = new THREE.PointsMaterial({
            size: 8,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });

        // Create points object
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        let count = 0;
        let animationId;

        // Animation function
        function animate() {
            animationId = requestAnimationFrame(animate);

            const positionAttribute = geometry.attributes.position;
            const positions = positionAttribute.array;

            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    const index = i * 3;

                    // Animate Y position with sine waves
                    positions[index + 1] =
                        Math.sin((ix + count) * 0.3) * 50 +
                        Math.sin((iy + count) * 0.5) * 50;

                    i++;
                }
            }

            positionAttribute.needsUpdate = true;
            renderer.render(scene, camera);
            count += 0.1;
        }

        // Handle resize
        function handleResize() {
            const containerRect = containerElement.getBoundingClientRect();
            const newWidth = containerRect.width;
            const newHeight = containerRect.height;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        }

        // Use ResizeObserver for better resize handling
        let resizeObserver;
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(containerElement);
        } else {
            window.addEventListener('resize', handleResize);
        }

        // Start animation
        animate();

        // Return cleanup function
        return {
            destroy: function() {
                if (resizeObserver) {
                    resizeObserver.disconnect();
                } else {
                    window.removeEventListener('resize', handleResize);
                }

                cancelAnimationFrame(animationId);

                // Clean up Three.js objects
                scene.traverse((object) => {
                    if (object instanceof THREE.Points) {
                        object.geometry.dispose();
                        if (Array.isArray(object.material)) {
                            object.material.forEach((material) => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });

                renderer.dispose();

                if (canvasWrapper && canvasWrapper.parentNode) {
                    canvasWrapper.parentNode.removeChild(canvasWrapper);
                }
            }
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Wait for Three.js to load
            if (typeof THREE !== 'undefined') {
                const container = document.querySelector('.workflow-display-container');
                if (container) {
                    initDottedSurface(container);
                }
            } else {
                // Try again after a delay
                setTimeout(function() {
                    const container = document.querySelector('.workflow-display-container');
                    if (container && typeof THREE !== 'undefined') {
                        initDottedSurface(container);
                    }
                }, 1000);
            }
        });
    } else {
        // DOM already loaded
        setTimeout(function() {
            const container = document.querySelector('.workflow-display-container');
            if (container && typeof THREE !== 'undefined') {
                initDottedSurface(container);
            }
        }, 500);
    }
})();
