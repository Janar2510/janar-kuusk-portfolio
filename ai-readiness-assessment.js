// AI Readiness Assessment - Main Logic

class AIReadinessAssessment {
    constructor() {
        this.answers = Array(10).fill(0);
        this.results = null;
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.generateQuestions();
        this.setupEventListeners();
        this.setupHeaderNavigation();
        this.setupSpotlightEffects();
    }

    cacheElements() {
        this.questionsContainer = document.getElementById('assessmentQuestions');
        this.calculateBtn = document.getElementById('calculateAssessmentBtn');
        this.resetBtn = document.getElementById('resetAssessmentBtn');
        this.resultsSection = document.getElementById('resultsSection');
        this.scoreValue = document.getElementById('scoreValue');
        this.tierBadge = document.getElementById('tierBadge');
        this.tierDescription = document.getElementById('tierDescription');
        this.strategicSummaryContent = document.getElementById('strategicSummaryContent');
        this.weakAreasContent = document.getElementById('weakAreasContent');
        this.ninetyDayPlanContent = document.getElementById('ninetyDayPlanContent');
        this.roadmapContent = document.getElementById('roadmapContent');
        this.toolsContent = document.getElementById('toolsContent');
    }

    generateQuestions() {
        if (!this.questionsContainer) return;

        const currentLang = window.currentLanguage || 'en';
        const translations = window.aiReadinessTranslations?.[currentLang]?.aiReadiness?.questions || [];
        
        this.questionsContainer.innerHTML = '';

        translations.forEach((question, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';
            questionCard.dataset.questionIndex = index;
            
            questionCard.innerHTML = `
                <div class="question-header">
                    <h3 class="question-title" data-i18n="aiReadiness.questions.${index}.title">${question.title}</h3>
                    <p class="question-explanation" data-i18n="aiReadiness.questions.${index}.explanation">${question.explanation}</p>
                </div>
                <div class="question-buttons">
                    ${[1, 2, 3, 4, 5].map(score => `
                        <button 
                            class="score-button" 
                            data-score="${score}"
                            data-question="${index}"
                            aria-label="Score ${score}"
                        >
                            ${score}
                        </button>
                    `).join('')}
                </div>
            `;
            
            this.questionsContainer.appendChild(questionCard);
        });

        // Setup spotlight effects for question cards
        this.setupQuestionCardSpotlight();
    }

    setupQuestionCardSpotlight() {
        const questionCards = document.querySelectorAll('.question-card');
        
        // Throttle mouse move events for better performance
        let ticking = false;
        
        questionCards.forEach(card => {
            const handleMouseMove = (e) => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        card.style.setProperty('--mouse-x', `${x}px`);
                        card.style.setProperty('--mouse-y', `${y}px`);
                        card.classList.add('is-hovering');
                        
                        ticking = false;
                    });
                    ticking = true;
                }
            };
            
            const handleMouseLeave = () => {
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
                card.classList.remove('is-hovering');
            };
            
            card.addEventListener('mousemove', handleMouseMove, { passive: true });
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    setupEventListeners() {
        // Score button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('score-button')) {
                const questionIndex = parseInt(e.target.dataset.question);
                const score = parseInt(e.target.dataset.score);
                
                this.answers[questionIndex] = score;
                this.updateQuestionButtons(questionIndex, score);
            }
        });

        // Calculate button
        if (this.calculateBtn) {
            this.calculateBtn.addEventListener('click', () => this.calculateScore());
        }

        // Reset button
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.reset());
        }

        // Listen for language changes
        window.addEventListener('languageChanged', (e) => {
            const newLang = e.detail?.language || e.detail?.lang || window.currentLanguage || 'en';
            this.updateLanguage(newLang);
        });
    }

    updateLanguage(lang) {
        // Regenerate questions with new language
        const currentAnswers = [...this.answers];
        this.generateQuestions();
        
        // Restore answers
        this.answers = currentAnswers;
        currentAnswers.forEach((score, index) => {
            if (score > 0) {
                this.updateQuestionButtons(index, score);
            }
        });

        // Update results if they exist
        if (this.results) {
            this.displayResults();
        }
    }

    updateQuestionButtons(questionIndex, selectedScore) {
        const questionCard = document.querySelector(`[data-question-index="${questionIndex}"]`);
        if (!questionCard) return;

        const buttons = questionCard.querySelectorAll('.score-button');
        buttons.forEach(button => {
            const score = parseInt(button.dataset.score);
            if (score === selectedScore) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    }

    calculateScore() {
        // Check if all questions are answered
        const unanswered = this.answers.filter(score => score === 0);
        if (unanswered.length > 0) {
            const currentLang = window.currentLanguage || 'en';
            const message = currentLang === 'et' 
                ? 'Palun vastake kõikidele küsimustele enne arvutamist.'
                : 'Please answer all questions before calculating.';
            alert(message);
            return;
        }

        // Calculate total score
        const total = this.answers.reduce((sum, score) => sum + score, 0);
        const score = Math.round((total / 50) * 100);
        
        // Determine maturity tier
        let tier;
        if (score < 40) tier = 'emerging';
        else if (score < 60) tier = 'developing';
        else if (score < 75) tier = 'established';
        else if (score < 90) tier = 'advanced';
        else tier = 'transformational';

        this.results = {
            score,
            tier,
            answers: [...this.answers]
        };

        this.displayResults();
    }

    displayResults() {
        if (!this.results) return;

        const { score, tier } = this.results;
        const currentLang = window.currentLanguage || 'en';
        const translations = window.aiReadinessTranslations?.[currentLang]?.aiReadiness || {};
        const tierInfo = translations.maturityTiers?.[tier] || {};

        // Update score display
        if (this.scoreValue) {
            this.scoreValue.textContent = score;
        }

        // Update tier badge
        if (this.tierBadge) {
            this.tierBadge.textContent = tierInfo.name || tier;
            this.tierBadge.className = `tier-badge ${tier}`;
        }

        // Update tier description
        if (this.tierDescription) {
            this.tierDescription.textContent = tierInfo.description || '';
        }

        // Generate strategic summary
        this.generateStrategicSummary();

        // Generate weak areas
        this.generateWeakAreas();

        // Generate 90-day plan
        this.generateNinetyDayPlan();

        // Generate 12-month roadmap
        this.generateRoadmap();

        // Generate recommended tools
        this.generateRecommendedTools();

        // Show results section
        if (this.resultsSection) {
            this.resultsSection.style.display = 'block';
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Show reset button
        if (this.resetBtn) {
            this.resetBtn.style.display = 'inline-flex';
        }

        // Hide calculate button or update it
        if (this.calculateBtn) {
            this.calculateBtn.style.display = 'none';
        }
    }

    generateStrategicSummary() {
        if (!this.strategicSummaryContent) return;

        const { score, tier } = this.results;
        const currentLang = window.currentLanguage || 'en';
        const isEstonian = currentLang === 'et';

        let summary = '';

        if (tier === 'emerging') {
            summary = isEstonian
                ? 'Teie organisatsioon on AI valmiduse algstaadiumis. Oluline on alustada põhivõimete ehitamisega: parandage andmete kvaliteeti, looge selge AI strateegia ja investeerige põhilistesse tööriistadesse.'
                : 'Your organization is at the beginning stage of AI readiness. It\'s crucial to start building foundational capabilities: improve data quality, establish a clear AI strategy, and invest in basic tools.';
        } else if (tier === 'developing') {
            summary = isEstonian
                ? 'Teie organisatsioon on arendamise faasis. Teil on mõned AI võimed, kuid vajate standardiseerimist ja paremat integratsiooni. Keskenduge protsesside optimeerimisele ja töötajate koolitamisele.'
                : 'Your organization is in the development phase. You have some AI capabilities but need standardization and better integration. Focus on process optimization and employee training.';
        } else if (tier === 'established') {
            summary = isEstonian
                ? 'Teie organisatsioonil on tugev alus AI valmiduseks. Teil on hea andmete infrastruktuur ja mõned AI rakendused. Nüüd on aeg skaleerida AI algatusi kogu organisatsioonis ja keskenduda täiustatud kasutusjuhtudele.'
                : 'Your organization has a solid foundation for AI readiness. You have good data infrastructure and some AI applications. Now is the time to scale AI initiatives across the organization and focus on advanced use cases.';
        } else if (tier === 'advanced') {
            summary = isEstonian
                ? 'Teie organisatsioon on täiustatud AI valmiduse tasemel. Teil on küpsed AI võimed ja andmepõhine kultuur. Keskenduge optimeerimisele, täiustatud AI rakendustele ja pidevale innovatsioonile.'
                : 'Your organization is at an advanced AI readiness level. You have mature AI capabilities and a data-driven culture. Focus on optimization, advanced AI applications, and continuous innovation.';
        } else {
            summary = isEstonian
                ? 'Teie organisatsioon on transformeerival tasemel. Teil on täielikult integreeritud AI kõigis operatsioonides ja olete tööstuse juht AI kasutuselevõtus. Jätkake innovatsiooniga ja jagage oma kogemusi teiste organisatsioonidega.'
                : 'Your organization is at a transformational level. You have fully integrated AI across all operations and are an industry leader in AI adoption. Continue innovating and share your experiences with other organizations.';
        }

        this.strategicSummaryContent.innerHTML = `<p>${summary}</p>`;
    }

    generateWeakAreas() {
        if (!this.weakAreasContent) return;

        // Find top 3 weakest areas (lowest scores)
        const questionScores = this.answers.map((score, index) => ({
            index,
            score,
            question: index
        }));

        const sorted = questionScores
            .filter(item => item.score > 0)
            .sort((a, b) => a.score - b.score)
            .slice(0, 3);

        const currentLang = window.currentLanguage || 'en';
        const translations = window.aiReadinessTranslations?.[currentLang]?.aiReadiness?.questions || [];

        this.weakAreasContent.innerHTML = sorted.map(item => {
            const question = translations[item.index] || { title: `Question ${item.index + 1}` };
            return `
                <div class="weak-area-item">
                    <span class="weak-area-name">${question.title}</span>
                    <span class="weak-area-score">${item.score}/5</span>
                </div>
            `;
        }).join('') || '<p>All areas are well-developed!</p>';
    }

    generateNinetyDayPlan() {
        if (!this.ninetyDayPlanContent) return;

        const { tier } = this.results;
        const currentLang = window.currentLanguage || 'en';
        const isEstonian = currentLang === 'et';

        let plan = '';

        if (tier === 'emerging' || tier === 'developing') {
            plan = `
                <div class="plan-phase">
                    <div class="plan-phase-title">${isEstonian ? 'Päevad 1-30: Alus' : 'Days 1-30: Foundation'}</div>
                    <ul class="plan-phase-items">
                        <li>${isEstonian ? 'Auditeerige praegust andmete kvaliteeti ja infrastruktuuri' : 'Audit current data quality and infrastructure'}</li>
                        <li>${isEstonian ? 'Looge selge AI strateegia ja visioon' : 'Establish clear AI strategy and vision'}</li>
                        <li>${isEstonian ? 'Valige 1-2 lihtsat AI tööriista testimiseks' : 'Select 1-2 simple AI tools for testing'}</li>
                    </ul>
                </div>
                <div class="plan-phase">
                    <div class="plan-phase-title">${isEstonian ? 'Päevad 31-60: Rakendamine' : 'Days 31-60: Implementation'}</div>
                    <ul class="plan-phase-items">
                        <li>${isEstonian ? 'Parandage andmete kvaliteeti ja tsentraliseerimist' : 'Improve data quality and centralization'}</li>
                        <li>${isEstonian ? 'Koolitage võtmetöötajaid AI põhialuste kohta' : 'Train key employees on AI fundamentals'}</li>
                        <li>${isEstonian ? 'Käivitage esimene AI projekt' : 'Launch first AI project'}</li>
                    </ul>
                </div>
                <div class="plan-phase">
                    <div class="plan-phase-title">${isEstonian ? 'Päevad 61-90: Optimeerimine' : 'Days 61-90: Optimization'}</div>
                    <ul class="plan-phase-items">
                        <li>${isEstonian ? 'Mõõtke esimese projekti tulemusi' : 'Measure first project results'}</li>
                        <li>${isEstonian ? 'Laiendage edukaid algatusi' : 'Scale successful initiatives'}</li>
                        <li>${isEstonian ? 'Looge AI juhtimise raamistik' : 'Establish AI governance framework'}</li>
                    </ul>
                </div>
            `;
        } else {
            plan = `
                <div class="plan-phase">
                    <div class="plan-phase-title">${isEstonian ? 'Päevad 1-30: Täiustamine' : 'Days 1-30: Enhancement'}</div>
                    <ul class="plan-phase-items">
                        <li>${isEstonian ? 'Optimeerige olemasolevaid AI rakendusi' : 'Optimize existing AI applications'}</li>
                        <li>${isEstonian ? 'Integreerige täiustatud AI funktsioone' : 'Integrate advanced AI features'}</li>
                        <li>${isEstonian ? 'Parandage andmete infrastruktuuri' : 'Enhance data infrastructure'}</li>
                    </ul>
                </div>
                <div class="plan-phase">
                    <div class="plan-phase-title">${isEstonian ? 'Päevad 31-60: Skaleerimine' : 'Days 31-60: Scaling'}</div>
                    <ul class="plan-phase-items">
                        <li>${isEstonian ? 'Laiendage AI kogu organisatsioonis' : 'Scale AI across organization'}</li>
                        <li>${isEstonian ? 'Automatiseerige täiustatud töövoogusid' : 'Automate advanced workflows'}</li>
                        <li>${isEstonian ? 'Koolitage kõiki töötajaid' : 'Train all employees'}</li>
                    </ul>
                </div>
                <div class="plan-phase">
                    <div class="plan-phase-title">${isEstonian ? 'Päevad 61-90: Innovatsioon' : 'Days 61-90: Innovation'}</div>
                    <ul class="plan-phase-items">
                        <li>${isEstonian ? 'Eksperimenteerige uute AI tehnoloogiatega' : 'Experiment with new AI technologies'}</li>
                        <li>${isEstonian ? 'Looge AI innovatsioonikeskus' : 'Establish AI innovation center'}</li>
                        <li>${isEstonian ? 'Jagage kogemusi tööstusega' : 'Share experiences with industry'}</li>
                    </ul>
                </div>
            `;
        }

        this.ninetyDayPlanContent.innerHTML = plan;
    }

    generateRoadmap() {
        if (!this.roadmapContent) return;

        const { tier } = this.results;
        const currentLang = window.currentLanguage || 'en';
        const isEstonian = currentLang === 'et';

        const roadmap = `
            <div class="roadmap-quarter">
                <div class="roadmap-quarter-title">${isEstonian ? 'Q1: Alus ja Strateegia' : 'Q1: Foundation & Strategy'}</div>
                <ul class="roadmap-quarter-items">
                    <li>${isEstonian ? 'AI strateegia väljatöötamine' : 'Develop AI strategy'}</li>
                    <li>${isEstonian ? 'Andmete infrastruktuuri parandamine' : 'Improve data infrastructure'}</li>
                    <li>${isEstonian ? 'Esimesed AI projektid' : 'First AI projects'}</li>
                </ul>
            </div>
            <div class="roadmap-quarter">
                <div class="roadmap-quarter-title">${isEstonian ? 'Q2: Rakendamine ja Koolitus' : 'Q2: Implementation & Training'}</div>
                <ul class="roadmap-quarter-items">
                    <li>${isEstonian ? 'AI tööriistade integratsioon' : 'AI tools integration'}</li>
                    <li>${isEstonian ? 'Töötajate koolitusprogrammid' : 'Employee training programs'}</li>
                    <li>${isEstonian ? 'Protsesside automatiseerimine' : 'Process automation'}</li>
                </ul>
            </div>
            <div class="roadmap-quarter">
                <div class="roadmap-quarter-title">${isEstonian ? 'Q3: Skaleerimine ja Optimeerimine' : 'Q3: Scaling & Optimization'}</div>
                <ul class="roadmap-quarter-items">
                    <li>${isEstonian ? 'AI laiendamine kogu organisatsioonis' : 'Scale AI across organization'}</li>
                    <li>${isEstonian ? 'Tulemuste mõõtmine ja optimeerimine' : 'Measure and optimize results'}</li>
                    <li>${isEstonian ? 'Täiustatud AI funktsioonid' : 'Advanced AI features'}</li>
                </ul>
            </div>
            <div class="roadmap-quarter">
                <div class="roadmap-quarter-title">${isEstonian ? 'Q4: Innovatsioon ja Tulevik' : 'Q4: Innovation & Future'}</div>
                <ul class="roadmap-quarter-items">
                    <li>${isEstonian ? 'Uute tehnoloogiatega eksperimenteerimine' : 'Experiment with new technologies'}</li>
                    <li>${isEstonian ? 'AI kultuuri arendamine' : 'Develop AI culture'}</li>
                    <li>${isEstonian ? 'Järgmise aasta strateegia' : 'Next year strategy'}</li>
                </ul>
            </div>
        `;

        this.roadmapContent.innerHTML = roadmap;
    }

    generateRecommendedTools() {
        if (!this.toolsContent) return;

        const { tier } = this.results;
        const currentLang = window.currentLanguage || 'en';
        const isEstonian = currentLang === 'et';

        let tools = [];

        if (tier === 'emerging' || tier === 'developing') {
            tools = [
                { name: 'ChatGPT / Claude', description: isEstonian ? 'Vestlusrobotid tootlikkuse parandamiseks' : 'Chatbots for productivity improvement' },
                { name: 'n8n / Zapier', description: isEstonian ? 'Töövoogude automatiseerimine' : 'Workflow automation' },
                { name: 'Google Analytics', description: isEstonian ? 'Andmeanalüüs ja mõõtmine' : 'Data analytics and measurement' },
                { name: 'Notion / Airtable', description: isEstonian ? 'Andmete haldus ja organisatsioon' : 'Data management and organization' }
            ];
        } else if (tier === 'established') {
            tools = [
                { name: 'Custom AI Solutions', description: isEstonian ? 'Kohandatud AI lahendused' : 'Custom AI solutions' },
                { name: 'Advanced CRM/ERP', description: isEstonian ? 'Täiustatud CRM/ERP süsteemid' : 'Advanced CRM/ERP systems' },
                { name: 'Data Warehouses', description: isEstonian ? 'Andmelaod analüüsiks' : 'Data warehouses for analytics' },
                { name: 'ML Platforms', description: isEstonian ? 'Masinõppe platvormid' : 'Machine learning platforms' }
            ];
        } else {
            tools = [
                { name: 'Enterprise AI Platforms', description: isEstonian ? 'Ettevõtte AI platvormid' : 'Enterprise AI platforms' },
                { name: 'Custom ML Models', description: isEstonian ? 'Kohandatud ML mudelid' : 'Custom ML models' },
                { name: 'AI Governance Tools', description: isEstonian ? 'AI juhtimise tööriistad' : 'AI governance tools' },
                { name: 'Advanced Analytics', description: isEstonian ? 'Täiustatud analüütika' : 'Advanced analytics' }
            ];
        }

        this.toolsContent.innerHTML = tools.map(tool => `
            <div class="tool-item">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description}</div>
            </div>
        `).join('');
    }

    reset() {
        this.answers = Array(10).fill(0);
        this.results = null;

        // Reset all buttons
        document.querySelectorAll('.score-button').forEach(button => {
            button.classList.remove('selected');
        });

        // Hide results
        if (this.resultsSection) {
            this.resultsSection.style.display = 'none';
        }

        // Show calculate button
        if (this.calculateBtn) {
            this.calculateBtn.style.display = 'inline-flex';
        }

        // Hide reset button
        if (this.resetBtn) {
            this.resetBtn.style.display = 'none';
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setupHeaderNavigation() {
        const header = document.querySelector('.portfolio-header');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mainNav = document.querySelector('.main-nav');
        const navOverlay = document.getElementById('navOverlay');

        if (!header) return;

        // Header scroll effect - visible only at top of page, disappears when scrolling
        const topThreshold = 10; // Show header when within 10px of top
        
        // Function to check scroll position and update header visibility
        const checkScrollPosition = () => {
            const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScrollY <= topThreshold) {
                // Show header - use both classes and direct styles for reliability
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
                header.style.setProperty('transform', 'translateY(0)', 'important');
                header.style.setProperty('opacity', '1', 'important');
                header.style.setProperty('visibility', 'visible', 'important');
            } else {
                // Hide header when scrolled down - use both classes and direct styles
                header.classList.remove('header-visible');
                header.classList.add('header-hidden');
                header.style.setProperty('transform', 'translateY(-100%)', 'important');
                header.style.setProperty('opacity', '0', 'important');
                header.style.setProperty('visibility', 'hidden', 'important');
            }
        };
        
        // Set initial state - hidden, then check after page settles
        header.style.setProperty('transform', 'translateY(-100%)', 'important');
        header.style.setProperty('opacity', '0', 'important');
        header.style.setProperty('visibility', 'hidden', 'important');
        
        // Check initial state after a delay to allow page to settle
        setTimeout(() => {
            checkScrollPosition();
        }, 100);
        
        // Set up scroll event listener
        let lastScrollTop = -1;
        const scrollHandler = () => {
            const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            // Check if scroll position actually changed
            if (Math.abs(currentScrollY - lastScrollTop) >= 1) {
                checkScrollPosition();
                lastScrollTop = currentScrollY;
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        // Also check on load and resize
        window.addEventListener('load', () => {
            setTimeout(checkScrollPosition, 100);
        });
        window.addEventListener('resize', checkScrollPosition);

        // Mobile menu
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenuToggle.classList.toggle('active');
                mainNav.classList.toggle('active');
                navOverlay.classList.toggle('active');
                document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
            });
        }

        if (navOverlay) {
            navOverlay.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close menu on nav link click
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    navOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    setupSpotlightEffects() {
        // Add spotlight effect to all calculator cards with throttling for performance
        const cards = document.querySelectorAll('.calculator-card');
        
        // Use a single throttled handler for all cards
        let ticking = false;
        
        const handleMouseMove = (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                    card.classList.add('is-hovering');
                    
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        const handleMouseLeave = (e) => {
            const card = e.currentTarget;
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
            card.classList.remove('is-hovering');
        };
        
        cards.forEach(card => {
            card.addEventListener('mousemove', handleMouseMove, { passive: true });
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    }
}

// Make available globally
window.AIReadinessAssessment = AIReadinessAssessment;

