# 🚀 Vercel Deployment Guide for VibeWrite.ai

## ✅ Pre-Deployment Checklist

- [x] Moved `.env` file to root directory
- [x] Updated backend to read `.env` from root
- [x] Created `vercel.json` configuration
- [x] Updated database for serverless compatibility
- [x] Created root `package.json`

## 🔧 Vercel Configuration

### Project Settings:
- **Framework Preset**: Other
- **Root Directory**: `./` (leave empty or use dot)
- **Build Command**: `cd backend && npm install`
- **Output Directory**: `backend`
- **Install Command**: `npm install`

### Environment Variables to Set in Vercel Dashboard:

Copy these from your `.env` file:

```
NODE_ENV=production
OPENAI_API_KEY=UROPENAIAPIKEY
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

**Important**: Update `FRONTEND_URL` to your Vercel domain once deployed!

## 📋 Step-by-Step Deployment

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your GitHub repository

### 2. Configure Project
- **Framework Preset**: Other
- **Root Directory**: Leave empty (uses root)
- **Build Command**: `cd backend && npm install`
- **Output Directory**: `backend`

### 3. Set Environment Variables
1. Go to Project Settings → Environment Variables
2. Add all variables from your `.env` file
3. Set `NODE_ENV` to `production`

### 4. Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Get your deployment URL

### 5. Update Frontend URL
1. Copy your Vercel deployment URL
2. Go back to Environment Variables
3. Update `FRONTEND_URL` to your new domain
4. Redeploy

## 🗄️ Database Notes

- **Development**: Uses local SQLite file (`backend/vibewrite.db`)
- **Production**: Uses temporary SQLite in `/tmp` directory
- **⚠️ Important**: Data is lost on serverless restarts in production
- **Recommendation**: For production, consider upgrading to:
  - Vercel Postgres
  - PlanetScale
  - Supabase
  - Railway

## 🔍 Troubleshooting

### Build Fails
- Check that all dependencies are in `backend/package.json`
- Verify Node.js version compatibility (>=18.0.0)

### API Routes Don't Work
- Ensure `vercel.json` routes are correct
- Check environment variables are set
- Verify API endpoints start with `/api/`

### Database Issues
- Community features use temporary storage in production
- Data resets on function cold starts
- Consider persistent database for production use

## 🎯 Post-Deployment

1. Test all features:
   - Text rewriting
   - Community contributions
   - Stripe integration (if configured)

2. Update any hardcoded URLs in frontend

3. Set up monitoring and error tracking

## 🚀 You're Ready!

Your VibeWrite.ai app should now be live on Vercel with:
- ✅ Ultra-modern landing page
- ✅ OP dashboard with glass morphism
- ✅ Community system (locked until 50 scripts)
- ✅ AI text rewriting
- ✅ Stripe integration ready
- ✅ Serverless deployment