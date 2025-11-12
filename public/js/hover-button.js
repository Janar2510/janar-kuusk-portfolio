// HoverButton - Vanilla JS implementation with glow effect
// Consistent styling with Education & Certifications cards
class HoverButton {
  constructor() {
    this.buttons = [];
    this.init();
  }

  init() {
    // Find all buttons on the page
    const buttonSelectors = [
      '.btn',
      '.btn-primary',
      '.btn-secondary',
      '.btn-outline',
      'button[type="submit"]',
      '.hero-actions button'
    ];

    buttonSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(button => {
        if (!this.buttons.includes(button)) {
          this.setupButton(button);
          this.buttons.push(button);
        }
      });
    });

    console.log(`Initialized ${this.buttons.length} hover buttons`);
  }

  setupButton(button) {
    // Skip if already set up
    if (button.dataset.hoverButtonInit) return;
    button.dataset.hoverButtonInit = 'true';

    // Determine button type and set colors accordingly
    const isPrimary = button.classList.contains('btn-primary');
    const isSecondary = button.classList.contains('btn-secondary');
    const isOutline = button.classList.contains('btn-outline');

    // Colors matching Education & Certifications cards (cyan glow)
    const glowColor = '#00e5ff'; // Cyan glow like the cards
    const backgroundColor = isPrimary ? '#111827' : (isSecondary || isOutline ? 'transparent' : '#111827');
    const textColor = isPrimary ? '#ffffff' : '#00e5ff';
    const hoverTextColor = '#67e8f9'; // cyan-300

    // Apply base styles
    this.applyBaseStyles(button, backgroundColor, textColor);

    // Create glow element
    const glowDiv = document.createElement('div');
    glowDiv.className = 'button-glow-effect';
    glowDiv.style.cssText = `
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translate(-50%, -50%) scale(0);
      background: radial-gradient(circle, ${glowColor} 10%, transparent 70%);
      z-index: 0;
    `;
    
    // Make button position relative if not already
    if (getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }
    button.style.overflow = 'hidden';
    
    // Insert glow div as first child
    button.insertBefore(glowDiv, button.firstChild);

    // Ensure button content is above glow
    Array.from(button.children).forEach(child => {
      if (child !== glowDiv && !child.classList.contains('button-glow-effect')) {
        child.style.position = 'relative';
        child.style.zIndex = '10';
      }
    });

    // Track hover state
    let isHovered = false;

    // Mouse move handler
    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      glowDiv.style.left = `${x}px`;
      glowDiv.style.top = `${y}px`;
    };

    // Mouse enter handler
    const handleMouseEnter = () => {
      isHovered = true;
      glowDiv.style.opacity = '0.5';
      glowDiv.style.transform = 'translate(-50%, -50%) scale(1.2)';
      
      // Update text color on hover
      if (!button.dataset.originalColor) {
        button.dataset.originalColor = button.style.color || textColor;
      }
      button.style.color = hoverTextColor;
      
      // Add border glow effect like the cards
      button.style.borderColor = 'rgba(0, 229, 255, 0.5)';
      button.style.boxShadow = `
        0 0 20px rgba(0, 229, 255, 0.3),
        0 0 40px rgba(0, 229, 255, 0.2),
        inset 0 0 20px rgba(0, 229, 255, 0.1)
      `;
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      isHovered = false;
      glowDiv.style.opacity = '0';
      glowDiv.style.transform = 'translate(-50%, -50%) scale(0)';
      
      // Restore original text color
      if (button.dataset.originalColor) {
        button.style.color = button.dataset.originalColor;
      }
      
      // Remove border glow
      button.style.borderColor = '';
      button.style.boxShadow = '';
    };

    // Add event listeners
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    // Store cleanup function
    button._hoverButtonCleanup = () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      if (glowDiv.parentNode) {
        glowDiv.parentNode.removeChild(glowDiv);
      }
    };
  }

  applyBaseStyles(button, backgroundColor, textColor) {
    // Ensure consistent base styles matching the cards
    const currentStyles = getComputedStyle(button);
    
    // Apply or preserve background
    if (!button.style.backgroundColor) {
      button.style.backgroundColor = backgroundColor;
    }
    
    // Set text color (NO PURPLE)
    button.style.color = textColor;
    
    // Add border matching the card style
    if (!button.style.border || button.style.border === 'none') {
      button.style.border = '1px solid #222';
    }
    
    // Ensure smooth transitions
    button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Add hover lift effect like the cards
    button.style.transform = button.style.transform || 'translateY(0)';
    
    // Store original transform for hover
    button.dataset.originalTransform = button.style.transform;
  }

  destroy() {
    this.buttons.forEach(button => {
      if (button._hoverButtonCleanup) {
        button._hoverButtonCleanup();
      }
    });
    this.buttons = [];
  }

  refresh() {
    this.init();
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.hoverButtonInstance = new HoverButton();
  });
} else {
  window.hoverButtonInstance = new HoverButton();
}

// Export for manual control
window.HoverButton = HoverButton;

