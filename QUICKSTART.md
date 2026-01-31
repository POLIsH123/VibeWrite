# 🚀 VibeWrite.ai - Quick Start Guide

Get your app running in 5 minutes!

## 🎯 Fast Track Setup

### 1. Install Dependencies (1 min)
```bash
cd backend
npm install
```

### 2. Get API Keys (1 min)

**Good News: No Hugging Face API Key Needed! 🎉**

The app uses local AI models that auto-download on first run. You only need Stripe!

**Stripe** (Free):
- Go to: https://dashboard.stripe.com/test/apikeys
- Copy "Secret key" (starts with `sk_test_`)
- Go to: https://dashboard.stripe.com/test/products
- Click "+ Add product"
- Name: "VibeWrite Pro", Price: $10/month recurring
- Copy the Price ID (starts with `price_`)

### 3. Configure Environment (30 seconds)
```bash
# The .env file is already there with placeholders!
# Just open it and fill in your Stripe keys:
cd backend
nano .env  # or open with any text editor

# Replace these lines with your actual keys:
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
STRIPE_PRICE_ID=price_your_actual_id_here
```

**That's it! No Hugging Face API key needed!**

### 4. Run the App (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Should see: "Server running on: http://localhost:3000"
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python3 -m http.server 8000
# Or: npx http-server -p 8000
```

**Open Browser:**
```
http://localhost:8000
```

## ✅ Test Checklist

- [ ] Enter your name
- [ ] Paste text: "I'm excited about this project"
- [ ] Select "Hype" vibe
- [ ] Click "Rewrite"
- [ ] See result and copy it
- [ ] Try all 5 vibes
- [ ] Hit the 5 rewrite limit
- [ ] Test Stripe with card: `4242 4242 4242 4242`

## 🎨 Customization Quickies

**Change colors** - Edit `frontend/css/style.css`:
```css
:root {
    --primary: #FF3B8F;  /* Your color here */
}
```

**Change pricing** - Create new Stripe product and update:
- `.env` → `STRIPE_PRICE_ID`
- `frontend/index.html` → pricing section

**Change app name** - Search and replace "VibeWrite.ai" in:
- `frontend/index.html`
- `frontend/css/style.css`
- `backend/server.js`

## 🚀 Deploy in 10 Minutes

**Backend (Render.com):**
1. Push code to GitHub
2. New Web Service on Render
3. Connect repo → Select `backend` folder
4. Add env vars from your `.env`
5. Deploy! → Copy URL

**Frontend (Vercel):**
1. `cd frontend`
2. Update `API_URL` in `app.js` to Render URL
3. `npm install -g vercel`
4. `vercel`
5. Done!

**Update Stripe Webhook:**
- Dashboard → Webhooks → Add endpoint
- URL: `https://your-render-url.com/api/webhook`
- Events: `checkout.session.completed`
- Copy webhook secret to Render env vars

## 🆘 Quick Fixes

**Can't reach backend?**
```bash
# Check if running
curl http://localhost:3000/health

# Should return: {"status":"healthy"}
```

**Stripe not working?**
- Use test mode keys (start with `sk_test_`)
- Test card: `4242 4242 4242 4242`
- Any future date, any CVC

**AI taking long on first run?**
- Model downloads on first startup (~80MB)
- Takes 1-2 minutes first time only
- Watch server logs for progress
- After first load, it's instant!

**Want better AI quality?**
- Edit `backend/ai.js` line 56
- Change to: `'Xenova/gpt2'` or `'Xenova/t5-small'`

**Daily limit not resetting?**

Check the full README.md for detailed instructions!

---

**You're ready to ship! 🎉**
