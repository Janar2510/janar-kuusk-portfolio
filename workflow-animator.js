// Workflow Animator - Animated connections showing data flow between nodes
class WorkflowAnimator {
    constructor() {
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        const workflowContainer = document.querySelector('.workflow-nodes');
        if (!workflowContainer) return;
        
        // Create canvas for connections
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'workflow-connections-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        workflowContainer.parentNode.style.position = 'relative';
        workflowContainer.parentNode.insertBefore(this.canvas, workflowContainer);
        
        this.ctx = this.canvas.getContext('2d');
        
        // Wait for nodes to be rendered
        setTimeout(() => {
            this.setupNodes();
            this.resizeCanvas();
            this.animate();
        }, 500);
        
        // Handle resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    setupNodes() {
        const nodeElements = document.querySelectorAll('.workflow-node');
        this.nodes = Array.from(nodeElements).map((element, index) => {
            const rect = element.getBoundingClientRect();
            const containerRect = element.parentNode.getBoundingClientRect();
            
            return {
                element,
                index,
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2,
                active: false
            };
        });
        
        // Create connections between sequential nodes
        for (let i = 0; i < this.nodes.length - 1; i++) {
            this.connections.push({
                from: this.nodes[i],
                to: this.nodes[i + 1],
                particles: []
            });
        }
        
        // Start the workflow loop
        this.startWorkflowLoop();
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        const parent = this.canvas.parentNode;
        const rect = parent.getBoundingClientRect();
        
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Update node positions
        if (this.nodes.length > 0) {
            this.setupNodes();
        }
    }
    
    startWorkflowLoop() {
        let currentNodeIndex = 0;
        
        const activateNextNode = () => {
            if (currentNodeIndex < this.nodes.length) {
                const node = this.nodes[currentNodeIndex];
                
                // Activate node
                node.active = true;
                node.element.classList.add('active');
                
                // Create particle if there's a connection
                if (currentNodeIndex < this.connections.length) {
                    const connection = this.connections[currentNodeIndex];
                    this.createParticle(connection);
                }
                
                // Move to next node
                currentNodeIndex++;
                
                setTimeout(() => {
                    // Deactivate previous node
                    if (currentNodeIndex > 1) {
                        this.nodes[currentNodeIndex - 2].active = false;
                        this.nodes[currentNodeIndex - 2].element.classList.remove('active');
                    }
                    
                    if (currentNodeIndex < this.nodes.length) {
                        activateNextNode();
                    } else {
                        // Reset and loop
                        setTimeout(() => {
                            this.nodes.forEach(node => {
                                node.active = false;
                                node.element.classList.remove('active');
                            });
                            currentNodeIndex = 0;
                            activateNextNode();
                        }, 2000);
                    }
                }, 1500); // Time between each node activation
            }
        };
        
        activateNextNode();
    }
    
    createParticle(connection) {
        const particle = {
            connection,
            progress: 0,
            speed: 0.015,
            size: 4,
            color: 'rgba(142, 45, 226, 0.8)',
            trail: []
        };
        
        this.particles.push(particle);
    }
    
    animate() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(connection => {
            this.drawConnection(connection);
        });
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            particle.progress += particle.speed;
            
            if (particle.progress >= 1) {
                return false; // Remove completed particles
            }
            
            this.drawParticle(particle);
            return true;
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnection(connection) {
        const { from, to } = connection;
        
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = 'rgba(142, 45, 226, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw arrow
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const arrowSize = 8;
        
        this.ctx.save();
        this.ctx.translate(to.x, to.y);
        this.ctx.rotate(angle);
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-arrowSize, -arrowSize / 2);
        this.ctx.lineTo(-arrowSize, arrowSize / 2);
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(142, 45, 226, 0.3)';
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawParticle(particle) {
        const { from, to } = particle.connection;
        
        // Calculate current position
        const x = from.x + (to.x - from.x) * particle.progress;
        const y = from.y + (to.y - from.y) * particle.progress;
        
        // Add to trail
        particle.trail.push({ x, y });
        if (particle.trail.length > 10) {
            particle.trail.shift();
        }
        
        // Draw trail
        particle.trail.forEach((point, index) => {
            const alpha = (index / particle.trail.length) * 0.8;
            const size = (index / particle.trail.length) * particle.size;
            
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(142, 45, 226, ${alpha})`;
            this.ctx.fill();
        });
        
        // Draw main particle
        this.ctx.beginPath();
        this.ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.shadowColor = 'rgba(142, 45, 226, 0.8)';
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for workflow nodes to be created
    setTimeout(() => {
        const workflowNodes = document.querySelector('.workflow-nodes');
        if (workflowNodes && workflowNodes.children.length > 0) {
            window.workflowAnimator = new WorkflowAnimator();
        }
    }, 1000);
});

export { WorkflowAnimator };

