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

        // Set initial language
        this.setLanguage(this.currentLanguage, false);

        // Add event listeners
        this.attachEventListeners();
    }

    createToggleButton() {
        const container = document.createElement('div');
        container.className = 'language-toggle-container';
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
    }

    attachEventListeners() {
        const toggle = document.querySelector('.language-toggle');

        // Click event
        toggle.addEventListener('click', () => {
            const newLang = this.currentLanguage === 'en' ? 'et' : 'en';
            this.setLanguage(newLang, true);
        });

        // Keyboard support (Enter or Space)
        toggle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const newLang = this.currentLanguage === 'en' ? 'et' : 'en';
                this.setLanguage(newLang, true);
            }
        });
    }

    setLanguage(lang, animate = true) {
        if (lang !== 'en' && lang !== 'et') return;

        this.currentLanguage = lang;

        // Save to localStorage
        localStorage.setItem('preferredLanguage', lang);

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
        if (!translations || !translations[lang]) {
            console.error('Translations not loaded or language not found:', lang);
            return;
        }
        
        const t = translations[lang];
        console.log('Switching to language:', lang);

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = this.getNestedValue(t, key);

            if (value) {
                element.textContent = value;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const value = this.getNestedValue(t, key);

            if (value) {
                element.placeholder = value;
            }
        });

        // Special handling for hero title (gradient spans)
        this.updateHeroTitle(t.hero.title);

        // Update experience cards
        this.updateExperienceCards(t.experience.jobs);

        // Update skills section
        this.updateSkillsSection(t.skills.categories);

        // Update career cards
        this.updateCareerCards(t.career.cards);

        // Update education cards
        this.updateEducationCards(t.education.items);

        // Update project cards
        this.updateProjectCards(t.projects.items);

        // Update vision points
        this.updateVisionPoints(t.vision.points);

        // Update summary highlights
        this.updateSummaryHighlights(t.summary.highlights);

        // Update summary stats
        this.updateSummaryStats(t.summary.stats);

        // Update website design section
        if (t.websiteDesign) {
            const websiteTitle = document.querySelector('[data-i18n="websiteDesign.title"]');
            if (websiteTitle && t.websiteDesign.title) {
                websiteTitle.textContent = t.websiteDesign.title;
            }
            const websiteSubtitle = document.querySelector('[data-i18n="websiteDesign.subtitle"]');
            if (websiteSubtitle && t.websiteDesign.subtitle) {
                websiteSubtitle.textContent = t.websiteDesign.subtitle;
            }
        }

        // Update video section
        if (t.video) {
            const videoTitle = document.querySelector('[data-i18n="video.title"]');
            if (videoTitle && t.video.title) {
                videoTitle.textContent = t.video.title;
            }
        }
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    updateHeroTitle(titleArray) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && Array.isArray(titleArray)) {
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
        }
    }

    updateExperienceCards(jobs) {
        const experienceCards = document.querySelectorAll('.experience-spotlight-card');

        experienceCards.forEach((card, index) => {
            if (jobs[index]) {
                const job = jobs[index];

                const titleEl = card.querySelector('.experience-header h3');
                if (titleEl) titleEl.textContent = job.title;

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
        const skillCategories = document.querySelectorAll('.skill-category');

        skillCategories.forEach((category, index) => {
            if (categories[index]) {
                const cat = categories[index];

                const titleEl = category.querySelector('h3');
                if (titleEl) titleEl.textContent = cat.title;

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
        const careerCards = document.querySelectorAll('.career-card');

        careerCards.forEach((card, index) => {
            if (cards[index]) {
                const cardData = cards[index];

                const titleEl = card.querySelector('h3');
                if (titleEl) titleEl.textContent = cardData.title;

                const descEl = card.querySelector('p');
                if (descEl) descEl.textContent = cardData.description;
            }
        });
    }

    updateEducationCards(items) {
        const educationCards = document.querySelectorAll('.education-card, .education-spotlight-card');

        educationCards.forEach((card, index) => {
            if (items[index]) {
                const item = items[index];

                const degreeEl = card.querySelector('h3, .education-spotlight-title');
                if (degreeEl) degreeEl.textContent = item.degree;

                const yearEl = card.querySelector('.education-year, .education-spotlight-year');
                if (yearEl) yearEl.textContent = item.year;

                const institutionEl = card.querySelector('.education-institution, .education-spotlight-institution');
                if (institutionEl) institutionEl.textContent = item.institution;

                const descEl = card.querySelector('.education-description, .education-spotlight-description');
                if (descEl) descEl.textContent = item.description;
            }
        });
    }

    updateProjectCards(items) {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach((card, index) => {
            if (items[index]) {
                const item = items[index];

                const nameEl = card.querySelector('h3');
                if (nameEl) nameEl.textContent = item.name;

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
        const visionPoints = document.querySelectorAll('.vision-point');

        visionPoints.forEach((point, index) => {
            if (points[index]) {
                const pointData = points[index];

                const titleEl = point.querySelector('h4');
                if (titleEl) titleEl.textContent = pointData.title;

                const textEl = point.querySelector('p');
                if (textEl) textEl.textContent = pointData.text;
            }
        });
    }

    updateSummaryHighlights(highlights) {
        const highlightItems = document.querySelectorAll('.highlight-item');
        const highlightData = [highlights.sales, highlights.digital, highlights.process];

        highlightItems.forEach((item, index) => {
            if (highlightData[index]) {
                const data = highlightData[index];

                const titleEl = item.querySelector('h4');
                if (titleEl) titleEl.textContent = data.title;

                const textEl = item.querySelector('p');
                if (textEl) textEl.textContent = data.text;
            }
        });
    }

    updateSummaryStats(stats) {
        const statItems = document.querySelectorAll('.stat-item');
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
