// ============================================
// ROI Calculator Configuration
// ============================================
// 
// STEP 1: Get your free API key from Google AI Studio:
//         https://makersuite.google.com/app/apikey
//
// STEP 2: Replace 'YOUR_API_KEY_HERE' below with your actual API key
//         Example: GEMINI_API_KEY: 'AIzaSyAbc123...xyz',
//
// ============================================

const ROI_CALCULATOR_CONFIG = {
    // ⬇️ ADD YOUR API KEY HERE ⬇️
    // Replace the text 'YOUR_API_KEY_HERE' with your actual API key
    GEMINI_API_KEY: 'AIzaSyAwaCRM0mcbbspEQVoSjtlyLcTB3nkuL0k',  // <-- PUT YOUR API KEY HERE
    
    // AI Model to use (gemini-1.5-flash is recommended for speed and cost)
    GEMINI_MODEL: 'gemini-1.5-flash',
    
    // Enable/disable AI analysis feature
    AI_ANALYSIS_ENABLED: true
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.ROI_CALCULATOR_CONFIG = ROI_CALCULATOR_CONFIG;
}

