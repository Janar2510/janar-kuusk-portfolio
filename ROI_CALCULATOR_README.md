# AI ROI Calculator

A free, interactive calculator that helps businesses estimate the potential return on investment (ROI) from implementing AI solutions. Built with vanilla JavaScript, Chart.js, and a modern dark theme matching the portfolio design system.

## Features

### Core Functionality
- **Real-time ROI Calculations**: Instant calculation of first-year ROI, net gain, and total annual benefits
- **Industry Benchmarks**: Compare your projected ROI against industry averages (Retail, Manufacturing, Healthcare, Finance)
- **5-Year Projection**: Visual chart showing net return projections over 5 years
- **Input Validation**: Real-time validation with helpful error messages
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Calculation Inputs
1. **Industry Selection**: Choose from predefined industries or enter custom
2. **Investment Costs**:
   - Initial AI Setup Cost
   - Annual Subscription Cost
3. **Productivity Gains**:
   - Number of Employees
   - Average Hourly Wage
   - Hours per Week on Task
   - Expected Time Savings (%)
4. **Revenue Growth**:
   - Current Annual Revenue
   - Expected Revenue Increase (%)

### Results Display
- **First-Year ROI**: Percentage return on investment in year one
- **Net Gain (Year 1)**: Net profit after investment costs
- **Total Annual Gain**: Combined cost savings and revenue gains
- **Cost Savings**: Annual savings from productivity improvements
- **Revenue Gain**: Annual revenue increase from AI implementation
- **Industry Benchmark Comparison**: Visual comparison with industry averages

## File Structure

```
roi-calculator.html              # Main HTML page
roi-calculator.css               # Styling (330+ lines)
roi-calculator.js                # Core calculator logic
roi-calculator-data.js           # Industry benchmarks & validation rules
roi-calculator-translations.js   # EN/ET translations
```

## Technical Implementation

### ROI Calculation Formula

```javascript
// Annual hours saved
annualHoursSaved = numEmployees × hoursPerWeek × 52

// Annual cost savings
annualCostSavings = annualHoursSaved × hourlyWage × (timeSavings / 100)

// Annual revenue gain
annualRevenueGain = annualRevenue × (revenueIncrease / 100)

// Total annual gain
totalAnnualGain = annualCostSavings + annualRevenueGain

// First year investment
totalFirstYearInvestment = initialCost + annualCost

// Net first year gain
netFirstYearGain = totalAnnualGain - totalFirstYearInvestment

// ROI percentage
roi = (netFirstYearGain / totalFirstYearInvestment) × 100
```

### 5-Year Projection Calculation

```javascript
for (year 1 to 5) {
  annualReturn = totalAnnualGain × year
  totalInvestment = initialCost + (annualCost × year)
  netReturn[year] = annualReturn - totalInvestment
}
```

## Industry Benchmarks

Default benchmark data included for comparison:

| Industry      | Avg ROI | Avg Time Savings | Avg Revenue Increase |
|---------------|---------|------------------|----------------------|
| Retail        | 150%    | 35%              | 8%                   |
| Manufacturing | 180%    | 45%              | 12%                  |
| Healthcare    | 120%    | 30%              | 6%                   |
| Finance       | 200%    | 50%              | 15%                  |

## Validation Rules

Input constraints to ensure realistic calculations:

```javascript
{
  initialCost:     { min: 0,    max: 1,000,000,000 },
  annualCost:      { min: 0,    max: 1,000,000,000 },
  numEmployees:    { min: 1,    max: 100,000 },
  hoursPerWeek:    { min: 0,    max: 168 },
  hourlyWage:      { min: 0,    max: 1,000 },
  annualRevenue:   { min: 0,    max: 10,000,000,000 },
  timeSavings:     { min: 0,    max: 100 },
  revenueIncrease: { min: 0,    max: 100 }
}
```

## Design System

### Color Scheme
- **Primary Gradient**: Purple (#8e2de2) to Blue (#4a00e0)
- **Accent Color**: Cyan (#00e5ff)
- **Background**: Dark (#0a0a0a to #111827)
- **Cards**: Dark gray (#1e1e1e) with glassmorphism

### Animations
- **Gradient Borders**: 6-second flowing border animation
- **Result Cards**: Staggered fade-in with 100ms delay between cards
- **Chart Bars**: Growing animation on load
- **Hover Effects**: Scale and glow transformations

### Responsive Breakpoints
- **Desktop**: 2-column layout (inputs | results)
- **Tablet (1024px)**: Single column, full-width sections
- **Mobile (768px)**: Optimized spacing and typography
- **Small Mobile (480px)**: Further simplified layout

## Chart.js Integration

The calculator uses Chart.js 4.4.0 for the 5-year projection visualization:

```javascript
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
    datasets: [{
      label: 'Net Return',
      data: [year1, year2, year3, year4, year5],
      backgroundColor: gradientPurpleToCyan,
      borderColor: '#00e5ff',
      borderRadius: 8
    }]
  }
})
```

## User Experience Features

### Welcome Screen
- Displays before first calculation
- Lists key features with checkmarks
- Clear call-to-action

### Interactive Elements
- **Sliders**: Real-time value updates with gradient backgrounds
- **Input Fields**: Cyan focus glow
- **Buttons**: Gradient primary button with glow effect
- **Reset**: One-click return to defaults

### Mobile Optimizations
- Touch-friendly input sizes
- Optimized chart rendering
- Single-column layout
- Mobile-specific spacing

## Accessibility

- Semantic HTML structure
- Proper form labels
- ARIA attributes for screen readers
- Keyboard navigation support (Ctrl+Enter to calculate)
- High contrast text and borders
- Focus indicators on all interactive elements

## Performance

- Instant calculations (<100ms)
- Hardware-accelerated CSS animations
- Lazy chart initialization
- Efficient DOM updates
- Minimal external dependencies

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential additions for future versions:
- [ ] Export results as PDF report
- [ ] Save/load calculations
- [ ] Email results functionality
- [ ] Multi-language support (Estonian ready)
- [ ] Advanced scenarios (multi-year investments)
- [ ] Custom benchmark creation
- [ ] Dark/light theme toggle

## Customization

### Updating Industry Benchmarks

Edit `roi-calculator-data.js`:

```javascript
const industryBenchmarks = {
  yourIndustry: {
    avgROI: 150,
    avgTimeSavings: 35,
    avgRevenueIncrease: 8
  }
};
```

### Changing Default Values

Edit `roi-calculator-data.js`:

```javascript
const defaultInputs = {
  initialCost: 50000,
  annualCost: 10000,
  numEmployees: 10,
  // ... other defaults
};
```

### Styling Customization

All colors use CSS custom properties. Edit `roi-calculator.css`:

```css
:root {
  --primary-color: #8e2de2;
  --accent-color: #00e5ff;
  --bg-primary: #0a0a0a;
  /* ... other variables */
}
```

## Integration with Portfolio

The calculator is integrated into the portfolio website in three ways:

1. **Navigation Links**: Added to all page headers (index, services, testimonials)
2. **Homepage CTA**: Prominent call-to-action section with animated preview
3. **Footer Links**: Quick access from all pages

### Homepage CTA Section

Location: `index.html` (before Vision section)
- Animated chart preview with growing bars
- Feature highlights list
- "Try Calculator" button with icon animation
- Responsive two-column layout

## Support & Contact

For questions or support regarding the ROI Calculator:
- Email: info@janarkuuskpro.com
- Phone: +372 56103001

## License

© 2024 Janar Kuusk. All rights reserved.

## Disclaimer

This calculator provides estimates based on the inputs provided. Actual ROI may vary depending on implementation specifics, market conditions, and other factors. This tool is for informational purposes only and should not be considered financial advice.


