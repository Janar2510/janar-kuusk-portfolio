## 2025-11-02
- **Added Workflow Landing Video in Spotlight Card**:
  - Inserted video in spotlight card between Core Skills & Expertise and AI Agent Workflow
  - Video file: Workflow landing.mov from public/images folder
  - Video plays in continuous loop inside experience-style card
  - Card inherits all .summary-spotlight-card styling (same as Head of Sales card)
  - Cyan glow border with animated gradient shine on hover
  - Spotlight hover effect with radial cyan glow
  - Card width: 80% of container (max 1200px), centered on page
  - Autoplay, loop, muted for continuous seamless playback
  - Video maintains aspect ratio with min-height constraints
  - Responsive card width: 80% (desktop) → 85% (tablet) → 90% (mobile) → 95% (small)
  - Fallback support for mp4 format

- **Transformed Professional Summary to Bento Grid Layout**:
  - Restructured section to modern bento grid (4-column responsive layout)
  - Large story card (2x2 grid span), stats card (2x1), three highlight cards (1x1 each)
  - Summary cards now use EXACT same styling as Head of Sales/experience cards
  - Cyan/blue color scheme with animated gradient borders
  - Spotlight hover effects with radial gradient glow
  - Animated border shine effect on hover
  - Perfect responsive: 4 cols → 3 cols (1200px) → 2 cols (991px) → 1 col (768px)
  - Professional, modern portfolio presentation with cohesive design system

- **Removed Scrolling Effect from Professional Summary Section**:
  - Removed scroll-animation.js and scroll-animation.css files
  - Simplified HTML structure by removing scroll wrapper elements
  - Updated CSS to provide static section styling with proper padding
  - Section now displays without animated 3D transformations
  - Maintained all content, responsive behavior, and spotlight card effects
  - Improved user experience with cleaner, more straightforward presentation

## 2025-10-28
- **Updated Portfolio Content to Match CV**:
  - Fixed education section with real credentials (Tallinn Technical University, Olustvere Technical School, Karksi-Nuia Gymnasium)
  - Removed placeholder education entries (Stanford University, AWS certifications)
  - Updated ML System employment period from "2024 - Present" to "2024 - 2025"
  - Corrected contact email to info@janarkuuskpro.com
  - Updated statistics: 8+ years in sales leadership, 4 companies led
  - Updated translations for both English and Estonian versions
  - Ensured all work experience dates and descriptions match CV accurately

- **Updated Featured Projects**:
  - Replaced "Predictive Analytics Platform" with "FusionAI Enterprise Suite"
  - Added description of AI-enhanced modular ERP platform with 23 core modules
  - Updated tech stack: React, FastAPI, LangChain, PostgreSQL
  - Updated both English and Estonian translations for the new project
  - Added GitHub link to FusionAI project (https://github.com/Janar2510/FUSION-AI-Enterprise-Suite-AI-Driven-modular-ERP-Platform)
  - Replaced all project images with actual PNG files from user
  - Adjusted Saletoru CRM image size to 70% for better card fit
  - Updated third project to "AgentFlow" with updated description and tech stack
  - Added GitHub link to AgentFlow project (https://github.com/Janar2510/AgentFlow)
  - Updated both English and Estonian translations for AgentFlow project
  - Enhanced language switcher to update technology tags when switching languages
  - Verified all project translations are working correctly for both EN/ET languages
  - Fixed education section translations structure to use items array format
  - Added console logging and error handling to language switcher for debugging
  - Fixed language toggle initialization checks

- **Implemented Working Contact Form**:
  - Created contact-form.js with email sending functionality
  - Added Formspree integration support (free email service)
  - Implemented mailto fallback for immediate functionality
  - Created contact-form.css with beautiful notification styles
  - Added form validation and error handling
  - Success/error notifications with animations
  - Button loading states (sending, success, error)
  - Full bilingual support (EN/ET) for form and notifications
  - Created CONTACT_FORM_SETUP.md with detailed setup instructions
  - Configured Formspree endpoint (https://formspree.io/f/xdkpeyln) for direct email sending to info@janarkuuskpro.com

- **Updated Header Design**:
  - Added JanarKuusk logo.png to header
  - Made header 100% transparent (no background or blur)
  - Logo displays next to name and subtitle
  - Added text shadows for better readability on transparent background
  - Logo hover effect with scale animation
  - Responsive logo sizing for mobile devices
  - Navigation links have text shadows for visibility

## 2025-10-17
- **Added GitHub Link to Saletoru CRM Project**: Updated the "View Project" button in the Featured Projects section to link to the actual GitHub repository (https://github.com/Janar2510/AI-Powered-Saleguru-CRM) with proper target="_blank" and security attributes.
- **Created Public Images Directory Structure**: 
  - Added `/public/images/` folder with organized subdirectories for projects, logos, and avatars
  - Created comprehensive README.md with image guidelines and upload instructions
  - Updated project cards to use actual image elements instead of emoji placeholders
  - Added fallback support with graceful degradation to emoji placeholders if images fail to load
  - Created SVG placeholder images for all three featured projects with brand-consistent gradients
  - Added CSS styling for project images with hover effects and proper object-fit scaling

## 2025-10-15
- Update Core Skills & Expertise layout to single-row horizontal scroll by switching `.skills-grid` to a non-wrapping flex container with `overflow-x: auto` using spacing variables.
- Round skill cards by changing `.skill-category` `border-radius` to `var(--radius-xl)` and setting fixed flex-basis for consistent card width.
# Changelog

## [1.0.0] - 2024-12-19

### Added
- **Portfolio Website Structure**
  - Complete HTML5 structure with semantic markup
  - Responsive navigation with mobile hamburger menu
  - Hero section with animated floating cards
  - About section with skills showcase
  - Projects section featuring Saletoru CRM and other projects
  - Contact section with social links
  - Footer with copyright information

- **CSS Custom Properties System**
  - Comprehensive design system with CSS custom properties
  - Consistent spacing system (--space-* variables)
  - Color palette with primary, secondary, and accent colors
  - Typography scale and font sizing
  - Card system with consistent styling
  - Gradient definitions for animations

- **Agent Workflow Page**
  - Interactive workflow visualization system
  - WorkflowNode.css with gradient border animations
  - Real-time execution monitoring
  - Multiple node states (idle, active, executing, data-flow)
  - Animated connection lines between nodes
  - Control panel with execution controls
  - Status indicators and progress tracking

- **Saletoru CRM Project Integration**
  - Featured project card for Saletoru CRM
  - Project description highlighting AI-powered features
  - Technology stack display (React, Node.js, OpenAI, PostgreSQL)
  - Interactive project links and overlays
  - Consistent styling with gradient borders

- **Interactive Features**
  - Smooth scrolling navigation
  - Mobile-responsive design
  - Intersection Observer for scroll animations
  - Parallax effects on hero section
  - Typing animation for hero title
  - Ripple effects on buttons
  - Hover animations on project cards

- **Responsive Design**
  - Mobile-first approach
  - Breakpoints for tablet and desktop
  - Flexible grid layouts
  - Touch-friendly navigation
  - Optimized typography scaling

### Technical Implementation
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern features including custom properties, grid, flexbox
- **JavaScript**: ES6+ features, DOM manipulation, event handling
- **Font Awesome**: Icon library integration
- **CSS Animations**: Keyframe animations and transitions
- **Gradient Animations**: Conic gradients with CSS custom properties

### Design System
- **Color Scheme**: Dark theme with neon accents
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 8px grid system throughout
- **Cards**: Consistent padding, borders, and shadows
- **Animations**: Smooth transitions and hover effects
- **Gradients**: Brand gradient for text and borders

### Browser Support
- Modern browsers with CSS custom properties support
- Mobile browsers with touch event support
- Responsive design for all screen sizes
- Fallbacks for older browsers

### Performance
- Optimized CSS with custom properties
- Efficient JavaScript with event delegation
- Lazy loading for animations
- Minimal external dependencies
