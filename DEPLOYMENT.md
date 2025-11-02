# Deploying Unbundle to Vercel

This guide will help you deploy both the main Unbundle Finance website and the Solana demo to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- Git repository pushed to GitHub/GitLab/Bitbucket

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to https://vercel.com/new
2. Import your Git repository
3. Select the repository containing this project

### 2. Configure Build Settings

Vercel should auto-detect Next.js, but verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `app`
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `.next` (should auto-detect)
- **Install Command**: `npm install` (should auto-detect)

### 3. Add Environment Variables

In your Vercel project settings, go to **Settings** → **Environment Variables** and add the following:

```
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_FAUCET_PROGRAM_ID=AacgyqyCJhybFsvfc7GfAvA5GjV9oc6nqhNGJNSKW477
NEXT_PUBLIC_SPLITTER_PROGRAM_ID=DMrAqzweWu8UQvCvGK2yfrGwUdkjiav4MafRV1SKxx6j
NEXT_PUBLIC_GGL_MINT=A4LSQwKv81VU8QJjciJ6FjmEh1auQNWo4jjPN6LrJBCg
NEXT_PUBLIC_GGL_SEARCH_MINT=CmCvVkLbHBCDh99ofVBnYqSKbRoonCeTJzNdwyD9163t
NEXT_PUBLIC_GGL_YT_MINT=Cwhfr2HjTswHqVVqXk5vnXBgrmERfiCdADXg5UapvQD6
NEXT_PUBLIC_GGL_CLOUD_MINT=7KDYsV1akCjcEp4WnSJD3dJHxmeQ6WS6i6bR4tZvM7w9
NEXT_PUBLIC_GGL_OTHER_MINT=9PbfnELF689JAyudsBXZ9NmF1onoB5ygTiwnuJnPq2Lw
```

For the main website, also add any Firebase/analytics variables from your `env.local.example`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=unbundle-4b624.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=unbundle-4b624
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key (optional)
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com (optional)
```

### 4. Deploy

Click **Deploy** and Vercel will:
1. Install dependencies
2. Build your Next.js app
3. Deploy to a production URL

### 5. Verify Deployment

Once deployed, your site will be available at:
- **Production**: `https://your-project.vercel.app`
- **Demo**: `https://your-project.vercel.app/app`

Test the following:
- ✅ Main homepage loads
- ✅ "Try Live Demo" button works
- ✅ Demo page loads
- ✅ Wallet connection works
- ✅ Claim/Stake/Redeem functions work

## Custom Domain (Optional)

To add a custom domain like `unbundle.finance`:

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your domain
4. Update your DNS records as instructed

## Deployed Programs

The demo uses these programs deployed on Solana devnet:

- **Faucet**: `AacgyqyCJhybFsvfc7GfAvA5GjV9oc6nqhNGJNSKW477`
- **Splitter**: `DMrAqzweWu8UQvCvGK2yfrGwUdkjiav4MafRV1SKxx6j`

These programs are already initialized and ready to use!

## Troubleshooting

### Build Fails

If the build fails, check:
- All environment variables are set correctly
- Dependencies are properly listed in `app/package.json`
- There are no TypeScript errors

### Demo Not Working

If the demo doesn't work after deployment:
- Verify all `NEXT_PUBLIC_*` variables are set
- Check browser console for errors
- Ensure users have Solana devnet tokens (they can get them from faucets)

### Environment Variables Not Loading

Remember:
- All client-side variables MUST start with `NEXT_PUBLIC_`
- Changes to environment variables require a redeploy
- Clear browser cache after redeployment

## Continuous Deployment

Vercel automatically:
- Deploys every push to your `main` branch to production
- Creates preview deployments for pull requests
- Provides deployment previews for every commit

## Support

For issues:
- Check Vercel deployment logs
- Review browser console errors
- Check Solana devnet status

---

**Your Unbundle Finance site with Solana demo is now live!** 🚀

