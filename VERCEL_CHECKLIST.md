# Vercel Deployment Checklist ✅

## Pre-Deployment Checklist

### Code Ready
- [x] Main website with "Try Live Demo" button
- [x] Demo app at `/app` route
- [x] Back to home link on demo
- [x] Hydration error fixed
- [x] All environment variables documented
- [x] Vercel configuration file created

### Files to Commit
- [x] `app/page.tsx` - Updated with demo button
- [x] `app/app/page.tsx` - Updated with back link
- [x] `app/components/ConnectWallet.tsx` - Fixed hydration
- [x] `app/.env.local` - (Don't commit! Add to Vercel manually)
- [x] `app/vercel.json` - Vercel config
- [x] `README.md` - Updated with deployment info
- [x] `DEPLOYMENT.md` - Detailed deployment guide

## Deployment Steps

### 1. Commit and Push
```bash
git add .
git commit -m "Add demo link and prepare for Vercel deployment"
git push origin main
```

### 2. Create Vercel Project
1. Go to https://vercel.com/new
2. Import your Git repository
3. **Important**: Set **Root Directory** to `app`
4. Framework should auto-detect as **Next.js**

### 3. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

**Required for Demo:**
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

**Optional (for analytics):**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=unbundle-4b624.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=unbundle-4b624
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### 4. Deploy
Click **Deploy** and wait for build to complete (~2-3 minutes)

### 5. Test Deployment

Once live, test:
- [ ] Main page loads at `your-project.vercel.app`
- [ ] "Try Live Demo" button works
- [ ] Demo loads at `your-project.vercel.app/app`
- [ ] Wallet connection works
- [ ] Claim GGL tokens works
- [ ] Stake GGL works
- [ ] Redeem works
- [ ] "Back to Home" link works

## Post-Deployment

### Custom Domain (Optional)
1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `unbundle.finance`)
3. Update DNS as instructed

### Share Your Demo!
Your live demo URL: `https://your-project.vercel.app`
Demo page: `https://your-project.vercel.app/app`

## Troubleshooting

### Build Fails
- Check Root Directory is set to `app`
- Verify all dependencies in `app/package.json`
- Check deployment logs in Vercel dashboard

### Environment Variables Not Working
- Must start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check for typos

### Demo Not Working
- Users need Phantom/Solflare wallet
- Users need Solana devnet selected
- Users can get devnet SOL from https://faucet.solana.com

---

## Ready to Deploy? 🚀

Your Unbundle Finance platform with Solana demo is ready for the world!

The programs are already deployed and initialized on Solana devnet, so anyone can use your demo immediately after you deploy to Vercel.

