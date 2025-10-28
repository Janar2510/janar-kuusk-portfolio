// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton?.textContent || 'Send Message';
        this.init();
    }

    init() {
        if (!this.form) {
            console.error('Contact form not found');
            return;
        }

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.form.checkValidity()) {
            this.form.reportValidity();
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Disable submit button
        this.setButtonState('sending');

        try {
            // Option 1: Use Formspree (recommended - free and easy)
            // Formspree endpoint configured for info@janarkuuskpro.com
            const formspreeEndpoint = 'https://formspree.io/f/xdkpeyln';
            
            // Option 2: Use direct mailto (opens email client)
            // This is the fallback if you don't set up Formspree
            await this.sendViaFormspree(formspreeEndpoint, formData);
            
        } catch (error) {
            console.error('Formspree not configured, using mailto fallback');
            this.sendViaMailto(formData);
        }
    }

    async sendViaFormspree(endpoint, formData) {
        // Check if endpoint is configured
        if (endpoint.includes('YOUR_FORM_ID')) {
            throw new Error('Formspree not configured');
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            this.showSuccess();
            this.form.reset();
        } else {
            throw new Error('Failed to send');
        }
    }

    sendViaMailto(formData) {
        // Fallback: Opens user's email client
        const mailtoLink = `mailto:info@janarkuuskpro.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;
        
        window.location.href = mailtoLink;
        
        // Show success message after a delay
        setTimeout(() => {
            this.showSuccess();
            this.form.reset();
        }, 500);
    }

    setButtonState(state) {
        if (!this.submitButton) return;

        const icon = this.submitButton.querySelector('.btn-icon');
        
        switch(state) {
            case 'sending':
                this.submitButton.disabled = true;
                this.submitButton.innerHTML = `
                    <span>Sending...</span>
                    <svg class="btn-icon spinning" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="60" stroke-dashoffset="40" opacity="0.3"/>
                    </svg>
                `;
                break;
            case 'success':
                this.submitButton.innerHTML = `
                    <span>Message Sent!</span>
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                break;
            case 'error':
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = `
                    <span>Try Again</span>
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                break;
            default:
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = `
                    <span>${this.originalButtonText}</span>
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
        }
    }

    showSuccess() {
        this.setButtonState('success');
        
        // Show success notification
        this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            this.setButtonState('default');
        }, 3000);
    }

    showError(message) {
        this.setButtonState('error');
        this.showNotification(message || 'Failed to send message. Please try again.', 'error');
    }

    showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.form-notification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Insert after form
        this.form.parentNode.insertBefore(notification, this.form.nextSibling);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Contact Form...');
    window.contactForm = new ContactForm();
    console.log('Contact Form initialized');
});

