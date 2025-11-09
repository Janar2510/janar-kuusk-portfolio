/**
 * SaleToru Brand Design System - Interactive Effects
 * Provides 3D tilt and spotlight hover effects for cards
 */

class SaleToruEffects {
  constructor() {
    this.init();
  }

  init() {
    this.attachSpotlightEffects();
    this.attachTiltEffects();
  }

  /**
   * Attach spotlight hover effects to all .brand-card and .card-spotlight elements
   */
  attachSpotlightEffects() {
    const spotlightElements = document.querySelectorAll('.brand-card, .card-spotlight, .spotlight-card');
    
    spotlightElements.forEach(element => {
      const handlers = this.createSpotlightHandlers();
      
      element.addEventListener('mousemove', handlers.onMouseMove);
      element.addEventListener('mouseleave', handlers.onMouseLeave);
      
      // Store handlers for cleanup if needed
      element._saleToruHandlers = handlers;
    });
  }

  /**
   * Attach 3D tilt effects to tilt containers
   */
  attachTiltEffects() {
    const tiltContainers = document.querySelectorAll('.tilt-container');
    
    tiltContainers.forEach(container => {
      const handlers = this.createTiltHandlers();
      
      container.addEventListener('mousemove', handlers.onMouseMove);
      container.addEventListener('mouseleave', handlers.onMouseLeave);
      
      // Store handlers for cleanup if needed
      container._saleToruHandlers = handlers;
    });
  }

  /**
   * Create spotlight effect handlers for a single element
   */
  createSpotlightHandlers() {
    return {
      onMouseMove: (e) => {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        
        // Calculate cursor position relative to element
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set CSS variables for spotlight position
        element.style.setProperty('--spotlight-x', `${x}px`);
        element.style.setProperty('--spotlight-y', `${y}px`);
        
        // Add hover class for additional effects
        element.classList.add('is-hovering');
      },
      
      onMouseLeave: (e) => {
        const element = e.currentTarget;
        
        // Reset spotlight to center
        element.style.setProperty('--spotlight-x', '50%');
        element.style.setProperty('--spotlight-y', '50%');
        
        // Remove hover class
        element.classList.remove('is-hovering');
      }
    };
  }

  /**
   * Create 3D tilt effect handlers for a single element
   */
  createTiltHandlers() {
    return {
      onMouseMove: (e) => {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        
        // Calculate position of cursor relative to center of element
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate tilt rotation angles (max 15 degrees)
        const tiltMax = 15;
        const rotateX = ((cardY - centerY) / centerY) * tiltMax * -1; // invert X-axis
        const rotateY = ((cardX - centerX) / centerX) * tiltMax;
        
        // Apply 3D transform
        const transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        element.style.transform = transform;
        
        // Add hover class
        element.classList.add('is-hovering');
      },
      
      onMouseLeave: (e) => {
        const element = e.currentTarget;
        
        // Reset transform
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        
        // Remove hover class
        element.classList.remove('is-hovering');
      }
    };
  }

  /**
   * Apply spotlight effect to a specific element
   */
  applySpotlightToElement(element) {
    if (!element) return;
    
    const handlers = this.createSpotlightHandlers();
    element.addEventListener('mousemove', handlers.onMouseMove);
    element.addEventListener('mouseleave', handlers.onMouseLeave);
    
    // Store handlers for cleanup
    element._saleToruHandlers = handlers;
  }

  /**
   * Apply tilt effect to a specific element
   */
  applyTiltToElement(element) {
    if (!element) return;
    
    const handlers = this.createTiltHandlers();
    element.addEventListener('mousemove', handlers.onMouseMove);
    element.addEventListener('mouseleave', handlers.onMouseLeave);
    
    // Store handlers for cleanup
    element._saleToruHandlers = handlers;
  }

  /**
   * Remove all effects from an element
   */
  removeEffectsFromElement(element) {
    if (!element || !element._saleToruHandlers) return;
    
    const handlers = element._saleToruHandlers;
    element.removeEventListener('mousemove', handlers.onMouseMove);
    element.removeEventListener('mouseleave', handlers.onMouseLeave);
    
    // Reset styles
    element.style.transform = '';
    element.style.setProperty('--spotlight-x', '50%');
    element.style.setProperty('--spotlight-y', '50%');
    element.classList.remove('is-hovering');
    
    delete element._saleToruHandlers;
  }

  /**
   * Reinitialize effects (useful after dynamic content changes)
   */
  reinit() {
    this.attachSpotlightEffects();
    this.attachTiltEffects();
  }

  /**
   * Cleanup all effects
   */
  destroy() {
    const allElements = document.querySelectorAll('.brand-card, .card-spotlight, .spotlight-card, .tilt-container');
    
    allElements.forEach(element => {
      this.removeEffectsFromElement(element);
    });
  }
}

// Utility functions for manual effect application
window.SaleToruEffects = {
  /**
   * Initialize SaleToru effects
   */
  init: () => {
    if (!window.saleToruEffectsInstance) {
      window.saleToruEffectsInstance = new SaleToruEffects();
    }
    return window.saleToruEffectsInstance;
  },

  /**
   * Apply spotlight to specific elements
   */
  applySpotlight: (selector) => {
    const elements = document.querySelectorAll(selector);
    const instance = window.SaleToruEffects.init();
    
    elements.forEach(element => {
      instance.applySpotlightToElement(element);
    });
  },

  /**
   * Apply tilt to specific elements
   */
  applyTilt: (selector) => {
    const elements = document.querySelectorAll(selector);
    const instance = window.SaleToruEffects.init();
    
    elements.forEach(element => {
      instance.applyTiltToElement(element);
    });
  },

  /**
   * Reinitialize effects
   */
  reinit: () => {
    if (window.saleToruEffectsInstance) {
      window.saleToruEffectsInstance.reinit();
    }
  },

  /**
   * Cleanup all effects
   */
  destroy: () => {
    if (window.saleToruEffectsInstance) {
      window.saleToruEffectsInstance.destroy();
      delete window.saleToruEffectsInstance;
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.SaleToruEffects.init();
  });
} else {
  window.SaleToruEffects.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SaleToruEffects;
}



