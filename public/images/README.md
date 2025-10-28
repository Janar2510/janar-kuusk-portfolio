# Images Directory

This directory contains all images used in the portfolio website.

## Folder Structure

```
public/images/
├── projects/          # Project screenshots and mockups
├── logos/            # Company logos and skill icons
├── avatars/          # Profile pictures and team photos
└── README.md         # This file
```

## Image Guidelines

### Projects Folder (`/projects/`)
- **Format**: PNG, JPG, or WebP
- **Size**: Recommended 800x600px or 1200x800px
- **Naming**: Use descriptive names like `saletoru-crm-dashboard.png`
- **Usage**: Project screenshots, mockups, and demos

### Logos Folder (`/logos/`)
- **Format**: PNG with transparent background preferred
- **Size**: 256x256px for skill icons, 512x512px for company logos
- **Naming**: Use clear names like `react-logo.png`, `nodejs-logo.png`
- **Usage**: Technology logos, company logos, skill icons

### Avatars Folder (`/avatars/`)
- **Format**: PNG or JPG
- **Size**: 400x400px or 512x512px (square)
- **Naming**: Use names like `profile-picture.jpg`
- **Usage**: Profile photos, team member photos

## How to Upload Images

1. **Drag and drop** images directly into the appropriate folder
2. **Use Finder** to copy images to the correct directory
3. **Update HTML** to reference the new image paths

## Example Usage in HTML

```html
<!-- Project image -->
<img src="public/images/projects/saletoru-crm-dashboard.png" alt="Saletoru CRM Dashboard">

<!-- Logo -->
<img src="public/images/logos/react-logo.png" alt="React Logo">

<!-- Avatar -->
<img src="public/images/avatars/profile-picture.jpg" alt="Profile Picture">
```

## Current Project Images Needed

- `saletoru-crm-dashboard.png` - Main dashboard screenshot
- `saletoru-crm-mobile.png` - Mobile app screenshot
- `ecommerce-analytics.png` - Analytics dashboard
- `portfolio-website.png` - Portfolio website screenshot

## Optimization Tips

- Use **WebP** format for better compression
- Compress images before uploading (use tools like TinyPNG)
- Keep file sizes under 500KB for faster loading
- Use descriptive alt text for accessibility
