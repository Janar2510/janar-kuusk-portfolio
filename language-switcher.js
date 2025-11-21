// Language Switcher with Auto-detection
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.init();
    }

    // Auto-detect browser language
    detectLanguage() {
        // Check localStorage first - always prioritize user's manual selection
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && (savedLang === 'en' || savedLang === 'et')) {
            return savedLang;
        }

        // Check browser language only if no saved preference
        const browserLang = navigator.language || navigator.userLanguage;

        // If Estonian browser, set to Estonian
        if (browserLang.toLowerCase().startsWith('et')) {
            return 'et';
        }

        // Default to English
        return 'en';
    }

    init() {
        // Create and inject toggle button
        this.createToggleButton();

        // Ensure we respect localStorage preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && (savedLang === 'en' || savedLang === 'et')) {
            this.currentLanguage = savedLang;
        }

        // Set initial language
        this.setLanguage(this.currentLanguage, false);

        // Add event listeners
        this.attachEventListeners();

        // Force update after a brief delay to ensure DOM is ready
        setTimeout(() => {
            this.updateContent(this.currentLanguage);
        }, 100);
    }

    createToggleButton() {
        // Check if button already exists
        const existingContainer = document.querySelector('.language-toggle-container');
        if (existingContainer) {
            console.log('Language toggle button already exists, removing old one');
            existingContainer.remove();
        }
        
        const container = document.createElement('div');
        container.className = 'language-toggle-container';
        container.id = 'languageToggleContainer';
        container.innerHTML = `
            <div class="language-toggle" data-language="${this.currentLanguage}" role="button" tabindex="0" aria-label="Switch language">
                <div class="language-options">
                    <span class="language-option ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">EN</span>
                    <span class="language-option ${this.currentLanguage === 'et' ? 'active' : ''}" data-lang="et">ET</span>
                </div>
                <div class="language-indicator"></div>
            </div>
        `;

        document.body.appendChild(container);
        console.log('Language toggle button created');
    }

    attachEventListeners() {
        const container = document.getElementById('languageToggleContainer') || document.querySelector('.language-toggle-container');
        const toggle = container ? container.querySelector('.language-toggle') : null;
        
        if (!container || !toggle) {
            console.error('Language toggle container or button not found!', {container: !!container, toggle: !!toggle});
            // Retry after a short delay
            setTimeout(() => {
                this.attachEventListeners();
            }, 100);
            return;
        }

        // Store reference to this for event handlers
        const self = this;

        // Remove any existing listeners by cloning just the toggle
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        // Create bound handlers
        const clickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Language toggle clicked, current language:', self.currentLanguage);
            const newLang = self.currentLanguage === 'en' ? 'et' : 'en';
            console.log('Switching to:', newLang);
            self.setLanguage(newLang, true);
        };

        const keyHandler = function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const newLang = self.currentLanguage === 'en' ? 'et' : 'en';
                self.setLanguage(newLang, true);
            }
        };

        // Add event listeners directly to the toggle button
        newToggle.addEventListener('click', clickHandler);
        newToggle.addEventListener('keypress', keyHandler);
        
        // Also add to container as backup using event delegation
        container.addEventListener('click', function(e) {
            if (e.target.closest('.language-toggle')) {
                clickHandler(e);
            }
        });
        
        console.log('Language toggle event listeners attached');
    }

    setLanguage(lang, animate = true) {
        if (lang !== 'en' && lang !== 'et') return;

        this.currentLanguage = lang;

        // Save to localStorage FIRST before any updates
        localStorage.setItem('preferredLanguage', lang);
        console.log('Language set to:', lang, 'Saved to localStorage');

        // Update toggle UI
        this.updateToggleUI(lang, animate);

        // Update page content with animation
        if (animate) {
            this.animateContentChange(lang);
        } else {
            this.updateContent(lang);
        }

        // Update document language attribute
        document.documentElement.lang = lang;

        // Force a final update after a short delay to ensure everything is applied
        setTimeout(() => {
            if (this.currentLanguage === lang) {
                this.updateContent(lang);
            }
        }, 150);
    }

    updateToggleUI(lang, animate) {
        const toggle = document.querySelector('.language-toggle');
        const options = document.querySelectorAll('.language-option');
        const indicator = document.querySelector('.language-indicator');

        // Update data attribute
        toggle.setAttribute('data-language', lang);

        // Update active states
        options.forEach(option => {
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // Add pulse animation
        if (animate && indicator) {
            indicator.classList.add('pulse');
            setTimeout(() => indicator.classList.remove('pulse'), 400);
        }
    }

    animateContentChange(lang) {
        // Fade out
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.2s ease';

        setTimeout(() => {
            this.updateContent(lang);

            // Fade in
            document.body.style.opacity = '1';
        }, 200);
    }

    updateContent(lang) {
        // Get translations from window object - try multiple sources
        let translations = window.translations;
        
        // If translations don't exist, try testimonials translations
        if (!translations) {
            translations = window.testimonialsTranslations;
        }
        
        // If still no translations, wait a bit and try again
        if (!translations || !translations[lang]) {
            console.warn('Translations not loaded yet, retrying...', lang);
            console.log('window.translations:', window.translations);
            console.log('window.testimonialsTranslations:', window.testimonialsTranslations);
            
            // Retry after a short delay
            setTimeout(() => {
                this.updateContent(lang);
            }, 200);
            return;
        }
        
        const t = translations[lang];
        console.log('=== Language Switch Debug ===');
        console.log('Switching to language:', lang);
        console.log('Available translation languages:', Object.keys(translations));
        console.log('Translation object (t):', t);
        console.log('t.testimonials exists:', !!t.testimonials);
        if (t.testimonials) {
            console.log('t.testimonials:', t.testimonials);
            console.log('t.testimonials.hero:', t.testimonials.hero);
            console.log('t.testimonials.hero.title1:', t.testimonials.hero?.title1);
        }
        console.log('===========================');

        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        console.log('Found', elements.length, 'elements with data-i18n attribute');
        
        elements.forEach(element => {
            try {
                const key = element.getAttribute('data-i18n');
                if (!key) {
                    console.warn('Element has data-i18n but no key value:', element);
                    return;
                }
                
                console.log('Looking up translation for key:', key);
                let value = this.getNestedValue(t, key);
                console.log('Value from main translations:', value);
                
                // If not found in main translations, try ROI translations
                if (!value && window.roiTranslations && window.roiTranslations[lang]) {
                    value = this.getNestedValue(window.roiTranslations[lang], key);
                    console.log('Value from ROI translations:', value);
                }
                
                // If not found, try testimonials translations directly
                if (!value && window.testimonialsTranslations && window.testimonialsTranslations[lang]) {
                    value = this.getNestedValue(window.testimonialsTranslations[lang], key);
                    console.log('Value from testimonials translations:', value);
                }

                if (value) {
                    // Preserve emoji if present
                    const currentText = element.textContent || '';
                    const emojiMatch = currentText.match(/^[📊💪⚠️🎯🚀📋]/);
                    if (emojiMatch && !value.includes(emojiMatch[0])) {
                        element.textContent = emojiMatch[0] + ' ' + value;
                    } else {
                        element.textContent = value;
                    }
                    console.log('Updated element:', key, 'to:', value);
                } else {
                    console.warn('No translation found for key:', key, 'in language:', lang);
                    console.log('Available keys in t:', Object.keys(t));
                    console.log('t.testimonials:', t.testimonials);
                }
            } catch (error) {
                console.error('Error updating element with data-i18n:', element, error);
            }
        });
        
        // Update ROI calculator specific content if it exists
        if (window.roiCalculator && window.roiCalculator.updateLanguage) {
            setTimeout(() => {
                window.roiCalculator.updateLanguage(lang);
            }, 100);
        }
        
        // Update window.currentLanguage for ROI calculator
        window.currentLanguage = lang;
        
        // Dispatch custom event for testimonials slider
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const value = this.getNestedValue(t, key);

            if (value) {
                element.placeholder = value;
            }
        });

        // Special handling for hero title (gradient spans) - only if hero exists and title is valid
        if (t.hero && t.hero.title && Array.isArray(t.hero.title)) {
            try {
                this.updateHeroTitle(t.hero.title);
            } catch (error) {
                console.warn('Error updating hero title:', error);
            }
        }

        // Update experience cards - only if experience exists
        if (t.experience && t.experience.jobs) {
            this.updateExperienceCards(t.experience.jobs);
        }

        // Update skills section - only if skills exists
        if (t.skills && t.skills.categories) {
            this.updateSkillsSection(t.skills.categories);
        }

        // Update career cards - only if career exists
        if (t.career && t.career.cards) {
            this.updateCareerCards(t.career.cards);
        }

        // Update education cards - only if education exists
        if (t.education && t.education.items) {
            this.updateEducationCards(t.education.items);
        }

        // Update project cards - only if projects exists
        if (t.projects && t.projects.items) {
            this.updateProjectCards(t.projects.items);
        }

        // Update vision points - only if vision exists
        if (t.vision && t.vision.points) {
            this.updateVisionPoints(t.vision.points);
        }

        // Update summary highlights - only if summary exists
        if (t.summary && t.summary.highlights) {
            this.updateSummaryHighlights(t.summary.highlights);
        }

        // Update summary stats - only if summary exists
        if (t.summary && t.summary.stats) {
            this.updateSummaryStats(t.summary.stats);
        }

        // Force update website design section with retry - only if websiteDesign exists
        if (t.websiteDesign) {
            setTimeout(() => {
                const websiteTitle = document.querySelector('[data-i18n="websiteDesign.title"]');
                const websiteSubtitle = document.querySelector('[data-i18n="websiteDesign.subtitle"]');
                if (websiteTitle && t.websiteDesign.title) {
                    websiteTitle.textContent = t.websiteDesign.title;
                    console.log('Updated websiteDesign.title to:', t.websiteDesign.title);
                }
                if (websiteSubtitle && t.websiteDesign.subtitle) {
                    websiteSubtitle.textContent = t.websiteDesign.subtitle;
                    console.log('Updated websiteDesign.subtitle to:', t.websiteDesign.subtitle);
                }
            }, 50);
        }

        // Update video section - only if video exists
        if (t.video) {
            setTimeout(() => {
                const videoTitle = document.querySelector('[data-i18n="video.title"]');
                if (videoTitle && t.video.title) {
                    videoTitle.textContent = t.video.title;
                    console.log('Updated video.title to:', t.video.title);
                }
            }, 50);
        }
    }

    getNestedValue(obj, path) {
        if (!obj || !path) {
            console.warn('getNestedValue: missing obj or path', {obj: !!obj, path});
            return null;
        }
        try {
            const result = path.split('.').reduce((current, key, index, array) => {
                if (current === null || current === undefined) {
                    console.warn(`getNestedValue: null/undefined at key "${key}" (step ${index + 1}/${array.length}) in path:`, path);
                    return null;
                }
                if (!(key in current)) {
                    console.warn(`getNestedValue: key "${key}" not found. Available keys:`, Object.keys(current), 'in path:', path);
                    return undefined;
                }
                return current[key];
            }, obj);
            
            if (result !== undefined && result !== null) {
                console.log('getNestedValue SUCCESS for', path, ':', result);
            } else {
                console.warn('getNestedValue FAILED for', path, '- result is', result);
            }
            return result;
        } catch (error) {
            console.error('Error getting nested value for path:', path, error);
            return null;
        }
    }

    updateHeroTitle(titleArray) {
        if (!titleArray || !Array.isArray(titleArray)) {
            console.warn('updateHeroTitle called with invalid titleArray:', titleArray);
            return;
        }
        
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) {
            // Hero title element doesn't exist on this page (e.g., ROI calculator page)
            return;
        }
        
        try {
            heroTitle.innerHTML = titleArray.map(text =>
                `<span class="gradient-text">${text}</span>`
            ).join('\n                        ');

            // Reinitialize vaporize effect after language change
            if (window.heroVaporize) {
                window.heroVaporize.destroy();
                window.heroVaporize = null;
            }

            // Wait a bit for DOM to update, then reinitialize
            setTimeout(() => {
                if (typeof HeroVaporizeText !== 'undefined') {
                    window.heroVaporize = new HeroVaporizeText(heroTitle, {
                        autoplay: true
                    });
                }
            }, 500);
        } catch (error) {
            console.error('Error in updateHeroTitle:', error);
        }
    }

    updateExperienceCards(jobs) {
        if (!jobs || !Array.isArray(jobs)) {
            return;
        }
        
        const experienceCards = document.querySelectorAll('.experience-spotlight-card');
        if (experienceCards.length === 0) {
            return; // No experience cards on this page
        }

        experienceCards.forEach((card, index) => {
            if (jobs[index]) {
                const job = jobs[index];

                const titleEl = card.querySelector('.experience-header h3');
                if (titleEl && job.title) titleEl.textContent = job.title;

                const periodEl = card.querySelector('.experience-period');
                if (periodEl) periodEl.textContent = job.period;

                const companyEl = card.querySelector('.experience-company');
                if (companyEl) companyEl.textContent = job.company;

                const descEl = card.querySelector('.experience-description');
                if (descEl) descEl.textContent = job.description;

                // Update skill tags
                const skillsContainer = card.querySelector('.experience-skills');
                if (skillsContainer && job.skills) {
                    const skillTags = skillsContainer.querySelectorAll('.skill-tag');
                    skillTags.forEach((tag, i) => {
                        if (job.skills[i]) {
                            tag.textContent = job.skills[i];
                        }
                    });
                }
            }
        });
    }

    updateSkillsSection(categories) {
        if (!categories || !Array.isArray(categories)) {
            return;
        }
        
        const skillCategories = document.querySelectorAll('.skill-category');
        if (skillCategories.length === 0) {
            return; // No skill categories on this page
        }

        skillCategories.forEach((category, index) => {
            if (categories[index]) {
                const cat = categories[index];

                const titleEl = category.querySelector('h3');
                if (titleEl && cat.title) titleEl.textContent = cat.title;

                const skillTags = category.querySelectorAll('.skill-tag');
                skillTags.forEach((tag, i) => {
                    if (cat.skills[i]) {
                        tag.textContent = cat.skills[i];
                    }
                });
            }
        });
    }

    updateCareerCards(cards) {
        if (!cards || !Array.isArray(cards)) {
            return;
        }
        
        const careerCards = document.querySelectorAll('.career-card');
        if (careerCards.length === 0) {
            return; // No career cards on this page
        }

        careerCards.forEach((card, index) => {
            if (cards[index]) {
                const cardData = cards[index];

                const titleEl = card.querySelector('h3');
                if (titleEl && cardData.title) titleEl.textContent = cardData.title;

                const descEl = card.querySelector('p');
                if (descEl) descEl.textContent = cardData.description;
            }
        });
    }

    updateEducationCards(items) {
        if (!items || !Array.isArray(items)) {
            return;
        }
        
        // Education cards now use experience-spotlight-card class for same styling
        const educationCards = document.querySelectorAll('#education .experience-spotlight-card, .education-card, .education-spotlight-card');
        if (educationCards.length === 0) {
            return; // No education cards on this page
        }

        educationCards.forEach((card, index) => {
            if (items[index]) {
                const item = items[index];

                // Check if it's an experience-style card (new format)
                const isExperienceStyle = card.classList.contains('experience-spotlight-card');
                
                if (isExperienceStyle) {
                    const degreeEl = card.querySelector('.experience-spotlight-title, h3');
                    if (degreeEl) degreeEl.textContent = item.degree;

                    const yearEl = card.querySelector('.experience-period');
                    if (yearEl) yearEl.textContent = item.year;

                    const institutionEl = card.querySelector('.experience-company');
                    if (institutionEl) institutionEl.textContent = item.institution;

                    const descEl = card.querySelector('.experience-description');
                    if (descEl) descEl.textContent = item.description;
                } else {
                    // Old format for backward compatibility
                    const degreeEl = card.querySelector('h3, .education-spotlight-title');
                    if (degreeEl) degreeEl.textContent = item.degree;

                    const yearEl = card.querySelector('.education-year, .education-spotlight-year');
                    if (yearEl) yearEl.textContent = item.year;

                    const institutionEl = card.querySelector('.education-institution, .education-spotlight-institution');
                    if (institutionEl) institutionEl.textContent = item.institution;

                    const descEl = card.querySelector('.education-description, .education-spotlight-description');
                    if (descEl) descEl.textContent = item.description;
                }
            }
        });
    }

    updateProjectCards(items) {
        if (!items || !Array.isArray(items)) {
            return;
        }
        
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length === 0) {
            return; // No project cards on this page
        }

        projectCards.forEach((card, index) => {
            if (items[index]) {
                const item = items[index];

                const nameEl = card.querySelector('h3');
                if (nameEl && item.name) nameEl.textContent = item.name;

                const descEl = card.querySelector('p');
                if (descEl) descEl.textContent = item.description;

                const linkEl = card.querySelector('.btn');
                if (linkEl) linkEl.textContent = item.link;

                // Update tech tags
                const techTags = card.querySelectorAll('.tech-tag');
                if (techTags && item.tech) {
                    techTags.forEach((tag, i) => {
                        if (item.tech[i]) {
                            tag.textContent = item.tech[i];
                        }
                    });
                }
            }
        });
    }

    updateVisionPoints(points) {
        if (!points || !Array.isArray(points)) {
            return;
        }
        
        const visionPoints = document.querySelectorAll('.vision-point');
        if (visionPoints.length === 0) {
            return; // No vision points on this page
        }

        visionPoints.forEach((point, index) => {
            if (points[index]) {
                const pointData = points[index];

                const titleEl = point.querySelector('h4');
                if (titleEl && pointData.title) titleEl.textContent = pointData.title;

                const textEl = point.querySelector('p');
                if (textEl) textEl.textContent = pointData.text;
            }
        });
    }

    updateSummaryHighlights(highlights) {
        if (!highlights || typeof highlights !== 'object') {
            return;
        }
        
        const highlightItems = document.querySelectorAll('.highlight-item');
        if (highlightItems.length === 0) {
            return; // No highlight items on this page
        }
        
        const highlightData = [highlights.sales, highlights.digital, highlights.process];

        highlightItems.forEach((item, index) => {
            if (highlightData[index]) {
                const data = highlightData[index];

                const titleEl = item.querySelector('h4');
                if (titleEl && data.title) titleEl.textContent = data.title;

                const textEl = item.querySelector('p');
                if (textEl) textEl.textContent = data.text;
            }
        });
    }

    updateSummaryStats(stats) {
        if (!stats || typeof stats !== 'object') {
            return;
        }
        
        const statItems = document.querySelectorAll('.stat-item');
        if (statItems.length === 0) {
            return; // No stat items on this page
        }
        
        const statsData = [
            { number: stats.years, label: stats.yearsLabel },
            { number: stats.companies, label: stats.companiesLabel },
            { number: stats.languages, label: stats.languagesLabel },
            { number: stats.digital, label: stats.digitalLabel }
        ];

        statItems.forEach((item, index) => {
            if (statsData[index]) {
                const data = statsData[index];

                const numberEl = item.querySelector('.stat-number');
                if (numberEl) numberEl.textContent = data.number;

                const labelEl = item.querySelector('.stat-label');
                if (labelEl) labelEl.textContent = data.label;
            }
        });
    }
}

// Initialize when DOM is ready (only once)
if (!window.languageSwitcherInitialized) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Initializing Language Switcher...');
        if (typeof translations === 'undefined') {
            console.error('Translations object not found! Make sure translations.js is loaded before language-switcher.js');
            return;
        }
        
        // Prevent multiple initializations
        if (window.languageSwitcher) {
            console.warn('Language Switcher already initialized');
            return;
        }
        
        window.languageSwitcher = new LanguageSwitcher();
        window.languageSwitcherInitialized = true;
        console.log('Language Switcher initialized successfully');
    });
}
