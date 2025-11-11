// ProfileCard Component - Exact implementation from your React code
class ProfileCard {
  constructor(options = {}) {
    this.options = {
      avatarUrl: options.avatarUrl || 'https://i.imgur.com/CQVxu7p.jpg',
      name: options.name || 'Janar Kuusk',
      title: options.title || 'AI Solutions Architect',
      handle: options.handle || 'janarkuusk',
      status: options.status || 'Online',
      contactText: options.contactText || 'Contact Me',
      onContactClick: options.onContactClick || null
    };

    this.cardRef = null;
    this.wrapRef = null;
    this.element = this.render();
    this.initEventListeners();
  }

  // Utility functions for clamping and rounding values
  clamp(value, min = 0, max = 100) {
    return Math.min(Math.max(value, min), max);
  }

  round(value, precision = 3) {
    return parseFloat(value.toFixed(precision));
  }

  // Update CSS variables for tilt transform and gradient based on pointer position
  updateCardTransform(offsetX, offsetY) {
    const card = this.cardRef;
    const wrap = this.wrapRef;
    if (!card || !wrap) return;
    const width = card.clientWidth;
    const height = card.clientHeight;
    const percentX = this.clamp((offsetX / width) * 100);
    const percentY = this.clamp((offsetY / height) * 100);
    const centerX = percentX - 50;
    const centerY = percentY - 50;
    // Set CSS custom properties for transforms and gradient position
    wrap.style.setProperty('--pointer-x', `${percentX}%`);
    wrap.style.setProperty('--pointer-y', `${percentY}%`);
    wrap.style.setProperty('--rotateX', `${this.round(centerY / 4)}deg`);
    wrap.style.setProperty('--rotateY', `${this.round(-centerX / 5)}deg`);
  }

  // Event handlers for pointer movements
  handlePointerMove = (e) => {
    const rect = this.cardRef.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    this.updateCardTransform(offsetX, offsetY);
  };

  handlePointerEnter = () => {
    // Disable transition for immediate response during hover
    if (this.cardRef) {
      this.cardRef.style.transition = 'none';
    }
  };

  handlePointerLeave = () => {
    const card = this.cardRef;
    const wrap = this.wrapRef;
    if (!card || !wrap) return;
    // Re-enable transition for smooth reset
    card.style.transition = '';  // uses CSS .profile-card transition
    // Force reflow to ensure the transition is applied
    void card.offsetWidth;
    // Reset card to initial (centered) state
    wrap.style.setProperty('--pointer-x', '50%');
    wrap.style.setProperty('--pointer-y', '50%');
    wrap.style.setProperty('--rotateX', '0deg');
    wrap.style.setProperty('--rotateY', '0deg');
  };

  // Attach pointer event listeners
  initEventListeners() {
    const card = this.cardRef;
    if (!card) return;
    card.addEventListener('pointerenter', this.handlePointerEnter);
    card.addEventListener('pointermove', this.handlePointerMove);
    card.addEventListener('pointerleave', this.handlePointerLeave);
  }

  // Handle contact button click
  onContact = () => {
    if (this.options.onContactClick) this.options.onContactClick();
  };

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'profile-card-wrap';
    this.wrapRef = wrapper;

    const card = document.createElement('div');
    card.className = 'profile-card';
    this.cardRef = card;

    // Main profile image (large avatar)
    if (this.options.avatarUrl) {
      const avatar = document.createElement('img');
      avatar.src = this.options.avatarUrl;
      avatar.alt = `${this.options.name} avatar`;
      avatar.className = 'profile-card-avatar';
      card.appendChild(avatar);
    }

    // Name and title text
    const name = document.createElement('h3');
    name.className = 'profile-card-name';
    name.textContent = this.options.name.toUpperCase();
    card.appendChild(name);

    const title = document.createElement('p');
    title.className = 'profile-card-title';
    title.textContent = this.options.title;
    card.appendChild(title);

    // Bottom info section with mini avatar, handle, status, and contact button
    const info = document.createElement('div');
    info.className = 'profile-card-info';

    const miniAvatar = document.createElement('img');
    miniAvatar.src = this.options.avatarUrl;
    miniAvatar.alt = `${this.options.name} mini avatar`;
    miniAvatar.className = 'profile-card-avatar-mini';
    miniAvatar.onerror = (e) => {
      // Fallback: if image fails, hide it
      e.target.style.display = 'none';
    };
    info.appendChild(miniAvatar);

    const textContainer = document.createElement('div');
    const handle = document.createElement('div');
    handle.className = 'profile-card-handle';
    handle.textContent = `@${this.options.handle}`;
    textContainer.appendChild(handle);

    const status = document.createElement('div');
    status.className = 'profile-card-status';
    status.textContent = this.options.status;
    textContainer.appendChild(status);
    info.appendChild(textContainer);

    const contactBtn = document.createElement('button');
    contactBtn.className = 'profile-card-contact-btn';
    contactBtn.textContent = this.options.contactText;
    contactBtn.onclick = this.onContact;
    info.appendChild(contactBtn);

    card.appendChild(info);
    wrapper.appendChild(card);

    this.element = wrapper;
    return wrapper;
  }
}

// Initialize Profile Card when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    const profileCard = new ProfileCard({
      avatarUrl: 'https://i.imgur.com/CQVxu7p.jpg',
      name: 'Janar Kuusk',
      title: 'AI Solutions Architect',
      handle: 'janarkuusk',
      status: 'Online',
      contactText: 'Contact Me',
      onContactClick: () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    heroVisual.innerHTML = '';
    heroVisual.appendChild(profileCard.element);
  }
});