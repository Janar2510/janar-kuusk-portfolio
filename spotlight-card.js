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
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  handleMouseMove(e) {
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.element.style.setProperty('--mouse-x', `${x}px`);
    this.element.style.setProperty('--mouse-y', `${y}px`);
    this.element.style.setProperty('--spotlight-color', this.options.spotlightColor);
  }

  handleMouseLeave() {
    // Reset to center position
    this.element.style.setProperty('--mouse-x', '50%');
    this.element.style.setProperty('--mouse-y', '50%');
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

  // Initialize summary spotlight cards
  const summaryCards = document.querySelectorAll('.summary-text.summary-spotlight-card, .summary-stats.summary-spotlight-card');
  summaryCards.forEach(card => {
    new SpotlightCard(card, {
      spotlightColor: 'rgba(0, 229, 255, 0.2)'
    });
  });

  // Initialize experience spotlight cards with tilt effect
  const experienceCards = document.querySelectorAll('.experience-spotlight-card');
  experienceCards.forEach(card => {
    // Initialize spotlight
    new SpotlightCard(card, {
      spotlightColor: 'rgba(0, 229, 255, 0.2)'
    });

    // Add 3D tilt effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation (max ±5 degrees)
      const rotateX = ((y - centerY) / centerY) * 5;
      const rotateY = ((centerX - x) / centerX) * 5;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        scale(1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `
        perspective(1000px)
        rotateX(0)
        rotateY(0)
        translateY(0)
        scale(1)
      `;
    });
  });

  // Apply 3D tilt effect to Career cards
  const careerCards = document.querySelectorAll('.career-card');
  careerCards.forEach(card => {
    // Add spotlight tracking
    new SpotlightCard(card, {
      spotlightColor: 'rgba(0, 229, 255, 0.2)'
    });

    // Add 3D tilt effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 5;
      const rotateY = ((centerX - x) / centerX) * 5;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        scale(1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `
        perspective(1000px)
        rotateX(0)
        rotateY(0)
        translateY(0)
        scale(1)
      `;
    });
  });

  // Apply 3D tilt effect to Skill Category cards
  const skillCards = document.querySelectorAll('.skill-category');
  skillCards.forEach(card => {
    // Add spotlight tracking
    new SpotlightCard(card, {
      spotlightColor: 'rgba(0, 229, 255, 0.2)'
    });

    // Add 3D tilt effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 5;
      const rotateY = ((centerX - x) / centerX) * 5;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        scale(1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `
        perspective(1000px)
        rotateX(0)
        rotateY(0)
        translateY(0)
        scale(1)
      `;
    });
  });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpotlightCard, EducationSpotlightCard };
}
