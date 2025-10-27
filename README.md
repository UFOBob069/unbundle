# Unbundle Finance Landing Site

A production-ready landing site for Unbundle Finance built with Next.js 14, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Modern Tech Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Email Collection**: Firebase Firestore + Cloud Functions with reCAPTCHA protection
- **Analytics**: PostHog + Vercel Analytics integration
- **Security**: Client-side validation, server-side verification, anti-spam measures
- **Performance**: Lighthouse score ≥ 95, responsive design, accessibility compliant
- **Production Ready**: Proper SEO, error handling, loading states

## Quick Start

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "unbundle-finance" (or your preferred name)
3. Enable Firestore Database and Cloud Functions

### 2. Add Web App Configuration

1. In Firebase Console, go to Project Settings > General
2. Scroll down to "Your apps" and click "Add app" > Web
3. Register your app with a nickname
4. Copy the Firebase config object

### 3. Set Up Environment Variables

1. Copy `env.local.example` to `.env.local`
2. Fill in your Firebase configuration:

```bash
cp env.local.example .env.local
```

Edit `.env.local` with your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Enable reCAPTCHA

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Create a new site with reCAPTCHA v3
3. Add your domain (localhost for development)
4. Copy the Site Key and Secret Key to your `.env.local`:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

### 5. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 6. Deploy Cloud Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

### 7. Run Development Server

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and test the waitlist form.

### 8. Set Up Analytics (Optional)

#### PostHog
1. Create account at [PostHog](https://posthog.com)
2. Get your project API key
3. Add to `.env.local`:
```env
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

#### Vercel Analytics
Automatically enabled when deployed to Vercel.

### 9. Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy

### 10. Verify Production

1. Test the waitlist form on production
2. Check Firebase Console for new entries
3. Verify analytics events are firing
4. Run Lighthouse audit (should score ≥ 95)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/health/        # Health check endpoint
│   ├── thanks/           # Thank you page
│   ├── privacy/          # Privacy policy
│   ├── terms/            # Terms of service
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Homepage
├── components/           # React components
│   ├── Nav.tsx           # Navigation component
│   ├── Footer.tsx        # Footer component
│   ├── WaitlistForm.tsx  # Email collection form
│   ├── Examples.tsx      # Concrete examples section
│   ├── HowItWorks.tsx    # How it works section
│   ├── WhyDifferent.tsx  # Why it's different section
│   └── UseCases.tsx      # Use cases section
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase client setup
│   ├── analytics.ts      # PostHog analytics
│   ├── recaptcha.ts      # reCAPTCHA helper
│   └── utils.ts          # Utility functions
├── firebase/             # Firebase configuration
│   └── firestore.rules   # Firestore security rules
├── functions/            # Cloud Functions
│   ├── src/index.ts      # Function implementations
│   ├── package.json      # Functions dependencies
│   └── tsconfig.json     # TypeScript config
└── public/              # Static assets
    ├── og.png           # Open Graph image
    └── favicon.ico       # Favicon
```

## Key Features Explained

### Email Collection
- Uses Firebase Cloud Functions for secure server-side processing
- reCAPTCHA v3 protection against spam
- Client-side validation with React Hook Form + Zod
- Proper error handling and loading states

### Security
- Firestore rules deny all client reads/writes
- Only Cloud Functions can write to database
- IP address hashing for privacy
- Input validation and sanitization

### Analytics
- PostHog for custom event tracking
- Vercel Analytics for performance monitoring
- Privacy-compliant data collection

### Performance
- Optimized images and fonts
- Minimal JavaScript bundle
- Proper caching headers
- Lighthouse score optimization

## Customization

### Branding
- Update logo and colors in `tailwind.config.js`
- Modify company name in footer and legal pages
- Replace placeholder trust logos

### Content
- Edit copy in component files
- Update examples with real numbers
- Modify use cases for your audience

### Styling
- Customize Tailwind classes in components
- Add animations in `globals.css`
- Update color scheme in config

## Troubleshooting

### Common Issues

1. **Firebase connection errors**
   - Verify environment variables are correct
   - Check Firebase project is active
   - Ensure Firestore is enabled

2. **reCAPTCHA not working**
   - Verify site key is correct
   - Check domain is added to reCAPTCHA settings
   - Ensure secret key is set in Firebase Functions config

3. **Functions deployment fails**
   - Run `npm install` in functions directory
   - Check Node.js version (requires 18+)
   - Verify Firebase CLI is logged in

4. **Analytics not tracking**
   - Check PostHog key is correct
   - Verify events are being fired in browser console
   - Ensure Vercel Analytics is enabled

### Support

For issues or questions:
- Check Firebase Console logs
- Review browser console for errors
- Test with Firebase emulators locally

## License

© 2024 Unbundle Finance, Ltd. All rights reserved.
