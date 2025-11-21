import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

export default {
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        'roi-calculator': './roi-calculator.html',
        'testimonials': './testimonials.html',
        'services': './services.html',
        'privacy-policy': './privacy-policy.html'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  // Plugin to copy additional files to dist
  plugins: [
    {
      name: 'copy-page-scripts',
      closeBundle() {
        const filesToCopy = [
          'testimonials-translations.js',
          'testimonials.js',
          'roi-calculator-translations.js',
          'roi-calculator-data.js',
          'roi-calculator-faq.js',
          'roi-calculator-config.js',
          'roi-calculator-ai-service.js',
          'roi-calculator.js',
          'language-switcher.js'
        ];
        
        filesToCopy.forEach(file => {
          const src = join(process.cwd(), file);
          const dest = join(process.cwd(), 'dist', file);
          if (existsSync(src)) {
            try {
              copyFileSync(src, dest);
              console.log(`✓ Copied ${file} to dist/`);
            } catch (error) {
              console.error(`✗ Error copying ${file}:`, error.message);
            }
          } else {
            console.warn(`⚠ File not found: ${file}`);
          }
        });
      }
    }
  ]
}

