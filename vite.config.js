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
  }
}

