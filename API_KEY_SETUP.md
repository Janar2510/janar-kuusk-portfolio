# API Key Setup Instructions

## Quick Setup

1. **Get Your Free Google Gemini API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

2. **Add Your API Key to the Calculator:**
   - Open `roi-calculator-config.js`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   GEMINI_API_KEY: 'your-actual-api-key-here',
   ```

3. **That's it!** The calculator will now use your API key automatically.

## Important Notes

- **Keep your API key private** - Don't commit it to public repositories
- **Free tier limits:** Google provides a generous free tier, but monitor usage
- **Security:** For production, consider using environment variables or a backend API
- **Cost:** The free tier is usually sufficient for personal/portfolio use

## Current Configuration

- **Model:** `gemini-1.5-flash` (fast and cost-effective)
- **Max Output:** 2048 tokens (comprehensive analysis)
- **Temperature:** 0.7 (balanced creativity/accuracy)

## Troubleshooting

If AI analysis doesn't work:
1. Check that your API key is correctly set in `roi-calculator-config.js`
2. Verify the API key is active in Google AI Studio
3. Check browser console for error messages
4. The calculator will automatically fall back to basic analysis if API fails


