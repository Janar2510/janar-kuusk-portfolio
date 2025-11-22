// ROI Calculator - Main Logic

class ROICalculator {
    constructor() {
        this.inputs = { ...window.defaultInputs };
        this.results = null;
        this.benchmark = null;
        this.chart = null;
        this.errors = {};
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.updateSliderDisplays();
        this.setupHeaderNavigation();
        this.setupFeedback();
        this.setupAIAnalysis();
        this.setupSpotlightEffects();
    }

    cacheElements() {
        // Input elements
        this.industrySelect = document.getElementById('industry');
        this.customIndustryGroup = document.getElementById('customIndustryGroup');
        this.customIndustryInput = document.getElementById('customIndustry');
        
        this.initialCostInput = document.getElementById('initialCost');
        this.annualCostInput = document.getElementById('annualCost');
        this.numEmployeesInput = document.getElementById('numEmployees');
        this.hoursPerWeekInput = document.getElementById('hoursPerWeek');
        this.hourlyWageInput = document.getElementById('hourlyWage');
        this.timeSavingsInput = document.getElementById('timeSavings');
        this.timeSavingsValue = document.getElementById('timeSavingsValue');
        this.annualRevenueInput = document.getElementById('annualRevenue');
        this.revenueIncreaseInput = document.getElementById('revenueIncrease');
        this.revenueIncreaseValue = document.getElementById('revenueIncreaseValue');

        // Buttons
        this.calculateBtn = document.getElementById('calculateBtn');
        this.getAnalysisBtn = document.getElementById('getAnalysisBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // Result elements
        this.welcomeCard = document.getElementById('welcomeCard');
        this.resultsCard = document.getElementById('resultsCard');
        this.chartCard = document.getElementById('chartCard');
        this.benchmarkCard = document.getElementById('benchmarkCard');
        this.aiAnalysisCard = document.getElementById('aiAnalysisCard');
        this.aiAnalysisContent = document.getElementById('aiAnalysisContent');
        
        // Try to cache modal elements (they might not exist yet if script runs before modal HTML)
        this.cacheModalElements();
    }
    
    cacheModalElements() {
        // Cache modal elements - try to find them if not already cached
        if (!this.aiAnalysisModal) {
            this.aiAnalysisModal = document.getElementById('aiAnalysisModal');
        }
        if (!this.aiAnalysisModalContent) {
            this.aiAnalysisModalContent = document.getElementById('aiAnalysisModalContent');
        }
        if (!this.aiAnalysisModalClose) {
            this.aiAnalysisModalClose = document.getElementById('aiAnalysisModalClose');
        }
        
        console.log('Modal elements cached:', {
            modal: !!this.aiAnalysisModal,
            content: !!this.aiAnalysisModalContent,
            close: !!this.aiAnalysisModalClose
        });
        
        // Feedback elements
        this.feedbackCard = document.getElementById('feedbackCard');
        this.starRating = document.getElementById('starRating');
        this.feedbackComment = document.getElementById('feedbackComment');
        this.submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
        this.feedbackForm = document.getElementById('feedbackForm');
        this.feedbackSubmitted = document.getElementById('feedbackSubmitted');

        this.roiValue = document.getElementById('roiValue');
        this.netGainValue = document.getElementById('netGainValue');
        this.totalGainValue = document.getElementById('totalGainValue');
        this.costSavingsValue = document.getElementById('costSavingsValue');
        this.revenueGainValue = document.getElementById('revenueGainValue');

        this.benchmarkContent = document.getElementById('benchmarkContent');
    }

    setupEventListeners() {
        // Industry selection
        this.industrySelect.addEventListener('change', (e) => {
            this.handleInputChange('industry', e.target.value);
            this.toggleCustomIndustry(e.target.value === 'custom');
        });

        this.customIndustryInput.addEventListener('input', (e) => {
            this.handleInputChange('customIndustry', e.target.value);
        });

        // Number inputs
        const numberInputs = [
            { element: this.initialCostInput, field: 'initialCost' },
            { element: this.annualCostInput, field: 'annualCost' },
            { element: this.numEmployeesInput, field: 'numEmployees' },
            { element: this.hoursPerWeekInput, field: 'hoursPerWeek' },
            { element: this.hourlyWageInput, field: 'hourlyWage' },
            { element: this.annualRevenueInput, field: 'annualRevenue' }
        ];

        numberInputs.forEach(({ element, field }) => {
            element.addEventListener('input', (e) => {
                this.handleInputChange(field, parseFloat(e.target.value) || 0);
            });
        });

        // Sliders
        this.timeSavingsInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.handleInputChange('timeSavings', value);
            this.timeSavingsValue.textContent = `${value}%`;
            this.updateSliderBackground(e.target, value);
        });

        this.revenueIncreaseInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.handleInputChange('revenueIncrease', value);
            this.revenueIncreaseValue.textContent = `${value}%`;
            this.updateSliderBackground(e.target, value);
        });

        // Buttons
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.resetBtn.addEventListener('click', () => this.reset());

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.calculate();
            }
        });
    }

    handleInputChange(field, value) {
        this.inputs[field] = value;
        
        if (typeof value === 'number') {
            this.validateInput(field, value);
        }
        
        // Clear results when inputs change
        this.results = null;
        this.benchmark = null;
    }

    validateInput(field, value) {
        const rule = window.validationRules[field];
        const errorElement = document.getElementById(`${field}-error`);
        
        if (!rule || !errorElement) return;

        if (value < rule.min) {
            this.errors[field] = `Value must be at least ${rule.min}.`;
            errorElement.textContent = this.errors[field];
            errorElement.style.display = 'block';
        } else if (value > rule.max) {
            this.errors[field] = `Value must not exceed ${window.formatNumber(rule.max)}.`;
            errorElement.textContent = this.errors[field];
            errorElement.style.display = 'block';
        } else {
            delete this.errors[field];
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    toggleCustomIndustry(show) {
        this.customIndustryGroup.style.display = show ? 'block' : 'none';
    }

    updateSliderDisplays() {
        this.updateSliderBackground(this.timeSavingsInput, this.inputs.timeSavings);
        this.updateSliderBackground(this.revenueIncreaseInput, this.inputs.revenueIncrease);
    }

    updateSliderBackground(slider, value) {
        const percentage = value;
        slider.style.setProperty('--slider-value', `${percentage}%`);
    }

    calculate() {
        if (Object.keys(this.errors).length > 0) {
            alert('Please fix validation errors before calculating.');
            return;
        }

        const {
            initialCost,
            annualCost,
            numEmployees,
            hoursPerWeek,
            hourlyWage,
            timeSavings,
            annualRevenue,
            revenueIncrease
        } = this.inputs;

        // Calculate annual hours saved
        const annualHoursSaved = numEmployees * hoursPerWeek * 52;
        
        // Calculate annual cost savings
        const annualCostSavings = annualHoursSaved * hourlyWage * (timeSavings / 100);
        
        // Calculate annual revenue gain
        const annualRevenueGain = annualRevenue * (revenueIncrease / 100);
        
        // Calculate total annual gain
        const totalAnnualGain = annualCostSavings + annualRevenueGain;
        
        // Calculate first year investment
        const totalFirstYearInvestment = initialCost + annualCost;
        
        // Calculate net first year gain
        const netFirstYearGain = totalAnnualGain - totalFirstYearInvestment;
        
        // Calculate ROI
        const roi = totalFirstYearInvestment > 0 
            ? (netFirstYearGain / totalFirstYearInvestment) * 100 
            : Infinity;

        this.results = {
            roi,
            totalAnnualGain,
            netFirstYearGain,
            annualCostSavings,
            annualRevenueGain
        };

        // Get benchmark if not custom industry
        if (this.inputs.industry !== 'custom') {
            this.benchmark = window.industryBenchmarks[this.inputs.industry];
        } else {
            this.benchmark = null;
        }

        this.displayResults();
        this.createChart();
        if (this.benchmark) {
            this.displayBenchmark();
        }
    }

    displayResults() {
        // Hide welcome card, show results
        this.welcomeCard.style.display = 'none';
        this.resultsCard.style.display = 'block';
        this.chartCard.style.display = 'block';
        
        // Show "Get AI Analysis" button
        if (this.getAnalysisBtn) {
            // Remove hidden class and force display with !important
            this.getAnalysisBtn.classList.remove('hidden');
            // Use setTimeout to ensure it happens after render
            setTimeout(() => {
                if (this.getAnalysisBtn) {
                    this.getAnalysisBtn.style.cssText = 'display: inline-flex !important;';
                }
            }, 0);
        }

        // Update result values
        const roiDisplay = this.results.roi === Infinity 
            ? '∞' 
            : window.formatPercentage(this.results.roi);
        
        this.roiValue.textContent = roiDisplay;
        this.netGainValue.textContent = window.formatCurrency(this.results.netFirstYearGain);
        this.totalGainValue.textContent = window.formatCurrency(this.results.totalAnnualGain);
        this.costSavingsValue.textContent = window.formatCurrency(this.results.annualCostSavings);
        this.revenueGainValue.textContent = window.formatCurrency(this.results.annualRevenueGain);

        // Animate results
        this.animateResults();

        // Don't auto-scroll - keep headline visible
        // User can scroll manually if needed
    }

    animateResults() {
        const resultItems = document.querySelectorAll('.result-item');
        resultItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    createChart() {
        const ctx = document.getElementById('roiChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        // Calculate 5-year projection
        const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
        const data = [];
        
        for (let i = 0; i < 5; i++) {
            const annualReturn = this.results.totalAnnualGain * (i + 1);
            const totalInvestment = this.inputs.initialCost + (this.inputs.annualCost * (i + 1));
            const netReturn = annualReturn - totalInvestment;
            data.push(netReturn);
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Net Return',
                    data: data,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(142, 45, 226, 0.8)');
                        gradient.addColorStop(1, 'rgba(0, 229, 255, 0.8)');
                        return gradient;
                    },
                    borderColor: '#00e5ff',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 17, 26, 0.95)',
                        titleColor: '#00e5ff',
                        bodyColor: '#ffffff',
                        borderColor: '#00e5ff',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: (context) => {
                                return window.formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a1a1aa',
                            callback: (value) => {
                                return window.formatCurrency(value);
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    }
                }
            }
        });
    }

    displayBenchmark() {
        if (!this.benchmark) {
            this.benchmarkCard.style.display = 'none';
            return;
        }

        this.benchmarkCard.style.display = 'block';

        const benchmarkData = [
            {
                label: 'ROI',
                yourValue: this.results.roi,
                avgValue: this.benchmark.avgROI,
                formatter: window.formatPercentage
            },
            {
                label: 'Time Savings',
                yourValue: this.inputs.timeSavings,
                avgValue: this.benchmark.avgTimeSavings,
                formatter: window.formatPercentage
            },
            {
                label: 'Revenue Increase',
                yourValue: this.inputs.revenueIncrease,
                avgValue: this.benchmark.avgRevenueIncrease,
                formatter: window.formatPercentage
            }
        ];

        const html = benchmarkData.map(item => {
            const isAbove = item.yourValue > item.avgValue;
            const comparisonClass = isAbove ? 'above' : 'below';
            const comparisonText = isAbove ? 'Above Average' : 'Below Average';

            return `
                <div class="benchmark-item">
                    <div class="benchmark-label">${item.label}</div>
                    <div class="benchmark-value">${item.formatter(item.yourValue)}</div>
                    <div class="benchmark-comparison ${comparisonClass}">${comparisonText}</div>
                </div>
            `;
        }).join('');

        this.benchmarkContent.innerHTML = html;
    }

    reset() {
        // Reset inputs to defaults
        this.inputs = { ...window.defaultInputs };
        
        // Update UI
        this.industrySelect.value = this.inputs.industry;
        this.customIndustryInput.value = '';
        this.toggleCustomIndustry(false);
        
        this.initialCostInput.value = this.inputs.initialCost;
        this.annualCostInput.value = this.inputs.annualCost;
        this.numEmployeesInput.value = this.inputs.numEmployees;
        this.hoursPerWeekInput.value = this.inputs.hoursPerWeek;
        this.hourlyWageInput.value = this.inputs.hourlyWage;
        this.timeSavingsInput.value = this.inputs.timeSavings;
        this.annualRevenueInput.value = this.inputs.annualRevenue;
        this.revenueIncreaseInput.value = this.inputs.revenueIncrease;

        this.timeSavingsValue.textContent = `${this.inputs.timeSavings}%`;
        this.revenueIncreaseValue.textContent = `${this.inputs.revenueIncrease}%`;
        
        this.updateSliderDisplays();

        // Clear errors
        this.errors = {};
        document.querySelectorAll('.input-error').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });

        // Clear results
        this.results = null;
        this.benchmark = null;
        
        // Show welcome card, hide results
        this.welcomeCard.style.display = 'block';
        this.resultsCard.style.display = 'none';
        this.chartCard.style.display = 'none';
        this.benchmarkCard.style.display = 'none';
        
        // Hide AI analysis and button
        if (this.aiAnalysisCard) {
            this.aiAnalysisCard.style.display = 'none';
        }
        if (this.getAnalysisBtn) {
            this.getAnalysisBtn.classList.add('hidden');
        }

        // Destroy chart
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    setupFeedback() {
        if (!this.starRating || !this.submitFeedbackBtn) return;
        
        let selectedRating = 0;
        let hoverRating = 0;
        
        const stars = this.starRating.querySelectorAll('.star');
        
        // Star hover effect
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                hoverRating = index + 1;
                this.updateStars(stars, hoverRating);
            });
            
            star.addEventListener('click', () => {
                selectedRating = index + 1;
                this.submitFeedbackBtn.disabled = false;
            });
        });
        
        // Reset on mouse leave
        this.starRating.addEventListener('mouseleave', () => {
            hoverRating = 0;
            this.updateStars(stars, selectedRating);
        });
        
        // Submit feedback
        this.submitFeedbackBtn.addEventListener('click', () => {
            const comment = this.feedbackComment.value;
            
            // In a real app, this would send data to a server
            console.log('Feedback submitted:', { rating: selectedRating, comment });
            
            // Show thank you message
            this.feedbackForm.style.display = 'none';
            this.feedbackSubmitted.style.display = 'block';
        });
    }
    
    updateStars(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }
    
    setupAIAnalysis() {
        console.log('setupAIAnalysis called, getAnalysisBtn:', this.getAnalysisBtn); // Debug log
        if (!this.getAnalysisBtn) {
            console.error('getAnalysisBtn not found!'); // Debug log
            return;
        }
        
        this.getAnalysisBtn.addEventListener('click', (e) => {
            console.log('Get Analysis button clicked'); // Debug log
            e.preventDefault();
            this.getAIAnalysis();
        });
        
        // Setup modal close handlers - use event delegation for dynamically created elements
        this.setupModalCloseHandlers();
    }
    
    setupModalCloseHandlers() {
        // Use event delegation on document for close button
        document.addEventListener('click', (e) => {
            // Check if clicked element is the close button or its child
            if (e.target.closest('#aiAnalysisModalClose')) {
                e.preventDefault();
                e.stopPropagation();
                this.closeAIAnalysisModal();
                return;
            }
            
            // Check if clicked on overlay
            if (e.target.classList.contains('ai-analysis-modal-overlay')) {
                this.closeAIAnalysisModal();
                return;
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Try to find modal if not cached
                if (!this.aiAnalysisModal) {
                    this.aiAnalysisModal = document.getElementById('aiAnalysisModal');
                }
                if (this.aiAnalysisModal && this.aiAnalysisModal.style.display !== 'none') {
                    this.closeAIAnalysisModal();
                }
            }
        });
        
        // Also try direct attachment as fallback
        setTimeout(() => {
            this.cacheModalElements();
            if (this.aiAnalysisModalClose) {
                this.aiAnalysisModalClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeAIAnalysisModal();
                });
            }
        }, 100);
    }
    
    openAIAnalysisModal() {
        console.log('openAIAnalysisModal called, modal element:', this.aiAnalysisModal); // Debug log
        
        // Try to find modal if not cached
        if (!this.aiAnalysisModal) {
            this.aiAnalysisModal = document.getElementById('aiAnalysisModal');
        }
        
        if (this.aiAnalysisModal) {
            this.aiAnalysisModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Modal opened'); // Debug log
            
            // Ensure modal content is cached
            if (!this.aiAnalysisModalContent) {
                this.aiAnalysisModalContent = document.getElementById('aiAnalysisModalContent');
                console.log('Modal content cached after opening:', !!this.aiAnalysisModalContent); // Debug log
            }
        } else {
            console.error('aiAnalysisModal element not found!'); // Debug log
        }
    }
    
    closeAIAnalysisModal() {
        // Try to find modal if not cached
        if (!this.aiAnalysisModal) {
            this.aiAnalysisModal = document.getElementById('aiAnalysisModal');
        }
        
        if (this.aiAnalysisModal) {
            this.aiAnalysisModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
            console.log('Modal closed');
        }
    }
    
    async getAIAnalysis() {
        if (!this.results) {
            alert('Please calculate ROI first before getting AI analysis.');
            return;
        }
        
        console.log('getAIAnalysis called'); // Debug log
        
        // Disable button during analysis
        if (this.getAnalysisBtn) {
            this.getAnalysisBtn.disabled = true;
            const analyzingText = window.roiTranslations?.[window.currentLanguage || 'en']?.roi?.analyzing || 'Analyzing...';
            const span = this.getAnalysisBtn.querySelector('span');
            if (span) {
                span.textContent = analyzingText;
            } else {
                this.getAnalysisBtn.textContent = analyzingText;
            }
        }
        
        // Ensure modal elements are cached
        this.cacheModalElements();
        
        // Show AI analysis modal
        console.log('Opening modal, aiAnalysisModal:', this.aiAnalysisModal); // Debug log
        console.log('Modal content element:', this.aiAnalysisModalContent); // Debug log
        this.openAIAnalysisModal();
        
        // Show loading state in modal - use setTimeout to ensure modal is rendered
        setTimeout(() => {
            // Try to find modal content again if not found
            if (!this.aiAnalysisModalContent) {
                this.aiAnalysisModalContent = document.getElementById('aiAnalysisModalContent');
            }
            
            if (this.aiAnalysisModalContent) {
                console.log('Setting loading state in modal'); // Debug log
                this.aiAnalysisModalContent.innerHTML = `
                <div class="ai-analysis-loading">
                    <div class="loading-dots">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                    <span data-i18n="roi.geminiThinking">AI is thinking...</span>
                </div>
            `;
            } else {
                console.error('aiAnalysisModalContent not found!'); // Debug log
            }
        }, 50);
        
        // Also update the hidden card content for PDF export
        if (this.aiAnalysisContent) {
            this.aiAnalysisContent.innerHTML = `
            <div class="ai-analysis-loading">
                <div class="loading-dots">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
                <span data-i18n="roi.geminiThinking">AI is thinking...</span>
            </div>
        `;
        }
        
        // Update translations if language switcher exists
        if (window.languageSwitcher && window.languageSwitcher.updateContent) {
            const currentLang = window.currentLanguage || window.languageSwitcher.currentLanguage || 'en';
            window.languageSwitcher.updateContent(currentLang);
        }
        
        // Try to use real Gemini AI
        try {
            // Wait a moment for config to load if needed
            if (!window.ROI_CALCULATOR_CONFIG) {
                console.warn('ROI_CALCULATOR_CONFIG not loaded yet. Waiting...');
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            // Double-check config is loaded
            if (!window.ROI_CALCULATOR_CONFIG || !window.ROI_CALCULATOR_CONFIG.GEMINI_API_KEY) {
                console.warn('ROI_CALCULATOR_CONFIG or GEMINI_API_KEY not found. Using fallback analysis.');
                this.showFallbackAnalysis();
                return;
            }
            
            if (window.GeminiAIService) {
                const aiService = new window.GeminiAIService();
                
                if (aiService.hasAPIKey()) {
                    // Use real AI
                    const roiData = {
                        inputs: this.inputs,
                        results: this.results,
                        benchmark: this.benchmark
                    };
                    
                    const analysis = await aiService.generateAnalysis(roiData);
                    console.log('Analysis generated, updating modal content'); // Debug log
                    
                    // Ensure modal content element is found
                    if (!this.aiAnalysisModalContent) {
                        this.aiAnalysisModalContent = document.getElementById('aiAnalysisModalContent');
                    }
                    
                    // Update modal content
                    if (this.aiAnalysisModalContent) {
                        console.log('Updating modal content with analysis'); // Debug log
                        console.log('Analysis formatted length:', analysis.formatted ? analysis.formatted.length : 0); // Debug
                        console.log('Analysis formatted preview:', analysis.formatted ? analysis.formatted.substring(0, 200) : 'null'); // Debug
                        
                        if (analysis.formatted && analysis.formatted.length > 0) {
                            this.aiAnalysisModalContent.innerHTML = analysis.formatted;
                            
                            // Setup interactive features
                            setTimeout(() => {
                                this.setupInteractiveFeatures();
                                this.setupPDFExport();
                            }, 100);
                        } else {
                            console.error('Analysis formatted is empty!'); // Debug
                            this.aiAnalysisModalContent.innerHTML = `
                                <div class="ai-analysis-content">
                                    <div class="ai-analysis-section">
                                        <h4>Error</h4>
                                        <p>Unable to generate analysis content. Please try again.</p>
                                    </div>
                                </div>
                            `;
                        }
                    } else {
                        console.error('Cannot update modal content - element not found!'); // Debug log
                    }
                    
                    // Also update hidden card for PDF export
                    if (this.aiAnalysisContent) {
                        this.aiAnalysisContent.innerHTML = analysis.formatted;
                    }
                    
                    // Re-enable button
                    if (this.getAnalysisBtn) {
                        this.getAnalysisBtn.disabled = false;
                        const getAnalysisText = window.roiTranslations?.[window.currentLanguage || 'en']?.roi?.getAnalysis || 'Get AI Analysis';
                        const span = this.getAnalysisBtn.querySelector('span');
                        if (span) {
                            span.textContent = getAnalysisText;
                        }
                    }
                    
                    // Update translations
                    if (window.languageSwitcher && window.languageSwitcher.updateContent) {
                        const currentLang = window.currentLanguage || window.languageSwitcher.currentLanguage || 'en';
                        window.languageSwitcher.updateContent(currentLang);
                    }
                    return;
                } else {
                    // No API key configured - use fallback
                    console.warn('Gemini API key not configured. Using fallback analysis.');
                    this.showFallbackAnalysis();
                    return;
                }
            }
        } catch (error) {
            console.error('AI Analysis Error:', error);
            
            if (error.message === 'API_KEY_REQUIRED') {
                console.warn('API key required but not configured. Using fallback analysis.');
                this.showFallbackAnalysis();
                return;
            }
            
            // Show error but allow fallback
            const useFallback = confirm(
                'Failed to get AI analysis. Error: ' + error.message + '\n\n' +
                'Would you like to see a basic analysis instead?'
            );
            
            if (useFallback) {
                // Fall back to mock analysis
                this.showFallbackAnalysis();
            } else {
                // Re-enable button
                if (this.getAnalysisBtn) {
                    this.getAnalysisBtn.disabled = false;
                    const getAnalysisText = window.roiTranslations?.[window.currentLanguage || 'en']?.roi?.getAnalysis || 'Get AI Analysis';
                    const span = this.getAnalysisBtn.querySelector('span');
                    if (span) {
                        span.textContent = getAnalysisText;
                    }
                }
            }
            return;
        }
        
        // Fallback to mock analysis if AI service not available
        this.showFallbackAnalysis();
    }
    
    showFallbackAnalysis() {
        console.log('showFallbackAnalysis called'); // Debug log
        console.log('Current results:', this.results); // Debug
        console.log('Current inputs:', this.inputs); // Debug
        
        let analysisHTML = '';
        try {
            analysisHTML = this.generateComprehensiveAnalysis();
            console.log('Generated analysis HTML length:', analysisHTML ? analysisHTML.length : 0); // Debug
            console.log('Analysis HTML preview:', analysisHTML ? analysisHTML.substring(0, 300) : 'null'); // Debug
        } catch (error) {
            console.error('Error generating comprehensive analysis:', error);
            analysisHTML = `
                <div class="ai-analysis-content">
                    <div class="ai-analysis-section">
                        <h4>Error</h4>
                        <p>An error occurred while generating the analysis. Please try again.</p>
                        <p>Error: ${error.message}</p>
                    </div>
                </div>
                <div class="ai-analysis-actions">
                    <button id="exportPDFBtn" class="btn btn-primary" data-i18n="roi.exportPDF">
                        📄 Export Analysis as PDF
                    </button>
                    <button id="shareAnalysisBtn" class="btn btn-secondary" data-i18n="roi.shareAnalysis">
                        🔗 Share Analysis
                    </button>
                </div>
            `;
        }
        
        // Ensure modal content element is found
        if (!this.aiAnalysisModalContent) {
            this.aiAnalysisModalContent = document.getElementById('aiAnalysisModalContent');
            console.log('Re-fetched modal content element:', !!this.aiAnalysisModalContent); // Debug
        }
        
        // Update modal content
        if (this.aiAnalysisModalContent) {
            console.log('Updating modal with fallback analysis'); // Debug log
            console.log('Modal content element found:', !!this.aiAnalysisModalContent); // Debug
            console.log('Analysis HTML to insert, length:', analysisHTML ? analysisHTML.length : 0); // Debug
            
            if (analysisHTML && analysisHTML.length > 0) {
                console.log('Setting innerHTML...'); // Debug
                this.aiAnalysisModalContent.innerHTML = analysisHTML;
                console.log('Content inserted, verifying...'); // Debug
                
                // Verify content was set
                setTimeout(() => {
                    const verifyContent = this.aiAnalysisModalContent.innerHTML;
                    console.log('Verification - content length after insert:', verifyContent.length); // Debug
                    if (verifyContent.length < 100) {
                        console.error('Content appears empty after insertion!');
                        // Try again
                        this.aiAnalysisModalContent.innerHTML = analysisHTML;
                    }
                }, 50);
                
                // Setup interactive features
                setTimeout(() => {
                    this.setupInteractiveFeatures();
                    this.setupPDFExport();
                }, 150);
            } else {
                console.error('Analysis HTML is empty!'); // Debug
                this.aiAnalysisModalContent.innerHTML = `
                    <div class="ai-analysis-content">
                        <div class="ai-analysis-section">
                            <h4>Error</h4>
                            <p>Unable to generate analysis content. Please try calculating ROI first.</p>
                        </div>
                    </div>
                `;
            }
        } else {
            console.error('Cannot update modal content - element not found!'); // Debug log
            alert('Error: Modal content element not found. Please refresh the page.');
        }
        
        // Also update hidden card for PDF export
        if (this.aiAnalysisContent) {
            this.aiAnalysisContent.innerHTML = analysisHTML || '<p>No analysis available</p>';
        }
        
        // Re-enable button
        if (this.getAnalysisBtn) {
            this.getAnalysisBtn.disabled = false;
            const getAnalysisText = window.roiTranslations?.[window.currentLanguage || 'en']?.roi?.getAnalysis || 'Get AI Analysis';
            const span = this.getAnalysisBtn.querySelector('span');
            if (span) {
                span.textContent = getAnalysisText;
            }
        }
        
        // Update translations
        if (window.languageSwitcher && window.languageSwitcher.updateContent) {
            const currentLang = window.currentLanguage || window.languageSwitcher.currentLanguage || 'en';
            window.languageSwitcher.updateContent(currentLang);
        }
    }
    
    generateComprehensiveAnalysis() {
        console.log('generateComprehensiveAnalysis called, results:', this.results); // Debug
        console.log('generateComprehensiveAnalysis called, inputs:', this.inputs); // Debug
        
        if (!this.results) {
            console.error('No results available for analysis!');
            return `
                <div class="ai-analysis-content">
                    <div class="ai-analysis-section">
                        <h4>Error</h4>
                        <p>No calculation results available. Please calculate ROI first.</p>
                    </div>
                </div>
                <div class="ai-analysis-actions">
                    <button id="exportPDFBtn" class="btn btn-primary" data-i18n="roi.exportPDF">
                        📄 Export Analysis as PDF
                    </button>
                    <button id="shareAnalysisBtn" class="btn btn-secondary" data-i18n="roi.shareAnalysis">
                        🔗 Share Analysis
                    </button>
                </div>
            `;
        }
        
        const { roi, totalAnnualGain, netFirstYearGain } = this.results;
        const industry = this.inputs.industry === 'custom' ? this.inputs.customIndustry : this.inputs.industry;
        
        // Generate a basic analysis based on the numbers
        let roiAssessment = '';
        if (roi > 100) {
            roiAssessment = 'excellent';
        } else if (roi > 50) {
            roiAssessment = 'strong';
        } else if (roi > 0) {
            roiAssessment = 'positive';
        } else {
            roiAssessment = 'concerning';
        }
        
        const t = window.roiTranslations?.[window.currentLanguage || 'en']?.roi || {};
        
        // Generate interactive metrics
        const metricsHTML = this.generateFallbackMetrics();
        
        return `
            ${metricsHTML}
            <div class="ai-analysis-content">
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.executiveSummary">📊 ${t.executiveSummary || 'Executive Summary'}</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>Your AI investment analysis shows a ${roiAssessment} ROI of ${isFinite(roi) ? roi.toFixed(1) : 'infinite'}% for the first year. With a total annual gain of ${window.formatCurrency(totalAnnualGain)} and net first-year gain of ${window.formatCurrency(netFirstYearGain)}, this investment demonstrates ${roi > 50 ? 'substantial' : 'moderate'} potential for value creation.</p>
                    </div>
                </div>
                
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.keyStrengths">💪 ${t.keyStrengths || 'Key Strengths'}</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>
                            • Cost savings from productivity improvements provide a solid foundation for ROI<br>
                            • Revenue growth projections add upside potential<br>
                            • ${this.inputs.numEmployees} employees benefiting from time savings creates compound value
                        </p>
                    </div>
                </div>
                
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.potentialRisks">⚠️ ${t.potentialRisks || 'Potential Risks & Considerations'}</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>
                            • Initial setup costs require careful planning and execution<br>
                            • Actual time savings may vary based on adoption rates<br>
                            • Revenue projections depend on successful implementation and market conditions
                        </p>
                    </div>
                </div>
                
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.implementationSuggestions">🎯 ${t.implementationSuggestions || 'Implementation Suggestions'}</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>
                            1. Start with a pilot program to validate time savings assumptions<br>
                            2. Invest in proper training to maximize employee adoption<br>
                            3. Monitor KPIs closely during the first 90 days to ensure you're on track
                        </p>
                    </div>
                </div>
                
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.nextSteps">🚀 ${t.nextSteps || 'Next Steps'}</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>
                            • Conduct a detailed vendor evaluation for ${industry} industry solutions<br>
                            • Create an implementation timeline with clear milestones<br>
                            • Establish baseline metrics to measure actual vs. projected ROI
                        </p>
                    </div>
                </div>
                
            </div>
            <div class="ai-analysis-actions">
                <button id="exportPDFBtn" class="btn btn-primary" data-i18n="roi.exportPDF">
                    📄 Export Analysis as PDF
                </button>
                <button id="shareAnalysisBtn" class="btn btn-secondary" data-i18n="roi.shareAnalysis">
                    🔗 Share Analysis
                </button>
            </div>
        `;
        
        console.log('Generated analysis HTML length:', analysisHTML.length); // Debug
        return analysisHTML;
    }
    
    generateFallbackMetrics() {
        if (!this.results) {
            return '';
        }
        
        const { roi, totalAnnualGain, netFirstYearGain, annualCostSavings, annualRevenueGain } = this.results;
        const totalCost = this.inputs.initialCost + this.inputs.annualSubscription;
        
        // Get current language and translations
        const currentLang = window.currentLanguage || localStorage.getItem('preferredLanguage') || 'en';
        const translations = window.roiTranslations || {};
        const t = translations[currentLang] || {};
        
        // Get translated labels
        const roiLabel = t.roiShort || 'ROI';
        const netGainLabel = t.netGain || 'Net Gain (Year 1)';
        const totalGainLabel = t.totalAnnualGain || 'Total Annual Gain';
        const costSavingsLabel = t.costSavings || 'Cost Savings';
        const revenueGainLabel = t.revenueGain || 'Revenue Gain';
        const investmentVsReturnLabel = t.investmentVsReturn || 'Investment vs Return';
        const investmentLabel = t.investment || 'Investment';
        const returnLabel = t.return || 'Return';
        
        // Calculate ROI percentage for gauge (cap at 500% for display)
        const roiPercent = Math.min(roi, 500);
        const roiGaugePercent = (roiPercent / 500) * 100;
        
        // Calculate gain vs cost ratio
        const gainRatio = totalCost > 0 ? (totalAnnualGain / totalCost) * 100 : 0;
        const gainRatioPercent = Math.min(gainRatio, 100);
        
        return `
            <div class="ai-metrics-dashboard">
                <div class="metrics-row">
                    <div class="metric-card">
                        <div class="metric-icon">📊</div>
                        <div class="metric-label">${roiLabel}</div>
                        <div class="roi-gauge">
                            <svg class="gauge-svg" viewBox="0 0 120 120">
                                <circle class="gauge-background" cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
                                <circle class="gauge-fill" cx="60" cy="60" r="50" fill="none" 
                                    stroke="url(#roiGradient)" stroke-width="8" 
                                    stroke-dasharray="${314 * roiGaugePercent / 100} 314"
                                    stroke-dashoffset="78.5"
                                    transform="rotate(-90 60 60)"/>
                                <defs>
                                    <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" style="stop-color:#8e2de2;stop-opacity:1" />
                                        <stop offset="100%" style="stop-color:#00e5ff;stop-opacity:1" />
                                    </linearGradient>
                                </defs>
                                <text class="gauge-value" x="60" y="65" text-anchor="middle" fill="#00e5ff" font-size="20" font-weight="bold">
                                    ${isFinite(roi) ? roi.toFixed(1) + '%' : '∞'}
                                </text>
                            </svg>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon">💰</div>
                        <div class="metric-label">${netGainLabel}</div>
                        <div class="metric-value positive">${window.formatCurrency(netFirstYearGain)}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min((netFirstYearGain / Math.max(totalAnnualGain, 1)) * 100, 100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon">📈</div>
                        <div class="metric-label">${totalGainLabel}</div>
                        <div class="metric-value positive">${window.formatCurrency(totalAnnualGain)}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${gainRatioPercent}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="metrics-row">
                    <div class="metric-card">
                        <div class="metric-icon">💵</div>
                        <div class="metric-label">${costSavingsLabel}</div>
                        <div class="metric-value">${window.formatCurrency(annualCostSavings)}</div>
                        <div class="mini-chart">
                            <div class="chart-bar" style="height: ${Math.min((annualCostSavings / Math.max(totalAnnualGain, 1)) * 100, 100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon">🚀</div>
                        <div class="metric-label">${revenueGainLabel}</div>
                        <div class="metric-value">${window.formatCurrency(annualRevenueGain)}</div>
                        <div class="mini-chart">
                            <div class="chart-bar" style="height: ${Math.min((annualRevenueGain / Math.max(totalAnnualGain, 1)) * 100, 100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon">⚖️</div>
                        <div class="metric-label">${investmentVsReturnLabel}</div>
                        <div class="comparison-chart">
                            <div class="comparison-item">
                                <span class="comparison-label">${investmentLabel}</span>
                                <div class="comparison-bar investment">
                                    <div class="bar-fill" style="width: ${totalCost > 0 ? Math.min((totalCost / Math.max(totalAnnualGain, totalCost)) * 100, 100) : 0}%"></div>
                                    <span class="bar-value">${window.formatCurrency(totalCost)}</span>
                                </div>
                            </div>
                            <div class="comparison-item">
                                <span class="comparison-label">${returnLabel}</span>
                                <div class="comparison-bar return">
                                    <div class="bar-fill" style="width: ${totalAnnualGain > 0 ? Math.min((totalAnnualGain / Math.max(totalAnnualGain, totalCost)) * 100, 100) : 0}%"></div>
                                    <span class="bar-value">${window.formatCurrency(totalAnnualGain)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupInteractiveFeatures() {
        // Setup expandable sections
        const sections = document.querySelectorAll('.interactive-section');
        sections.forEach(section => {
            const toggle = section.querySelector('.section-toggle');
            const content = section.querySelector('.section-content');
            
            if (toggle && content) {
                // Start with sections expanded
                content.style.display = 'block';
                toggle.classList.add('expanded');
                
                toggle.addEventListener('click', () => {
                    const isExpanded = toggle.classList.contains('expanded');
                    if (isExpanded) {
                        content.style.display = 'none';
                        toggle.classList.remove('expanded');
                    } else {
                        content.style.display = 'block';
                        toggle.classList.add('expanded');
                    }
                });
            }
        });
        
        // Animate progress bars and charts
        const progressBars = document.querySelectorAll('.progress-fill, .chart-bar, .bar-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-out';
                bar.style.width = width;
            }, 100);
        });
        
        // Animate gauge
        const gaugeFills = document.querySelectorAll('.gauge-fill');
        gaugeFills.forEach(gauge => {
            const dashArray = gauge.getAttribute('stroke-dasharray');
            gauge.setAttribute('stroke-dasharray', '0 314');
            gauge.style.transition = 'stroke-dasharray 1.5s ease-out';
            setTimeout(() => {
                gauge.setAttribute('stroke-dasharray', dashArray);
            }, 200);
        });
    }
    
    setupPDFExport() {
        console.log('setupPDFExport called'); // Debug log
        
        // Use event delegation on the modal body to handle dynamically created buttons
        const modalBody = this.aiAnalysisModalContent || document.getElementById('aiAnalysisModalContent');
        
        if (modalBody) {
            // Remove any existing listeners by removing and re-adding
            modalBody.removeEventListener('click', this.handlePDFExportClick);
            this.handlePDFExportClick = (e) => {
                const target = e.target;
                const button = target.closest('#exportPDFBtn') || target.closest('[id="exportPDFBtn"]');
                const shareButton = target.closest('#shareAnalysisBtn') || target.closest('[id="shareAnalysisBtn"]');
                
                if (button) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Export PDF button clicked via delegation'); // Debug log
                    this.exportToPDF();
                    return false;
                }
                
                if (shareButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Share button clicked via delegation'); // Debug log
                    this.shareAnalysis();
                    return false;
                }
            };
            
            modalBody.addEventListener('click', this.handlePDFExportClick);
            console.log('PDF export event delegation set up on modal body'); // Debug log
        }
        
        // Also try direct button attachment as fallback
        setTimeout(() => {
            const exportBtn = document.getElementById('exportPDFBtn');
            const shareBtn = document.getElementById('shareAnalysisBtn');
            
            console.log('PDF export button found (direct):', !!exportBtn); // Debug log
            console.log('Share button found (direct):', !!shareBtn); // Debug log
            
            if (exportBtn && !exportBtn.dataset.listenerAttached) {
                exportBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Export PDF button clicked (direct)'); // Debug log
                    this.exportToPDF();
                });
                exportBtn.dataset.listenerAttached = 'true';
            }
            
            if (shareBtn && !shareBtn.dataset.listenerAttached) {
                shareBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Share button clicked (direct)'); // Debug log
                    this.shareAnalysis();
                });
                shareBtn.dataset.listenerAttached = 'true';
            }
        }, 200);
    }
    
    exportToPDF() {
        console.log('exportToPDF called'); // Debug
        console.log('window.jspdf:', typeof window.jspdf); // Debug
        console.log('window.jsPDF:', typeof window.jsPDF); // Debug
        
        // Use jsPDF library for PDF generation
        if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
            console.error('PDF library not loaded!'); // Debug
            alert('PDF library is loading. Please try again in a moment.');
            return;
        }
        
        // Check if we have results
        if (!this.results) {
            alert('Please calculate ROI first before exporting PDF.');
            return;
        }
        
        // Show preview first instead of direct download
        this.showPDFPreview();
    }
    
    showPDFPreview() {
        // Generate PDF in memory (this should not interfere with the analysis modal)
        // Use a try-catch to prevent errors from affecting the UI
        let pdfBlob;
        try {
            pdfBlob = this.generatePDFBlob();
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
            return;
        }
        
        // Create preview modal with higher z-index than analysis modal
        const previewHTML = `
            <div class="pdf-preview-modal" id="pdfPreviewModal" style="z-index: 20000;">
                <div class="pdf-preview-overlay"></div>
                <div class="pdf-preview-content">
                    <div class="pdf-preview-header">
                        <h3>📄 PDF Report Preview</h3>
                        <button class="pdf-preview-close" id="pdfPreviewClose" aria-label="Close">×</button>
                    </div>
                    <div class="pdf-preview-body">
                        <iframe id="pdfPreviewFrame" style="width: 100%; height: 600px; border: 1px solid #222; border-radius: var(--radius-md);"></iframe>
                    </div>
                    <div class="pdf-preview-actions">
                        <button id="pdfDownloadBtn" class="btn btn-primary">
                            💾 Download PDF
                        </button>
                        <button id="pdfEmailBtn" class="btn btn-secondary">
                            📧 Email Report
                        </button>
                        <button id="pdfShareBtn" class="btn btn-secondary">
                            🔗 Share Link
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('pdfPreviewModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', previewHTML);
        const modal = document.getElementById('pdfPreviewModal');
        
        // Ensure modal is displayed properly without flickering
        requestAnimationFrame(() => {
            modal.style.display = 'flex';
            modal.classList.add('show');
            
            // Show PDF in iframe after modal is visible
            setTimeout(() => {
                const iframe = document.getElementById('pdfPreviewFrame');
                if (iframe) {
                    iframe.src = URL.createObjectURL(pdfBlob);
                }
            }, 50);
        });
        
        // Setup event listeners after modal is rendered
        setTimeout(() => {
            const closeBtn = document.getElementById('pdfPreviewClose');
            const downloadBtn = document.getElementById('pdfDownloadBtn');
            const emailBtn = document.getElementById('pdfEmailBtn');
            const shareBtn = document.getElementById('pdfShareBtn');
            const overlay = modal.querySelector('.pdf-preview-overlay');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closePDFPreview());
            }
            if (overlay) {
                overlay.addEventListener('click', () => this.closePDFPreview());
            }
            
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    this.downloadPDF(pdfBlob);
                    this.closePDFPreview();
                });
            }
            
            if (emailBtn) {
                emailBtn.addEventListener('click', () => {
                    this.emailPDF(pdfBlob);
                });
            }
            
            if (shareBtn) {
                shareBtn.addEventListener('click', () => {
                    this.sharePDF(pdfBlob);
                });
            }
        }, 100);
        
        // Store blob for later use
        this.currentPDFBlob = pdfBlob;
    }
    
    closePDFPreview() {
        const modal = document.getElementById('pdfPreviewModal');
        if (modal) {
            modal.remove();
        }
        if (this.currentPDFBlob) {
            URL.revokeObjectURL(URL.createObjectURL(this.currentPDFBlob));
        }
    }
    
    generatePDFBlob() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Professional Header
        doc.setFillColor(142, 45, 226);
        doc.rect(0, 0, 210, 30, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        doc.text('AI ROI Analysis Report', 105, 18, { align: 'center' });
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 25, { align: 'center' });
        
        let yPos = 40;
        
        // Executive Summary Section
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Executive Summary', 20, yPos);
        yPos += 8;
        
        doc.setDrawColor(142, 45, 226);
        doc.setLineWidth(0.5);
        doc.line(20, yPos - 2, 190, yPos - 2);
        yPos += 5;
        
        // Extract executive summary from AI analysis
        const execSummary = this.extractSectionFromAnalysis('Executive Summary') || 
                           `This AI investment analysis shows a ${isFinite(this.results.roi) ? this.results.roi.toFixed(1) + '%' : 'infinite'}% ROI for the first year, with a net gain of ${window.formatCurrency(this.results.netFirstYearGain)} and total annual gain of ${window.formatCurrency(this.results.totalAnnualGain)}.`;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const summaryLines = doc.splitTextToSize(execSummary, 170);
        summaryLines.forEach(line => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, 20, yPos);
            yPos += 5;
        });
        
        yPos += 8;
        
        // Key Metrics Box
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(20, yPos, 170, 35, 3, 3, 'F');
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(142, 45, 226);
        doc.text('Key Financial Metrics', 25, yPos + 8);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        const metrics = [
            { label: 'First-Year ROI', value: isFinite(this.results.roi) ? this.results.roi.toFixed(1) + '%' : '∞' },
            { label: 'Net Gain (Year 1)', value: window.formatCurrency(this.results.netFirstYearGain) },
            { label: 'Total Annual Gain', value: window.formatCurrency(this.results.totalAnnualGain) },
            { label: 'Cost Savings', value: window.formatCurrency(this.results.annualCostSavings) },
            { label: 'Revenue Gain', value: window.formatCurrency(this.results.annualRevenueGain) }
        ];
        
        let metricX = 25;
        let metricY = yPos + 18;
        metrics.forEach((metric, index) => {
            if (index === 3) {
                metricX = 110;
                metricY = yPos + 18;
            }
            doc.setFont(undefined, 'bold');
            doc.text(metric.label + ':', metricX, metricY);
            doc.setFont(undefined, 'normal');
            doc.text(metric.value, metricX + 50, metricY);
            metricY += 6;
        });
        
        yPos += 45;
        
        // AI Analysis Sections
        const sections = [
            { title: 'Key Strengths', icon: '💪' },
            { title: 'Potential Risks & Considerations', icon: '⚠️' },
            { title: 'Detailed Implementation Action Plan', icon: '🎯' },
            { title: 'Strategic Recommendations', icon: '📋' },
            { title: 'Next Steps & Immediate Actions', icon: '🚀' },
            { title: 'Financial Projections & Sensitivity Analysis', icon: '📊' }
        ];
        
        sections.forEach(section => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            // Section Header
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(section.title, 20, yPos);
            yPos += 8;
            
            // Section Underline
            doc.setDrawColor(142, 45, 226);
            doc.setLineWidth(0.3);
            doc.line(20, yPos - 2, 190, yPos - 2);
            yPos += 5;
            
            // Section Content
            const sectionContent = this.extractSectionFromAnalysis(section.title) || 
                                 this.getDefaultSectionContent(section.title);
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            const contentLines = doc.splitTextToSize(sectionContent, 170);
            
            contentLines.forEach(line => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                // Format bullet points and numbered lists
                if (line.trim().startsWith('•') || line.trim().match(/^\d+\./)) {
                    doc.text(line, 25, yPos);
                } else {
                    doc.text(line, 20, yPos);
                }
                yPos += 5;
            });
            
            yPos += 8;
        });
        
        // Footer on all pages
        const pageCount = doc.internal.pages.length - 1;
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
            doc.text('AI ROI Calculator - Janar Kuusk Portfolio', 105, 290, { align: 'center' });
        }
        
        // Return as blob
        return doc.output('blob');
    }
    
    generatePDF() {
        // Legacy method - now calls generatePDFBlob and downloads
        const blob = this.generatePDFBlob();
        const fileName = `AI-ROI-Analysis-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    downloadPDF(blob) {
        console.log('downloadPDF called, blob:', blob); // Debug
        
        if (!blob) {
            console.error('No blob provided for download');
            alert('Error: PDF blob is missing. Please try again.');
            return;
        }
        
        try {
            const fileName = `AI-ROI-Analysis-Report-${new Date().toISOString().split('T')[0]}.pdf`;
            const url = URL.createObjectURL(blob);
            console.log('Created object URL:', url); // Debug
            
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            
            console.log('Triggering download...'); // Debug
            a.click();
            
            // Clean up after a short delay
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading PDF: ' + error.message);
        }
    }
    
    emailPDF(blob) {
        const subject = encodeURIComponent('AI ROI Analysis Report');
        const body = encodeURIComponent(`Please find attached the AI ROI Analysis Report generated on ${new Date().toLocaleDateString()}.\n\nThis report contains comprehensive analysis of your AI investment ROI calculation.`);
        
        // Create a data URL for the PDF
        const reader = new FileReader();
        reader.onload = function(e) {
            // For email, we'll use mailto with instructions
            // Note: Most email clients don't support attachments via mailto
            // So we'll provide download link or use a service
            const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            // Also show instructions
            setTimeout(() => {
                alert('Email client opened. Please attach the downloaded PDF file. The PDF will be downloaded now for you to attach.');
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `AI-ROI-Analysis-Report-${new Date().toISOString().split('T')[0]}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
            }, 500);
        };
        reader.readAsDataURL(blob);
    }
    
    sharePDF(blob) {
        if (navigator.share && navigator.canShare) {
            // Convert blob to file for sharing
            const file = new File([blob], `AI-ROI-Analysis-Report-${new Date().toISOString().split('T')[0]}.pdf`, { type: 'application/pdf' });
            
            if (navigator.canShare({ files: [file] })) {
                navigator.share({
                    title: 'AI ROI Analysis Report',
                    text: 'AI ROI Analysis Report generated from Janar Kuusk Portfolio',
                    files: [file]
                }).catch(err => {
                    console.log('Share failed:', err);
                    this.fallbackShare(blob);
                });
            } else {
                this.fallbackShare(blob);
            }
        } else {
            this.fallbackShare(blob);
        }
    }
    
    fallbackShare(blob) {
        // Fallback: copy download link or show share options
        const url = URL.createObjectURL(blob);
        const shareText = `AI ROI Analysis Report - Download: ${url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Report link copied to clipboard! You can share it with others.');
            });
        } else {
            prompt('Copy this link to share:', shareText);
        }
    }
    
    
    updateLanguage(lang) {
        // Update AI analysis content translations if it exists
        if (this.aiAnalysisContent && this.aiAnalysisContent.querySelectorAll) {
            // Update section headers
            const sections = this.aiAnalysisContent.querySelectorAll('.ai-analysis-section h4[data-i18n]');
            sections.forEach(h4 => {
                const key = h4.getAttribute('data-i18n');
                if (!key) return;
                
                const t = window.roiTranslations?.[lang]?.roi || {};
                const value = this.getNestedTranslationValue(t, key);
                
                if (value) {
                    // Preserve emoji
                    const emojiMatch = h4.textContent.match(/^[📊💪⚠️🎯🚀📋]/);
                    if (emojiMatch) {
                        h4.textContent = emojiMatch[0] + ' ' + value;
                    } else {
                        h4.textContent = value;
                    }
                } else {
                    console.log('Translation not found for key:', key, 'in language:', lang);
                }
            });
            
            // Update buttons
            const buttons = this.aiAnalysisContent.querySelectorAll('button[data-i18n]');
            buttons.forEach(btn => {
                const key = btn.getAttribute('data-i18n');
                if (!key) return;
                
                const t = window.roiTranslations?.[lang]?.roi || {};
                const value = this.getNestedTranslationValue(t, key);
                if (value) {
                    const emojiMatch = btn.textContent.match(/^[📄🔗]/);
                    if (emojiMatch) {
                        btn.textContent = emojiMatch[0] + ' ' + value;
                    } else {
                        btn.textContent = value;
                    }
                } else {
                    console.log('Translation not found for button key:', key, 'in language:', lang);
                }
            });
        }
    }
    
    getNestedTranslationValue(obj, path) {
        const keys = path.split('.');
        let value = obj;
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return null;
            }
        }
        return value;
    }
    
    extractSectionFromAnalysis(sectionTitle) {
        if (!this.aiAnalysisContent) return null;
        
        // Clone the content to avoid DOM manipulation that could cause flickering
        const clonedContent = this.aiAnalysisContent.cloneNode(true);
        
        // Try to find the section in the cloned HTML
        const sections = clonedContent.querySelectorAll('.ai-analysis-section');
        for (let section of sections) {
            const heading = section.querySelector('h4');
            if (heading && heading.textContent.includes(sectionTitle.replace('💪', '').replace('⚠️', '').replace('🎯', '').replace('🚀', '').trim())) {
                const content = section.querySelector('p');
                if (content) {
                    // Clean up the text
                    let text = content.textContent || content.innerText;
                    // Remove emojis and extra whitespace
                    text = text.replace(/[📊💪⚠️🎯🚀]/g, '').trim();
                    return text;
                }
            }
        }
        
        // Fallback: try to extract from raw text
        const allText = this.aiAnalysisContent.innerText || this.aiAnalysisContent.textContent;
        const titleIndex = allText.indexOf(sectionTitle);
        if (titleIndex !== -1) {
            const nextTitleIndex = allText.indexOf('\n\n', titleIndex + sectionTitle.length);
            const sectionText = allText.substring(titleIndex + sectionTitle.length, nextTitleIndex !== -1 ? nextTitleIndex : allText.length);
            return sectionText.trim();
        }
        
        return null;
    }
    
    getDefaultSectionContent(sectionTitle) {
        const industry = this.inputs.industry === 'custom' ? this.inputs.customIndustry : this.inputs.industry;
        
        const defaults = {
            'Key Strengths': `• Cost savings from productivity improvements provide a solid foundation for ROI\n• Revenue growth projections add upside potential\n• ${this.inputs.numEmployees} employees benefiting from time savings creates compound value`,
            'Potential Risks & Considerations': `• Initial setup costs require careful planning and execution\n• Actual time savings may vary based on adoption rates\n• Revenue projections depend on successful implementation and market conditions`,
            'Detailed Implementation Action Plan': `Phase 1 (0-30 days): Vendor selection, pilot program design\nPhase 2 (30-90 days): Implementation, training, change management\nPhase 3 (90-180 days): Rollout, monitoring, optimization\nPhase 4 (180-365 days): Scaling, ROI validation`,
            'Strategic Recommendations': `• Conduct vendor evaluation specific to ${industry}\n• Develop change management strategy\n• Establish success metrics and KPIs`,
            'Next Steps & Immediate Actions': `• Week 1-2: Stakeholder alignment and vendor research\n• Week 3-4: Pilot program design and approval\n• Month 2-3: Implementation kickoff and training`,
            'Financial Projections & Sensitivity Analysis': `• Best-case scenario: ${(this.results.roi * 1.2).toFixed(1)}% ROI\n• Base-case scenario: ${this.results.roi.toFixed(1)}% ROI\n• Worst-case scenario: ${(this.results.roi * 0.8).toFixed(1)}% ROI`
        };
        
        return defaults[sectionTitle] || 'Analysis content not available.';
    }
    
    shareAnalysis() {
        const analysisText = this.aiAnalysisContent.innerText || this.aiAnalysisContent.textContent;
        const shareData = {
            title: 'AI ROI Calculator Analysis',
            text: analysisText,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(err => console.log('Error sharing', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(analysisText).then(() => {
                alert('Analysis copied to clipboard!');
            });
        }
    }

    setupHeaderNavigation() {
        const header = document.querySelector('.portfolio-header');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mainNav = document.querySelector('.main-nav');
        const navOverlay = document.getElementById('navOverlay');

        if (!header) return;

        // Header scroll effect - same as home page: visible only at top, disappears when scrolling
        const topThreshold = 10; // Show header when within 10px of top
        
        // Function to check scroll position and update header visibility
        const checkScrollPosition = () => {
            const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            
            // Show header only when at the very top of the page
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
        // Add spotlight effect to all calculator cards
        const cards = document.querySelectorAll('.calculator-card');
        
        cards.forEach(card => {
            const handleMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                card.classList.add('is-hovering');
            };
            
            const handleMouseLeave = () => {
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
                card.classList.remove('is-hovering');
            };
            
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    }
}

// Calculator is initialized in roi-calculator.html
// This prevents double initialization

