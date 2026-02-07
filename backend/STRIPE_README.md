Stripe integration notes

Required environment variables (backend/.env or system env):

- STRIPE_SECRET_KEY - Your Stripe secret API key (starts with sk_...)
- STRIPE_PRICE_ID - The Price ID for your subscription plan (from Stripe dashboard)
- STRIPE_WEBHOOK_SECRET - The webhook signing secret for /api/webhook
- FRONTEND_URL - The public URL where the frontend is served (e.g. http://localhost:8000)
- OPENAI_API_KEY - (optional) OpenAI key used by the AI service

Quick start (development):

1. Create a .env file in the project root with the values above.
2. Install deps and run the server:

```bash
npm install
npm run dev
```

Notes:
- The server now exposes these endpoints used by the frontend:
  - POST /api/create-checkout-session  -> Returns { url } to redirect to Stripe Checkout
  - POST /api/webhook                  -> Stripe webhook (expects raw body signature)
  - POST /api/create-portal-session   -> Create Stripe customer portal session
  - GET  /api/subscription-status/:customerId -> Returns subscription details

- A simple file-backed usage store lives at `backend/data/usage.json` and enforces the 7/day free limit by client IP.
- The usage store now prefers PostgreSQL when a `DATABASE_URL` is provided and will create a `usage_counters` table; install `pg` in `backend` to enable this.
- For production, persist Stripe customer IDs and subscription state per authenticated user in your DB. Do NOT rely on the file store for production.
- Ensure `FRONTEND_URL` matches the URL used by Stripe Checkout for success/cancel redirects.
