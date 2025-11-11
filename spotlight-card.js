// SpotlightCard.js - Vanilla JavaScript implementation

class SpotlightCard {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      spotlightColor: options.spotlightColor || 'rgba(255, 255, 255, 0.25)',
      ...options
    };
    
    this.init();
  }

  init() {
    this._cachedRect = null;
    this._rectInvalid = true; // Force first calculation
    
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    
    // Invalidate rect cache on window resize (throttled)
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.invalidateRect();
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });
  }

  handleMouseMove(e) {
    // Cache rect to avoid repeated forced reflows
    // Only recalculate when element size might have changed
    if (!this._cachedRect || this._rectInvalid) {
      this._cachedRect = this.element.getBoundingClientRect();
      this._rectInvalid = false;
    }
    
    const rect = this._cachedRect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set CSS custom properties for cursor position (used by CSS radial-gradient)
    // Update immediately for responsive spotlight tracking
    this.element.style.setProperty('--mouse-x', `${x}px`);
    this.element.style.setProperty('--mouse-y', `${y}px`);
    this.element.style.setProperty('--spotlight-color', this.options.spotlightColor);
    
    // Also ensure the ::before pseudo-element will be visible on hover
    this.element.classList.add('is-hovering');
    
    // Store position for potential use by other effects
    this.element.dataset.mouseX = x;
    this.element.dataset.mouseY = y;
  }
  
  // Method to invalidate cached rect (call when element might have resized)
  invalidateRect() {
    this._rectInvalid = true;
  }

  handleMouseLeave() {
    // Reset to center position
    this.element.style.setProperty('--mouse-x', '50%');
    this.element.style.setProperty('--mouse-y', '50%');
    this.element.classList.remove('is-hovering');
  }

  destroy() {
    this.element.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }
}

// Education Spotlight Card Component
class EducationSpotlightCard {
  constructor(data) {
    this.data = data;
    this.element = this.render();
    this.spotlightCard = new SpotlightCard(this.element);
  }

  render() {
    const card = document.createElement('div');
    card.className = 'education-spotlight-card';
    card.setAttribute('data-aos', 'fade-up');

    const header = document.createElement('div');
    header.className = 'education-spotlight-header';

    const title = document.createElement('h3');
    title.className = 'education-spotlight-title';
    title.textContent = this.data.title;

    const year = document.createElement('span');
    year.className = 'education-spotlight-year';
    year.textContent = this.data.year;

    header.appendChild(title);
    header.appendChild(year);

    const institution = document.createElement('p');
    institution.className = 'education-spotlight-institution';
    institution.textContent = this.data.institution;

    const description = document.createElement('p');
    description.className = 'education-spotlight-description';
    description.textContent = this.data.description;

    card.appendChild(header);
    card.appendChild(institution);
    card.appendChild(description);

    return card;
  }
}

// Initialize education spotlight cards when DOM is ready
// NOTE: This code is disabled - education cards are now managed by HTML and language-switcher.js
// Keeping this code commented out to preserve the EducationSpotlightCard class for potential future use
/*
document.addEventListener('DOMContentLoaded', function() {
  const educationGrid = document.querySelector('.education-grid');
  
  if (educationGrid) {
    // Education data
    const educationData = [
      {
        title: 'BSc Building Projection & Construction Management',
        year: '2006',
        institution: 'Tallinn University of Technology',
        description: 'Comprehensive study of building design, construction management, and project coordination in the built environment.'
      },
      {
        title: 'GED Building Construction Technology',
        year: '2003',
        institution: 'Olustvere School',
        description: 'Specialized training in building construction technologies and practical construction methods.'
      },
      {
        title: 'High School Diploma',
        year: '1997',
        institution: 'Karksi-Nuia High School',
        description: 'Foundation education with focus on technical and scientific subjects.'
      }
    ];

    // Clear existing content
    educationGrid.innerHTML = '';

    // Create and append spotlight cards
    educationData.forEach((data, index) => {
      const card = new EducationSpotlightCard(data);
      if (index > 0) {
        card.element.setAttribute('data-aos-delay', '100');
      }
      educationGrid.appendChild(card.element);
    });
  }
});
*/

// Initialize all spotlight and tilt effects when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Helper function to add 3D tilt effect to cards
  // This function is called AFTER spotlight is initialized, so they work together
  function addTiltEffect(card) {
    // Check if tilt already exists
    if (card._tiltHandlers) {
      return; // Already has tilt
    }
    
    // Ensure card has transform-style for 3D
    if (!card.style.transformStyle) {
      card.style.transformStyle = 'preserve-3d';
    }
    
    // Cache rect to avoid forced reflows - only recalculate when needed
    let cachedRect = null;
    let rectValid = false;
    
    const updateRect = () => {
      if (!rectValid) {
        cachedRect = card.getBoundingClientRect();
        rectValid = true;
      }
      return cachedRect;
    };
    
    // Invalidate rect cache on resize or scroll
    const invalidateRect = () => {
      rectValid = false;
    };
    
    window.addEventListener('resize', invalidateRect, { passive: true });
    window.addEventListener('scroll', invalidateRect, { passive: true });
    
    const tiltHandler = (e) => {
      // Use requestAnimationFrame to batch updates and avoid forced reflows
      requestAnimationFrame(() => {
        const rect = updateRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation (max ±5 degrees)
        const rotateX = ((y - centerY) / centerY) * 5;
        const rotateY = ((centerX - x) / centerX) * 5;

        // Apply transform
        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-8px)
          scale(1.02)
        `;
      });
    };

    const leaveHandler = () => {
      card.style.transform = `
        perspective(1000px)
        rotateX(0)
        rotateY(0)
        translateY(0)
        scale(1)
      `;
    };

    // Use capture phase to ensure our handlers run
    card.addEventListener('mousemove', tiltHandler, { passive: true, capture: false });
    card.addEventListener('mouseleave', leaveHandler);
    
    // Store handlers for potential cleanup
    card._tiltHandlers = { tiltHandler, leaveHandler };
    card._hasTilt = true;
  }

  // Initialize summary spotlight cards with tilt effect
  setTimeout(() => {
    const summaryCards = document.querySelectorAll('.summary-spotlight-card');
    
    if (summaryCards.length === 0) {
      console.warn('No summary spotlight cards found');
      return;
    }
    
    summaryCards.forEach((card, index) => {
      // Remove any conflicting handlers
      if (card._saleToruHandlers) {
        const handlers = card._saleToruHandlers;
        if (handlers.onMouseMove) {
          card.removeEventListener('mousemove', handlers.onMouseMove);
        }
        if (handlers.onMouseLeave) {
          card.removeEventListener('mouseleave', handlers.onMouseLeave);
        }
        delete card._saleToruHandlers;
      }
      
      // Initialize spotlight (cursor tracking)
      new SpotlightCard(card, {
        spotlightColor: 'rgba(0, 229, 255, 0.2)'
      });

      // Ensure CSS variables are initialized
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
      card.style.transformStyle = 'preserve-3d';

      // Add 3D tilt effect
      addTiltEffect(card);
      
      // Verify initialization
      if (!card._tiltHandlers) {
        console.warn(`Tilt effect not applied to summary card ${index + 1}`);
      }
    });
  }, 200);

  // Initialize experience spotlight cards with tilt effect
  // This includes both experience section cards AND education section cards (they use the same class)
  // Wait a bit to ensure DOM is fully ready and other scripts have loaded
  setTimeout(() => {
    const experienceCards = document.querySelectorAll('.experience-spotlight-card');
    
    if (experienceCards.length === 0) {
      console.warn('No experience spotlight cards found');
      return;
    }
    
    experienceCards.forEach((card, index) => {
      // Remove any existing tilt handlers from saletoru-effects if present
      // We want to use our unified implementation
      if (card._saleToruHandlers) {
        // Remove saletoru handlers but keep the card structure
        const handlers = card._saleToruHandlers;
        if (handlers.onMouseMove) {
          card.removeEventListener('mousemove', handlers.onMouseMove);
        }
        if (handlers.onMouseLeave) {
          card.removeEventListener('mouseleave', handlers.onMouseLeave);
        }
        delete card._saleToruHandlers;
      }
      
      // Initialize spotlight (cursor tracking) - MUST be first
      const spotlight = new SpotlightCard(card, {
        spotlightColor: 'rgba(0, 229, 255, 0.2)'
      });

      // Ensure card has transform-style for 3D effects
      card.style.transformStyle = 'preserve-3d';
      
      // Ensure card has proper CSS variables initialized
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
      
      // Add 3D tilt effect - will work alongside spotlight
      addTiltEffect(card);
      
      // Verify initialization
      if (!card._tiltHandlers) {
        console.warn(`Tilt effect not applied to card ${index + 1}`);
      }
    });
  }, 200);

  // Apply 3D tilt effect to Career cards
  setTimeout(() => {
    const careerCards = document.querySelectorAll('.career-card');
    careerCards.forEach(card => {
      // Add spotlight tracking (cursor following)
      new SpotlightCard(card, {
        spotlightColor: 'rgba(0, 229, 255, 0.2)'
      });

      // Ensure CSS variables are initialized
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
      card.style.transformStyle = 'preserve-3d';

      // Add 3D tilt effect
      addTiltEffect(card);
    });
  }, 100);

  // Apply 3D tilt effect to Skill Category cards
  setTimeout(() => {
    const skillCards = document.querySelectorAll('.skill-category');
    skillCards.forEach(card => {
      // Add spotlight tracking (cursor following)
      new SpotlightCard(card, {
        spotlightColor: 'rgba(0, 229, 255, 0.2)'
      });

      // Ensure CSS variables are initialized
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
      card.style.transformStyle = 'preserve-3d';

      // Add 3D tilt effect
      addTiltEffect(card);
    });
  }, 100);
}); // End of DOMContentLoaded

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpotlightCard, EducationSpotlightCard };
}
