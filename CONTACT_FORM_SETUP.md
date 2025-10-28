# Contact Form Setup Guide

Your contact form is now ready to send emails! Choose one of the following options:

## Option 1: Formspree (Recommended - Free & Easy) ⭐

Formspree is a free service that handles form submissions without any backend code.

### Setup Steps:

1. **Sign up at Formspree:**
   - Go to: https://formspree.io
   - Sign up for a free account (up to 50 submissions/month)

2. **Create a new form:**
   - Click "New Form"
   - Set email to: `info@janarkuuskpro.com`
   - Copy the form endpoint (looks like: `https://formspree.io/f/xzzbkdnw`)

3. **Update your code:**
   - Open `contact-form.js`
   - Find line 35: `const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';`
   - Replace `YOUR_FORM_ID` with your actual form ID
   - Example: `const formspreeEndpoint = 'https://formspree.io/f/xzzbkdnw';`

4. **Done!** 🎉
   - Test the form on your website
   - You'll receive emails at info@janarkuuskpro.com

### Features:
- ✅ No backend required
- ✅ Spam protection included
- ✅ Email notifications
- ✅ Form submissions dashboard
- ✅ Free for up to 50 submissions/month

---

## Option 2: Mailto Fallback (Already Working) ✉️

The form currently uses a **mailto** fallback, which:
- Opens the user's default email client
- Pre-fills recipient, subject, and message
- Works immediately (no setup required)

**Note:** This method requires the user to have an email client configured on their device.

---

## Option 3: EmailJS (Alternative Free Service)

If you prefer EmailJS:

1. Sign up at: https://www.emailjs.com
2. Create an email service
3. Get your Service ID, Template ID, and Public Key
4. Update `contact-form.js` with EmailJS integration

---

## Testing Your Contact Form

1. **Open your portfolio:** http://localhost:3000
2. **Scroll to Contact section**
3. **Fill out the form:**
   - Name: Test User
   - Email: test@example.com
   - Subject: Test Message
   - Message: This is a test

4. **Click "Send Message"**
5. **Expected behavior:**
   - Button shows "Sending..."
   - Success message appears
   - Form resets
   - You receive an email (if Formspree is configured)

---

## Translations

The contact form supports both English and Estonian. All form fields and messages will automatically translate when the language is changed.

### Contact Form Translations:
- Form placeholders
- Button text
- Success/error messages
- Contact section titles

---

## Troubleshooting

### Form doesn't submit:
- Check browser console for errors (F12)
- Verify Formspree endpoint is correct
- Check internet connection

### No email received:
- Check spam folder
- Verify Formspree account email
- Check Formspree dashboard for submissions

### Button stays on "Sending...":
- Formspree endpoint might be incorrect
- Network issue - check console
- Will fallback to mailto after timeout

---

## Security Features

✅ **Client-side validation** - Required fields checked
✅ **Spam protection** - Formspree includes reCAPTCHA
✅ **No exposed credentials** - No API keys in frontend
✅ **HTTPS required** - Secure form submission

---

## Free Tier Limits

**Formspree Free:**
- 50 submissions per month
- Email notifications
- Spam filtering
- Form dashboard

**Upgrade if needed:**
- More submissions: $10/month for 1,000 submissions
- Custom integrations available

---

## Next Steps

1. ✅ Sign up for Formspree
2. ✅ Get your form endpoint
3. ✅ Update `contact-form.js` line 35
4. ✅ Test the form
5. ✅ Deploy to production

---

## Support

If you need help:
- Formspree Documentation: https://help.formspree.io
- EmailJS Documentation: https://www.emailjs.com/docs/

**Your contact form is ready to use with mailto fallback right now, and can be upgraded to Formspree in 2 minutes!** 🚀

