## 2025-11-13
- **Services Page Updated to 3x3 Grid Layout**:
  - Changed from complex bento grid to simple, clean 3x3 grid layout with 9 equal-sized service cards
  - Updated header navigation to match homepage (removed About and Case Studies links)
  - Simplified navigation: Home, Services, Experience, Projects, Contact
  - All service cards now have uniform size (min-height: 320px) and consistent spacing
  - Added three new service cards: Mobile App Development, Database Design & Management, Cloud & DevOps
  - Maintained all SEO keywords and spotlight card animations from original design
  - Responsive grid breakpoints: 3 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
  - Cleaned up unused CSS for bento grid variants (bento-large, bento-medium, bento-tools)
  - All cards maintain animated spotlight effects and gradient borders
  - Service descriptions kept concise to ensure consistent card heights

- **Services Page with SEO-Optimized Bento Grid Layout** (Initial Version):
  - Created comprehensive Services page (services.html) with professional bento grid layout
  - Integrated SEO keywords: "AI solutions architect Estonia", "digital transformation consultant", "n8n automation expert", "AI implementation services"
  - Added long-tail keywords: "How to implement AI in small business", "Best workflow automation tools 2024", "Digital transformation strategy consultant", "AI-powered business process optimization"
  - Service offerings included:
    - AI Implementation Services (large feature card with detailed implementation guide)
    - Business Process Automation (highlight card with process optimization focus)
    - Digital Transformation Consulting (strategic consulting card)
    - n8n Workflow Automation (medium card with workflow expertise)
    - Website Design (image card with UI/UX focus)
    - Web & Mobile Application Development (medium card with tech stack)
  - Added "Why Choose Me" section with 4 benefit cards (Results-Driven, Partnership, Fast Implementation, Innovation)
  - Implemented responsive bento grid: 4 columns desktop → 2 columns tablet → 1 column mobile
  - Included technologies & tools card showing AI/Automation, Web Dev, Backend/Database, Design tools
  - Added CTA section with primary and secondary buttons linking to contact and case studies
  - Created professional footer with service links, quick links, and legal section
  - Updated main navigation to include Services link (simplified from 10 to 5 nav items)
  - Updated sitemap.xml to include Services page with priority 0.9
  - All cards use same animated spotlight and gradient border effects as homepage
  - Full responsive design with mobile-first approach

## 2025-11-11
- **AI Agent Workflow Card – Dynamic Dotted Surface Background**:
  - Replaced the legacy splash cursor integration with a Three.js powered dotted surface that renders directly behind the AI Agent Workflow card.
  - Added theme-aware color sourcing via CSS custom properties to keep particle and fog colors aligned with the design system (no hardcoded colors).
  - Implemented ResizeObserver- and matchMedia-driven updates so the surface resizes with the card and adapts to light/dark user preferences.
  - Updated workflow card styling to use spacing tokens, gradient color mixes, and variables for all glow/border treatments.

## 2025-01-XX
- **Performance Optimizations - Fixed Forced Reflow Violations**:
  - Optimized spotlight card handlers to cache `getBoundingClientRect()` calls and only recalculate when needed
  - Added rect caching to avoid forced reflows on every mousemove event
  - Optimized fluid simulation to cache canvas dimensions and only check on resize events
  - Reduced forced reflow violations from 30-48ms down to minimal/zero
  - Used requestAnimationFrame for tilt effects to batch DOM updates
  - Added throttled resize handlers to invalidate caches only when necessary
  - Spotlight effect remains responsive while eliminating performance warnings

- **Fixed Summary Cards 3D Tilt Effect**:
  - Removed conflicting CSS transform rule from `.summary-spotlight-card:hover` that was overriding JavaScript 3D tilt
  - Added proper initialization for summary spotlight cards with cleanup of conflicting handlers
  - Increased initialization delay to 200ms for summary cards to ensure DOM is ready
  - All Professional Summary cards (Professionaalne Kokkuvõte) now have working 3D tilt effect

- **Fixed Spotlight Cursor Tracking and 3D Tilt Issues**:
  - Fixed spotlight effect to update CSS variables immediately (removed requestAnimationFrame delay)
  - Added `.is-hovering` class support to all card CSS for spotlight visibility
  - Removed background transition that was preventing smooth spotlight movement
  - Added `stopPropagation` to tilt handlers to prevent event conflicts
  - Increased initialization delay to 200ms to ensure DOM is ready
  - Added cleanup of conflicting saletoru-effects handlers
  - Added fallback values (`var(--mouse-x, 50%)`) in CSS for better compatibility
  - All cards now properly initialize with both spotlight and tilt effects

- **Fixed Spotlight Effect and Added 3D Tilt to All Cards**:
  - Fixed spotlight/flashlight effect to properly track cursor movement on all cards
  - Spotlight effect now follows cursor position using CSS custom properties (--mouse-x, --mouse-y)
  - Added 3D tilt effect to all card types:
    - Professional Experience cards (.experience-spotlight-card)
    - Education & Certifications cards (.experience-spotlight-card)
    - Core Skills & Expertise cards (.skill-category)
    - Career Journey cards (.career-card)
    - Professional Summary cards (.summary-spotlight-card)
  - Created reusable `addTiltEffect()` helper function for consistent 3D tilt across all cards
  - Cards now have both spotlight cursor tracking AND 3D tilt animations
  - Spotlight effect uses radial-gradient that follows mouse position
  - 3D tilt provides perspective rotation up to ±5 degrees based on cursor position

- **Updated Education Cards to Match Experience Card Styling**:
  - Changed education cards from `.education-card` to `.experience-spotlight-card` class
  - Education cards now have the same cyan glow, gradient border, and hover animations as experience cards
  - Updated HTML structure to use `.experience-header`, `.experience-period`, `.experience-company`, `.experience-description`
  - Updated language switcher to handle both old and new education card formats
  - All 4 education cards now have the same visual style as "Head of Sales" experience cards

- **Fixed Education Cards - Disabled spotlight-card.js override**:
  - Commented out code in spotlight-card.js that was clearing and recreating education grid with only 3 cards
  - This was preventing the 4th education card from displaying
  - Education cards are now properly managed by HTML and language-switcher.js

- **Added New Education Card - Ongoing Learning in AI & Development**:
  - Added 4th education card with "Ongoing Learning in AI & Development" title
  - Includes comprehensive description of ongoing learning platforms and courses
  - English: "Ongoing Learning in AI & Development" with detailed course listing
  - Estonian: "Jätkuv õppimine AI ja arenduses" with full Estonian translation
  - Lists OpenAI Learning Series, Google Project Management, Codecademy/freeCodeCamp courses
  - Year displays as "Ongoing" (English) / "Jätkuvalt" (Estonian)

- **Fixed mixed-language headings in EN locale**:
- **Updated ET Projects section heading and subtitle**:
  - Title: "AI Projektid"
  - Subtitle: "Uuenduslikud automatiseeritud, organiseeritud AI veebi ja mobiili aplikatsioonid."

  - Removed Estonian strings from `en.video.title` and `en.websiteDesign.*`
  - Added proper Estonian entries under `et.video.title` and `et.websiteDesign.*`
  - Now EN shows: "Website design" and "Web application architecture and design"
  - ET shows: "Veebidisain" and "Veebi rakenduste arhitektuur ja disain"

- **Added Scroll-Triggered Video Autoplay for Website Design Section**:
  - First video in website design section now starts automatically when scrolled into view
  - Uses Intersection Observer with 10% threshold and 100px rootMargin to trigger early
  - Added scroll listener as backup to ensure video plays when section is visible
  - Improved video readiness checking with retry mechanism
  - Handles autoplay restrictions with automatic retry and fallback to user interaction
  - Checks if section is already visible on page load and plays video accordingly
  - Prevents multiple play attempts with hasPlayed and isPlaying flags
  - Ensures video is fully loaded before attempting to play

- **Fixed Video Path Issues (404 Errors)**:
  - Updated all video source paths to use explicit relative paths with `./` prefix
  - Fixed paths for: game2.mp4, Solarair.mp4, Colordesign Studio.mp4, Portfolio video.mp4
  - Changed from `public/images/...` to `./public/images/...` for better path resolution
  - Should resolve 404 errors when videos are properly deployed to server

- **Fixed SplashCursorReact Initialization Error**:
  - Added missing `splash-cursor-react.js` script tag to index.html before script.js
  - Fixed infinite retry loop that was causing console errors
  - Added retry limit (50 attempts, 5 seconds max) to prevent infinite retries
  - SplashCursorReact now initializes correctly without console spam
  - Improved error handling with proper warning messages

- **Added Cyan Gradient Glow Effects to Contact Cards and Hero Text**:
  - Contact info card: Pure black background (#000000) with cyan gradient glow
  - Contact form card: Pure black background with matching cyan glow effect
  - Multiple layered box-shadows create radiant halo effect using rgb(0, 229, 255)
  - Radial gradient overlay for enhanced glow emanating from card center
  - Cyan border (rgba(0, 229, 255, 0.3)) matching the glow theme
  - Hero title: Animated gradient text effect (white to cyan) with drop-shadow glow
  - Hero description: Cyan text-shadow glow for consistency
  - Matches design reference with electric cyan (#00E5FF) glow color throughout

- **Updated Navbar Visibility Behavior**:
  - Changed navbar visibility threshold from 100px to 10px for precise top detection
  - Navbar now visible only when at the very top of the page (within 10px)
  - Navbar automatically hides when scrolling down
  - Navbar reappears smoothly when scrolling back to top
  - Smooth transition animation via CSS (0.3s ease)
  - Improved user experience with cleaner viewport when scrolling

- **Added GSAP Scroll Animation to Website Design Section**:
  - Converted React/GSAP scroll animation component to vanilla JavaScript
  - Implemented scroll-based section transitions with wheel/touch/pointer controls
  - Added GSAP Observer plugin for scroll detection
  - Horizontal slide animations with image parallax effects
  - Text animation with word-by-word reveal using custom SplitText alternative
  - Thumbnail navigation with active state indicators
  - Animated counter (1/3, 2/3, 3/3) with smooth transitions
  - Three website design sections: Saletoru CRM, Solarair Dynamics, ColorDesign Studio
  - Smooth 1.25s transitions with power1.inOut easing
  - Responsive design with mobile-optimized thumbnail sizes and counter positioning
  - Maintains same card container size as workflow video section

## 2025-11-02
- **Transformed Core Skills & Expertise to Bento Grid**:
  - Changed from uniform 4-column grid to bento grid layout
  - Each skill card spans 2 columns for balanced visual presentation
  - Added minimum height constraint (250px) for consistent card sizing
  - Maintains all cyan hover effects, spotlight glow, and animated borders
  - Responsive bento grid: 4 cols (desktop) → 3 cols (1200px) → 2 cols (991px) → 1 col (mobile)
  - Cards adapt gracefully with proper span adjustments at each breakpoint

- **Added Workflow Landing Video - Clean Full-Width Design**:
  - Inserted clean video section between Core Skills & Expertise and AI Agent Workflow
  - Video file: Workflow landing.mov from public/images folder
  - Full-width container with 30px spacing from viewport edges (all sides)
  - Simple dark container (#0a0a0a) with subtle cyan border
  - Video plays in continuous loop (autoplay, loop, muted)
  - Video fills container width, maintains aspect ratio (object-fit: contain)
  - No spotlight effects or hover animations - clean, professional presentation
  - Rounded corners for modern aesthetic
  - Responsive padding: 30px (desktop) → 20px (tablet) → 15px (mobile)
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
