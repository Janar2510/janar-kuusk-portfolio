// User Guide & FAQ Component

class UserGuideFAQ {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Create modal HTML
        this.createModal();
        // Setup event listeners
        this.setupEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div class="faq-modal" id="faqModal" style="display: none;">
                <div class="faq-overlay"></div>
                <div class="faq-content">
                    <div class="faq-header">
                        <h2 class="faq-title" data-i18n="roi.guideFaqTitle">User Guide & FAQ</h2>
                        <button class="faq-close" id="faqCloseBtn" aria-label="Close">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div class="faq-body">
                        <div class="faq-section">
                            <h3 class="faq-section-title" data-i18n="roi.guideTitle">How to Use</h3>
                            <div class="faq-accordion">
                                <details class="faq-accordion-item">
                                    <summary class="faq-accordion-header">
                                        <span data-i18n="roi.guideStep1Title">Step 1: Enter Financial Inputs</span>
                                        <svg class="faq-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div class="faq-accordion-content">
                                        <p data-i18n="roi.guideStep1">Start by filling in your company's data on the left. Use the sliders for percentages and input numbers directly for costs, employees, etc. The more accurate your data, the better the calculation.</p>
                                    </div>
                                </details>
                                
                                <details class="faq-accordion-item">
                                    <summary class="faq-accordion-header">
                                        <span data-i18n="roi.guideStep2Title">Step 2: Calculate ROI</span>
                                        <svg class="faq-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div class="faq-accordion-content">
                                        <p data-i18n="roi.guideStep2">Once your inputs are set, click "Calculate ROI". This will generate the initial results, including your first-year ROI, net gain, and a projection chart.</p>
                                    </div>
                                </details>
                                
                                <details class="faq-accordion-item">
                                    <summary class="faq-accordion-header">
                                        <span data-i18n="roi.guideStep3Title">Step 3: Get AI Analysis</span>
                                        <svg class="faq-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div class="faq-accordion-content">
                                        <p data-i18n="roi.guideStep3">For deeper insights, click "Get AI Analysis". This provides qualitative review with strengths, risks, and industry-specific suggestions.</p>
                                    </div>
                                </details>
                            </div>
                        </div>
                        
                        <div class="faq-section">
                            <h3 class="faq-section-title" data-i18n="roi.faqTitle">Frequently Asked Questions</h3>
                            <div class="faq-accordion">
                                <details class="faq-accordion-item">
                                    <summary class="faq-accordion-header">
                                        <span data-i18n="roi.faq1Title">How is ROI calculated?</span>
                                        <svg class="faq-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div class="faq-accordion-content">
                                        <p data-i18n="roi.faq1">The First-Year ROI is calculated as (Net Gain / Total Investment) * 100. The Net Gain is your Total Annual Gain (from cost savings and revenue growth) minus the initial and annual costs.</p>
                                    </div>
                                </details>
                                
                                <details class="faq-accordion-item">
                                    <summary class="faq-accordion-header">
                                        <span data-i18n="roi.faq2Title">Where does the benchmark data come from?</span>
                                        <svg class="faq-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div class="faq-accordion-content">
                                        <p data-i18n="roi.faq2">The industry benchmarks are based on aggregated, anonymized data and market research for typical AI implementation results in those sectors. They provide a general comparison point.</p>
                                    </div>
                                </details>
                                
                                <details class="faq-accordion-item">
                                    <summary class="faq-accordion-header">
                                        <span data-i18n="roi.faq3Title">Can I use this for any type of AI project?</span>
                                        <svg class="faq-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div class="faq-accordion-content">
                                        <p data-i18n="roi.faq3">Yes. The calculator is designed to be flexible. Whether you're considering a chatbot, data analysis tool, or automation software, you can model the financial impact by estimating the costs, time savings, and revenue potential.</p>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                    
                    <div class="faq-footer">
                        <button class="btn btn-secondary" id="faqCloseFooterBtn">
                            <span data-i18n="roi.close">Close</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    setupEventListeners() {
        const faqLink = document.getElementById('faqLink');
        const faqModal = document.getElementById('faqModal');
        const faqCloseBtn = document.getElementById('faqCloseBtn');
        const faqCloseFooterBtn = document.getElementById('faqCloseFooterBtn');
        const faqOverlay = faqModal.querySelector('.faq-overlay');

        if (faqLink) {
            faqLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }

        if (faqCloseBtn) {
            faqCloseBtn.addEventListener('click', () => this.close());
        }

        if (faqCloseFooterBtn) {
            faqCloseFooterBtn.addEventListener('click', () => this.close());
        }

        if (faqOverlay) {
            faqOverlay.addEventListener('click', () => this.close());
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        const faqModal = document.getElementById('faqModal');
        if (faqModal) {
            faqModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            this.isOpen = true;

            // Trigger language update if switcher exists
            if (window.languageSwitcher) {
                window.languageSwitcher.updatePageLanguage();
            }
        }
    }

    close() {
        const faqModal = document.getElementById('faqModal');
        if (faqModal) {
            faqModal.style.display = 'none';
            document.body.style.overflow = '';
            this.isOpen = false;
        }
    }
}

// Initialize FAQ on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.userGuideFAQ = new UserGuideFAQ();
});


