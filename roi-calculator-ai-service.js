// Google Gemini AI Service for ROI Calculator
// Professional AI Analysis Generation

class GeminiAIService {
    constructor() {
        // API Key - loaded from configuration file (set by developer)
        this.apiKey = this.getAPIKey();
        
        // Get model from config or use default
        const config = window.ROI_CALCULATOR_CONFIG || {};
        this.model = config.GEMINI_MODEL || 'gemini-1.5-flash';
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
    }

    getAPIKey() {
        // Get API key from configuration file (set by developer)
        if (window.ROI_CALCULATOR_CONFIG && window.ROI_CALCULATOR_CONFIG.GEMINI_API_KEY) {
            const apiKey = window.ROI_CALCULATOR_CONFIG.GEMINI_API_KEY;
            // Only use if it's not the placeholder
            if (apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.trim().length > 0) {
                return apiKey.trim();
            }
        }

        // Fallback: Check for environment variable (for server-side)
        if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
            return process.env.GEMINI_API_KEY;
        }

        // Return null if no key found (will use fallback)
        return null;
    }

    hasAPIKey() {
        // Check dynamically in case config loaded after constructor
        const apiKey = this.getAPIKey();
        return !!apiKey;
    }

    async generateAnalysis(roiData) {
        if (!this.hasAPIKey()) {
            throw new Error('API_KEY_REQUIRED');
        }

        const prompt = this.buildProfessionalPrompt(roiData);

        try {
            const response = await fetch(
                `${this.apiUrl}?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 2048,
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API Error: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Invalid API response format');
            }

            const analysisText = data.candidates[0].content.parts[0].text;
            return this.formatAnalysisResponse(analysisText, roiData);

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    buildProfessionalPrompt(roiData) {
        const {
            inputs,
            results,
            benchmark
        } = roiData;

        const industry = inputs.industry === 'custom' ? inputs.customIndustry : inputs.industry;
        const roi = results.roi;
        const netGain = results.netFirstYearGain;
        const totalGain = results.totalAnnualGain;
        const costSavings = results.annualCostSavings;
        const revenueGain = results.annualRevenueGain;
        const numEmployees = inputs.numEmployees;
        const timeSavings = inputs.timeSavingsPercent;
        const revenueIncrease = inputs.revenueIncreasePercent;

        // Helper function to safely format numbers
        const formatNumber = (value) => {
            if (value === null || value === undefined || isNaN(value)) {
                return '0';
            }
            return Number(value).toLocaleString();
        };

        return `You are a senior business analyst and AI investment consultant with 15+ years of experience. Analyze the following ROI calculation data and provide a comprehensive, detailed, professional business analysis with actionable insights.

**Business Context:**
- Industry: ${industry || 'Not specified'}
- Number of Employees: ${numEmployees || 0}
- Initial AI Setup Cost: $${formatNumber(inputs.initialCost)}
- Annual Subscription Cost: $${formatNumber(inputs.annualSubscription)}
- Hours per Week on Task: ${inputs.hoursPerWeek || 0}
- Average Hourly Wage: $${formatNumber(inputs.hourlyWage)}
- Current Annual Revenue: $${formatNumber(inputs.annualRevenue)}

**ROI Calculation Results:**
- First-Year ROI: ${isFinite(roi) ? roi.toFixed(1) + '%' : 'Infinite'}
- Net Gain (Year 1): $${formatNumber(netGain)}
- Total Annual Gain: $${formatNumber(totalGain)}
- Cost Savings (Productivity): $${formatNumber(costSavings)}
- Revenue Gain: $${formatNumber(revenueGain)}
- Time Savings: ${timeSavings || 0}%
- Revenue Increase: ${revenueIncrease || 0}%

${benchmark ? `**Industry Benchmark Comparison:**
- Your ROI vs Industry Average: ${benchmark.roiComparison}
- Your Time Savings vs Industry Average: ${benchmark.timeSavingsComparison}
- Your Revenue Increase vs Industry Average: ${benchmark.revenueComparison}
` : ''}

**Please provide a comprehensive, detailed analysis in the following structured format:**

## Executive Summary
Provide a detailed 4-5 sentence executive summary that:
- Highlights the key ROI figure and financial impact
- Summarizes the overall investment opportunity
- Mentions key value drivers (cost savings, revenue growth)
- Provides a clear recommendation (proceed, proceed with caution, or reconsider)
- References industry context for ${industry}

## Key Strengths
Provide 5-6 detailed strengths with specific data points:
- Cost savings breakdown and productivity impact
- Revenue growth potential and market opportunities
- Employee impact and scalability benefits
- Competitive advantages and market positioning
- Long-term value creation potential
- Specific numbers and percentages from the calculation

## Potential Risks & Considerations
Identify 5-6 realistic risks with mitigation strategies:
- Implementation challenges and how to address them
- Adoption barriers and change management needs
- Market conditions and industry-specific factors
- ROI assumptions that may vary and sensitivity analysis
- Technology risks and vendor considerations
- Financial risks and cash flow implications

## Detailed Implementation Action Plan
Provide a comprehensive, phased action plan with:
- **Phase 1 (0-30 days):** Immediate actions, vendor selection criteria, pilot program setup
- **Phase 2 (30-90 days):** Implementation steps, training requirements, change management
- **Phase 3 (90-180 days):** Rollout strategy, monitoring KPIs, optimization opportunities
- **Phase 4 (180-365 days):** Scaling plan, ROI validation, continuous improvement
- Include specific milestones, deliverables, and success metrics for each phase
- Resource requirements (team size, budget, timeline)

## Strategic Recommendations
Provide 4-5 strategic recommendations:
- Vendor selection criteria specific to ${industry}
- Technology stack recommendations
- Integration with existing systems
- Change management approach
- Risk mitigation strategies

## Next Steps & Immediate Actions
Provide a detailed action plan with:
- **Week 1-2:** Specific tasks, stakeholders to involve, decisions needed
- **Week 3-4:** Vendor evaluation process, pilot program design
- **Month 2-3:** Implementation kickoff, training schedule, communication plan
- **Ongoing:** Key metrics to track, review cadence, success criteria
- Include specific deliverables, timelines, and responsible parties

## Financial Projections & Sensitivity Analysis
Provide insights on:
- Best-case, base-case, and worst-case scenarios
- Key assumptions that could impact ROI
- Break-even analysis
- 3-year financial projection considerations
- Cash flow implications

**Critical Requirements:**
- Be extremely detailed and comprehensive (aim for 1500-2000 words total)
- Reference specific numbers from the calculation throughout
- Use professional business language suitable for C-level executives and board presentations
- Provide actionable, specific recommendations (not generic advice)
- Include industry-specific insights for ${industry}
- Be realistic and balanced (acknowledge both opportunities and challenges)
- Format with clear sections, bullet points, and numbered lists where appropriate
- Think like a senior consultant providing a $50,000+ analysis

Generate the comprehensive analysis now:`;
    }

    formatAnalysisResponse(analysisText, roiData) {
        // Parse the AI response and structure it
        const sections = {
            executiveSummary: '',
            keyStrengths: '',
            potentialRisks: '',
            detailedImplementationActionPlan: '',
            strategicRecommendations: '',
            nextStepsImmediateActions: '',
            financialProjectionsSensitivityAnalysis: '',
            implementationRecommendations: '', // Fallback
            nextSteps: '' // Fallback
        };

        // Try to extract sections from markdown or structured text
        const lines = analysisText.split('\n');
        let currentSection = null;
        let currentContent = [];

        for (let line of lines) {
            line = line.trim();
            
            if (line.match(/^##?\s*Executive\s*Summary/i)) {
                if (currentSection) sections[currentSection] = currentContent.join('\n').trim();
                currentSection = 'executiveSummary';
                currentContent = [];
            } else if (line.match(/^##?\s*Key\s*Strengths/i)) {
                if (currentSection) sections[currentSection] = currentContent.join('\n').trim();
                currentSection = 'keyStrengths';
                currentContent = [];
            } else if (line.match(/^##?\s*Potential\s*Risks/i) || line.match(/^##?\s*Risks/i)) {
                if (currentSection) sections[currentSection] = currentContent.join('\n').trim();
                currentSection = 'potentialRisks';
                currentContent = [];
            } else if (line.match(/^##?\s*Detailed\s*Implementation/i) || line.match(/^##?\s*Implementation\s*Action\s*Plan/i)) {
                if (currentSection) sections[currentSection] = currentContent.join('\n').trim();
                currentSection = 'detailedImplementationActionPlan';
                currentContent = [];
            } else if (line.match(/^##?\s*Strategic\s*Recommendations/i)) {
                if (currentSection) sections[currentSection] = currentContent.join('\n').trim();
                currentSection = 'strategicRecommendations';
                currentContent = [];
            } else if (line.match(/^##?\s*Next\s*Steps/i) || line.match(/^##?\s*Next\s*Steps\s*&/i)) {
                if (currentSection) sections[currentSection] = currentContent.join('\n').trim();
                currentSection = 'nextStepsImmediateActions';
                currentContent = [];
            } else if (line.match(/^##?\s*Financial\s*Projections/i) || line.match(/^##?\s*Sensitivity\s*Analysis/i)) {
                if (currentSection) sections[currentSection] = currentContent.join('\n').trim();
                currentSection = 'financialProjectionsSensitivityAnalysis';
                currentContent = [];
            } else if (line.match(/^##?\s*Implementation/i)) {
                if (currentSection) sections[currentSection] = currentContent.join('\n').trim();
                currentSection = 'implementationRecommendations';
                currentContent = [];
            } else if (line && currentSection) {
                currentContent.push(line);
            }
        }

        // Save last section
        if (currentSection) {
            sections[currentSection] = currentContent.join('\n').trim();
        }

        // If parsing failed, use the full text
        const hasSections = Object.values(sections).some(v => v && v.length > 0);
        if (!hasSections) {
            console.warn('No sections parsed, using full text as executive summary');
            // Use first part of text as executive summary
            const firstPart = analysisText.split('\n\n')[0] || analysisText.substring(0, 1000);
            sections.executiveSummary = firstPart;
            
            // Try to extract more sections from the rest
            const remainingText = analysisText.substring(firstPart.length);
            if (remainingText.length > 100) {
                const parts = remainingText.split(/\n\n+/);
                if (parts.length > 1) {
                    sections.keyStrengths = parts[0] || '';
                    if (parts.length > 2) {
                        sections.potentialRisks = parts[1] || '';
                    }
                }
            }
        }
        
        console.log('Parsed sections:', Object.keys(sections).filter(k => sections[k] && sections[k].length > 0));

        return {
            raw: analysisText,
            sections: sections,
            formatted: this.formatAsHTML(sections, roiData)
        };
    }

    formatAsHTML(sections, roiData = null) {
        console.log('formatAsHTML called with sections:', sections); // Debug
        console.log('formatAsHTML called with roiData:', roiData); // Debug
        
        // Generate interactive metrics if ROI data is available
        let metricsHTML = '';
        if (roiData) {
            try {
                metricsHTML = this.generateInteractiveMetrics(roiData);
            } catch (error) {
                console.error('Error generating metrics:', error);
            }
        }
        
        // Check if we have any sections with content
        const hasContent = Object.values(sections).some(v => v && v.length > 0);
        console.log('Has content:', hasContent); // Debug
        
        if (!hasContent) {
            // Return a fallback message if no sections
            return `
                ${metricsHTML}
                <div class="ai-analysis-content">
                    <div class="ai-analysis-section">
                        <h4>Analysis Generated</h4>
                        <p>The AI analysis has been generated, but the content parsing encountered an issue. Please try again or contact support.</p>
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
        
        return `
            ${metricsHTML}
            <div class="ai-analysis-content">
                ${sections.executiveSummary ? `
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.executiveSummary">📊 Executive Summary</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>${this.formatText(sections.executiveSummary)}</p>
                    </div>
                </div>
                ` : ''}
                
                ${sections.keyStrengths ? `
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.keyStrengths">💪 Key Strengths</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>${this.formatText(sections.keyStrengths)}</p>
                    </div>
                </div>
                ` : ''}
                
                ${sections.potentialRisks ? `
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.potentialRisks">⚠️ Potential Risks & Considerations</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>${this.formatText(sections.potentialRisks)}</p>
                    </div>
                </div>
                ` : ''}
                
                ${sections.detailedImplementationActionPlan ? `
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.detailedImplementationActionPlan">🎯 Detailed Implementation Action Plan</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>${this.formatText(sections.detailedImplementationActionPlan)}</p>
                    </div>
                </div>
                ` : sections.implementationRecommendations ? `
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.implementationSuggestions">🎯 Implementation Recommendations</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>${this.formatText(sections.implementationRecommendations)}</p>
                    </div>
                </div>
                ` : ''}
                
                ${sections.strategicRecommendations ? `
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.strategicRecommendations">📋 Strategic Recommendations</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>${this.formatText(sections.strategicRecommendations)}</p>
                    </div>
                </div>
                ` : ''}
                
                ${sections.nextStepsImmediateActions ? `
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.nextStepsImmediateActions">🚀 Next Steps & Immediate Actions</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>${this.formatText(sections.nextStepsImmediateActions)}</p>
                    </div>
                </div>
                ` : sections.nextSteps ? `
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.nextSteps">🚀 Next Steps</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>${this.formatText(sections.nextSteps)}</p>
                    </div>
                </div>
                ` : ''}
                
                ${sections.financialProjectionsSensitivityAnalysis ? `
                <div class="ai-analysis-section interactive-section">
                    <div class="section-header">
                        <h4 data-i18n="roi.financialProjectionsSensitivityAnalysis">📊 Financial Projections & Sensitivity Analysis</h4>
                        <button class="section-toggle" aria-label="Toggle section">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 6l4 4 4-4"/>
                            </svg>
                        </button>
                    </div>
                    <div class="section-content">
                        <p>${this.formatText(sections.financialProjectionsSensitivityAnalysis)}</p>
                    </div>
                </div>
                ` : ''}
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

    generateInteractiveMetrics(roiData) {
        const { results, inputs } = roiData;
        const roi = results.roi;
        const netGain = results.netFirstYearGain;
        const totalGain = results.totalAnnualGain;
        const costSavings = results.annualCostSavings;
        const revenueGain = results.annualRevenueGain;
        const totalCost = inputs.initialCost + inputs.annualSubscription;
        
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
        const gainRatio = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
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
                        <div class="metric-value positive">${this.formatCurrency(netGain)}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min((netGain / Math.max(totalGain, 1)) * 100, 100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon">📈</div>
                        <div class="metric-label">${totalGainLabel}</div>
                        <div class="metric-value positive">${this.formatCurrency(totalGain)}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${gainRatioPercent}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="metrics-row">
                    <div class="metric-card">
                        <div class="metric-icon">💵</div>
                        <div class="metric-label">${costSavingsLabel}</div>
                        <div class="metric-value">${this.formatCurrency(costSavings)}</div>
                        <div class="mini-chart">
                            <div class="chart-bar" style="height: ${Math.min((costSavings / Math.max(totalGain, 1)) * 100, 100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon">🚀</div>
                        <div class="metric-label">${revenueGainLabel}</div>
                        <div class="metric-value">${this.formatCurrency(revenueGain)}</div>
                        <div class="mini-chart">
                            <div class="chart-bar" style="height: ${Math.min((revenueGain / Math.max(totalGain, 1)) * 100, 100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon">⚖️</div>
                        <div class="metric-label">${investmentVsReturnLabel}</div>
                        <div class="comparison-chart">
                            <div class="comparison-item">
                                <span class="comparison-label">${investmentLabel}</span>
                                <div class="comparison-bar investment">
                                    <div class="bar-fill" style="width: ${totalCost > 0 ? Math.min((totalCost / Math.max(totalGain, totalCost)) * 100, 100) : 0}%"></div>
                                    <span class="bar-value">${this.formatCurrency(totalCost)}</span>
                                </div>
                            </div>
                            <div class="comparison-item">
                                <span class="comparison-label">${returnLabel}</span>
                                <div class="comparison-bar return">
                                    <div class="bar-fill" style="width: ${totalGain > 0 ? Math.min((totalGain / Math.max(totalGain, totalCost)) * 100, 100) : 0}%"></div>
                                    <span class="bar-value">${this.formatCurrency(totalGain)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    formatCurrency(value) {
        if (value === null || value === undefined || isNaN(value)) {
            return '$0';
        }
        return '$' + Number(value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    
    formatText(text) {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^[-•]\s+(.+)$/gm, '• $1<br>')
            .replace(/^\d+\.\s+(.+)$/gm, '$1<br>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.GeminiAIService = GeminiAIService;
}

