// ROI Calculator Data and Benchmarks

// Industry Benchmarks
const industryBenchmarks = {
    retail: {
        avgROI: 150,
        avgTimeSavings: 35,
        avgRevenueIncrease: 8
    },
    manufacturing: {
        avgROI: 180,
        avgTimeSavings: 45,
        avgRevenueIncrease: 12
    },
    healthcare: {
        avgROI: 120,
        avgTimeSavings: 30,
        avgRevenueIncrease: 6
    },
    finance: {
        avgROI: 200,
        avgTimeSavings: 50,
        avgRevenueIncrease: 15
    }
};

// Validation Rules
const validationRules = {
    initialCost: { min: 0, max: 1_000_000_000 },
    annualCost: { min: 0, max: 1_000_000_000 },
    numEmployees: { min: 1, max: 100_000 },
    hoursPerWeek: { min: 0, max: 168 },
    hourlyWage: { min: 0, max: 1_000 },
    annualRevenue: { min: 0, max: 10_000_000_000 },
    timeSavings: { min: 0, max: 100 },
    revenueIncrease: { min: 0, max: 100 }
};

// Default Input Values
const defaultInputs = {
    initialCost: 50000,
    annualCost: 10000,
    numEmployees: 10,
    hoursPerWeek: 5,
    hourlyWage: 25,
    timeSavings: 40,
    annualRevenue: 1000000,
    revenueIncrease: 5,
    industry: 'retail',
    customIndustry: ''
};

// Number formatting helper
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatPercentage(value) {
    return `${value.toFixed(1)}%`;
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

// Make data available globally
window.industryBenchmarks = industryBenchmarks;
window.validationRules = validationRules;
window.defaultInputs = defaultInputs;
window.formatCurrency = formatCurrency;
window.formatPercentage = formatPercentage;
window.formatNumber = formatNumber;

