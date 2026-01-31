# 🎨 VibeWrite.ai

Transform boring text into pure vibes! VibeWrite.ai is an AI-powered text rewriting tool that lets you rewrite any text in 5 unique styles: Funny, Hype, Savage, Cute, and Professional.

## ✨ Features

- **5 Unique Vibes**: Choose from Funny 😂, Hype 🔥, Savage 💀, Cute 💖, or Professional 💼
- **AI-Powered**: Uses Hugging Face's advanced language models
- **Instant Rewrites**: Get creative rewrites in seconds
- **Free & Pro Plans**: 5 free rewrites per day, unlimited with Pro ($10/month)
- **Soft Login**: No complex authentication - just enter your name once
- **Modern UI**: Clean, responsive design that works on all devices
- **Stripe Integration**: Secure payment processing for subscriptions

## 🚀 Tech Stack

### Frontend
- Pure HTML, CSS, JavaScript (no frameworks!)
- Modern CSS with CSS Variables and Animations
- Responsive design for mobile and desktop
- LocalStorage for user preferences

### Backend
- Node.js + Express
- Hugging Face Inference API for AI rewrites
- Stripe for payment processing
- CORS enabled for frontend communication

## 🤖 AI Pipeline Details

### Local AI Models (No API Keys!)

The app uses **@xenova/transformers** to run AI models directly on your server:

**Current Model**: `Xenova/distilgpt2`
- Lightweight (80MB)
- Fast inference
- Runs on CPU (no GPU needed)
- Auto-downloads on first startup

**First Run**: The model will download automatically. You'll see:
```
🤖 Loading AI model... (this may take a minute on first run)
✅ AI model loaded and ready!
```

**Alternative Models** (edit `backend/ai.js` line 56):

```javascript
// Faster, smaller (current default)
'Xenova/distilgpt2'

// Better quality, slightly larger
'Xenova/gpt2'

// Best for text-to-text tasks
'Xenova/t5-small'

// Multilingual support
'Xenova/distilbert-base-multilingual-cased'
```

**Benefits**:
- ✅ No API costs
- ✅ No rate limits
- ✅ Works offline (after initial download)
- ✅ Faster response times
- ✅ Full privacy (data never leaves your server)

**Fallback System**:
The app includes smart rule-based rewrites as fallback if:
- Model is still loading
- Generation fails
- Output is too short

## 📦 Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Hugging Face account (free)
- Stripe account (free for testing)

### Step 1: Clone and Install

```bash
# Clone or download the project
cd vibewrite-ai

# Install backend dependencies
cd backend
npm install
```

### Step 2: Set Up Environment Variables

The `.env` file is already included with placeholder values. Just fill in your actual Stripe keys:

```bash
cd backend
nano .env  # or use any text editor
```

You need to replace the placeholder values for:

**Good News: NO Hugging Face API Key Needed! 🎉**

The app now uses **local AI models** via `@xenova/transformers`. Models will automatically download on first run (takes 1-2 minutes). No API keys, no rate limits, no API costs!

**Stripe Keys** (still required):
- Go to https://stripe.com
- Sign up for a free account
- Navigate to Developers > API Keys
- Copy the "Secret key" to `STRIPE_SECRET_KEY`
- Copy the "Publishable key" to `STRIPE_PUBLISHABLE_KEY`

**Create Stripe Product**:
- In Stripe Dashboard, go to Products
- Click "Add Product"
- Name: "VibeWrite Pro"
- Price: $10/month (recurring)
- Copy the Price ID (starts with `price_`) to `STRIPE_PRICE_ID`

**Stripe Webhook** (for production):
- In Stripe Dashboard, go to Developers > Webhooks
- Click "Add endpoint"
- Endpoint URL: `https://your-domain.com/api/webhook`
- Select events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
- Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### Step 3: Update Frontend API URL

Edit `frontend/js/app.js` and update the API URL:

```javascript
// For local development
const API_URL = 'http://localhost:3000/api';

// For production (update to your deployed backend URL)
const API_URL = 'https://your-backend-domain.com/api';
```

## 🏃‍♂️ Running Locally

### Start Backend Server

```bash
cd backend
npm start

# Or use nodemon for auto-restart during development
npm run dev
```

The backend will run on `http://localhost:3000`

### Start Frontend

You can use any static file server. Here are a few options:

**Option 1: Python's built-in server**
```bash
cd frontend
python3 -m http.server 8000
```

**Option 2: Node's http-server**
```bash
npm install -g http-server
cd frontend
http-server -p 8000
```

**Option 3: VS Code Live Server**
- Install the "Live Server" extension
- Right-click `index.html` and select "Open with Live Server"

Open your browser to `http://localhost:8000`

## 🌐 Deployment

### Backend Deployment (Render, Railway, or Heroku)

#### Using Render:

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables in Render dashboard
6. Deploy!

#### Using Railway:

1. Go to [Railway](https://railway.app)
2. Create new project from GitHub repo
3. Railway auto-detects Node.js
4. Add environment variables
5. Deploy!

### Frontend Deployment (Vercel or Netlify)

#### Using Vercel:

1. Install Vercel CLI: `npm install -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Run: `vercel`
4. Follow prompts to deploy
5. Update `API_URL` in `app.js` to your backend URL

#### Using Netlify:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Navigate to frontend directory: `cd frontend`
3. Run: `netlify deploy`
4. Follow prompts
5. Run `netlify deploy --prod` for production
6. Update `API_URL` in `app.js` to your backend URL

### Important: Update CORS Settings

After deploying, update the backend's `.env`:

```bash
FRONTEND_URL=https://your-frontend-domain.com
```

## 🧪 Testing the App

### Free Version Test:
1. Open the app
2. Enter your name
3. Paste some text
4. Select a vibe
5. Click "Rewrite"
6. Try up to 5 rewrites
7. You should see the limit modal after 5 rewrites

### Pro Subscription Test:
1. Click "Upgrade to Pro"
2. Use Stripe test card: `4242 4242 4242 4242`
3. Any future expiry date
4. Any 3-digit CVC
5. Complete checkout
6. You should be redirected back with unlimited rewrites

### Stripe Test Cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`

## 🎨 Customization

### Change Color Scheme

Edit `frontend/css/style.css` and modify the CSS variables:

```css
:root {
    --primary: #FF3B8F;      /* Main brand color */
    --secondary: #8B5CF6;    /* Secondary accent */
    --accent: #FFC700;       /* Accent color */
    /* ... */
}
```

### Modify Vibes

Edit `backend/ai.js` to adjust vibe prompts:

```javascript
const vibePrompts = {
    funny: {
        instruction: "Your custom instruction here...",
        style: "your style keywords"
    },
    // ... add more vibes
};
```

### Adjust Pricing

1. Update price in Stripe Dashboard
2. Update `STRIPE_PRICE_ID` in `.env`
3. Update pricing display in `index.html`

## 📁 Project Structure

```
vibewrite-ai/
├── frontend/
│   ├── index.html          # Main HTML file with landing + app
│   ├── css/
│   │   └── style.css       # All styles (responsive, animated)
│   └── js/
│       └── app.js          # Frontend logic (navigation, API calls)
├── backend/
│   ├── server.js           # Express server with all routes
│   ├── ai.js               # Hugging Face integration
│   ├── stripe.js           # Stripe payment handling
│   └── package.json        # Backend dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🐛 Troubleshooting

### "Network Error" when rewriting
- Check if backend is running
- Verify API_URL in `app.js` matches your backend
- Check CORS settings in backend

### AI Model loading slowly
- First run downloads the model (~80MB) - this is normal
- Subsequent runs will be instant (model is cached)
- Check server logs for loading progress

### Generated text quality issues
- The default model (distilgpt2) is lightweight but may produce variable results
- Try switching to a better model in `backend/ai.js`:
  - `Xenova/gpt2` for better quality
  - `Xenova/t5-small` for more accurate text-to-text
- The fallback system will kick in if generation fails

### Stripe checkout not working
- Verify all Stripe keys are correct
- Use test mode keys for development
- Check webhook is set up correctly for production

### Daily limit not resetting
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

## 🔒 Security Notes

- Never commit `.env` file to git
- Use test Stripe keys for development
- In production, use environment secrets (not committed files)
- Consider adding rate limiting to prevent API abuse
- Add authentication for production (this demo uses soft-login)

## 📝 License

MIT License - feel free to use this project however you want!

## 🚢 Ready to Ship!

This app is production-ready! Just:
1. Set up your API keys
2. Deploy backend and frontend
3. Update the URLs
4. Test everything
5. Launch! 🎉

## 💡 Future Enhancements

- Add more vibes (motivational, poetic, etc.)
- Save favorite rewrites
- Share rewrites on social media
- User accounts with history
- API for developers
- Chrome extension
- Mobile app

## 🤝 Support

If you run into issues:
1. Check this README carefully
2. Review environment variables
3. Check browser console for errors
4. Verify API keys are correct
5. Test with Stripe test cards first

---

Made with ❤️ and lots of vibes! Ready to launch in 48 hours! 🚀
