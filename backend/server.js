// ===========================
// VibeWrite.ai Backend Server
// ===========================
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import modules
import { rewriteText } from './ai.js';
import * as stripeHelper from './stripe.js';
import { incrementAndCheck, resetUsage, resetAllUsage } from './usageStore.js';
import connectDB from './db/connection.js';
import communityRoutes from './routes/community.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// Middleware
// ===========================

// CORS configuration
// CORS configuration: allow configured FRONTEND_URL or any localhost origin in development
app.use(cors({
    origin: function (origin, callback) {
        // Allow non-browser requests (no origin)
        if (!origin) return callback(null, true);

        const allowedFrontend = process.env.FRONTEND_URL;

        // Allow exact match
        if (allowedFrontend && origin === allowedFrontend) return callback(null, true);

        // Allow any Vercel deployment
        if (origin.endsWith('.vercel.app')) return callback(null, true);

        // Allow any localhost origin (including different ports) during development
        if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);

        console.error('❌ CORS REJECTED:', origin);
        return callback(new Error('CORS policy: Origin not allowed'));
    },
    credentials: true
}));

// Body parser - JSON for most routes
app.use(bodyParser.json());

// Raw body parser for Stripe webhooks (must come before other routes)
app.use('/api/webhook', bodyParser.raw({ type: 'application/json' }));

// Connect to database
connectDB();

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ===========================
// Health Check
// ===========================
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'VibeWrite.ai Backend',
        timestamp: new Date().toISOString()
    });
});

// ===========================
// API Routes
// ===========================

/**
 * POST /api/rewrite
 * Generate a rewrite in a specific vibe
 */
app.post('/api/rewrite', async (req, res) => {
    try {
        // Log incoming request details for debugging
        console.log('--- /api/rewrite incoming ---');
        console.log('Origin header:', req.headers.origin || '(no origin)');
        console.log('Request IP:', req.ip);
        console.log('Forwarded for:', req.headers['x-forwarded-for']);
        console.log('Request headers:', Object.fromEntries(Object.entries(req.headers).slice(0, 50)));
        console.log('Request body preview:', JSON.stringify(req.body).slice(0, 1000));

        const { text, vibe } = req.body;

        // Validation is handled within rewriteText function

        // Validate vibe - now supports 30+ styles
        const validVibes = [
            'funny', 'hype', 'savage', 'cute', 'professional',
            'poetic', 'dramatic', 'mysterious', 'romantic', 'motivational',
            'sarcastic', 'philosophical', 'nostalgic', 'rebellious', 'whimsical',
            'scientific', 'diplomatic', 'conspiracy', 'zen', 'chaotic',
            'aristocratic', 'streetwise', 'vintage', 'cyberpunk', 'horror',
            'superhero', 'pirate', 'cowboy', 'alien', 'robot',
            'childlike', 'elderly', 'celebrity', 'villain', 'superheroVillain',
            'businessPro', 'genZTalk'
        ];
        if (!validVibes.includes(vibe)) {
            console.warn('Invalid vibe requested:', vibe);
            return res.status(400).json({
                success: false,
                error: `Invalid vibe. Must be one of: ${validVibes.join(', ')}`
            });
        }

        // If client has pro cookie, skip limit
        const cookies = req.headers.cookie || '';
        const isProCookie = cookies.split(';').map(s => s.trim()).includes('vibewrite_pro=1');
        if (!isProCookie) {
            // Enforce 7/day free limit per client IP
            const clientKey = req.headers['x-forwarded-for'] || req.ip || req.connection?.remoteAddress || 'unknown';
            console.log('Client key for usage check:', clientKey);
            const usage = await incrementAndCheck(clientKey, 7);
            console.log('Usage check result:', usage);
            if (!usage.allowed) {
                console.warn('Usage limit reached for', clientKey);
                return res.status(429).json({ success: false, error: 'Daily limit reached. Upgrade to unlimited.', remaining: 0 });
            }
        }

        // Generate rewrite - rewriteText handles the response directly
        try {
            await rewriteText(req, res);
            console.log('rewriteText completed successfully for request');
            return;
        } catch (innerErr) {
            console.error('rewriteText threw an error:', innerErr);
            // If rewriteText failed unexpectedly, return a helpful error
            return res.status(500).json({ success: false, error: 'Rewrite handler failed: ' + (innerErr && innerErr.message ? innerErr.message : String(innerErr)) });
        }

    } catch (error) {
        console.error('💥 /api/rewrite outer crash:', error);
        res.status(500).json({
            success: false,
            error: 'Rewrite route crash: ' + (error?.message || String(error)),
            stack: process.env.NODE_ENV === 'production' ? null : error?.stack
        });
    }
});

// Payments disabled - Everything is now free
// Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { vibe } = req.body || {};
        const userName = req.body?.userName || 'anonymous';
        const session = await stripeHelper.createCheckoutSession(userName);
        if (!session.success) return res.status(500).json({ success: false, error: session.error });
        return res.json({ success: true, url: session.url });
    } catch (err) {
        console.error('create-checkout-session error', err);
        return res.status(500).json({ success: false, error: 'Failed to create checkout session' });
    }
});

// Stripe webhook
app.post('/api/webhook', (req, res) => {
    try {
        const event = stripeHelper.verifyWebhookSignature(req);
        if (!event) return res.status(400).send('Invalid signature');
        stripeHelper.handleWebhookEvent(event).then(() => res.json({ received: true })).catch(e => {
            console.error('webhook handler error', e);
            res.status(500).end();
        });
    } catch (err) {
        console.error('webhook endpoint error', err);
        res.status(500).end();
    }
});

// Create Portal Session
app.post('/api/create-portal-session', async (req, res) => {
    try {
        const { customerId } = req.body || {};
        if (!customerId) return res.status(400).json({ success: false, error: 'customerId required' });
        const result = await stripeHelper.createPortalSession(customerId);
        if (!result.success) return res.status(500).json({ success: false, error: result.error });
        return res.json({ success: true, url: result.url });
    } catch (err) {
        console.error('create-portal-session error', err);
        return res.status(500).json({ success: false, error: 'Failed to create portal session' });
    }
});

// Subscription status
app.get('/api/subscription-status/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const status = await stripeHelper.getSubscriptionStatus(customerId);
        return res.json(status);
    } catch (err) {
        console.error('subscription-status error', err);
        return res.status(500).json({ success: false, error: 'Failed to get subscription status' });
    }
});

// Confirm checkout (called by frontend after redirect)
app.post('/api/confirm-checkout', async (req, res) => {
    try {
        const { sessionId } = req.body || {};
        if (!sessionId) return res.status(400).json({ success: false, error: 'sessionId required' });
        const result = await stripeHelper.getSession(sessionId);
        if (!result.success) return res.status(500).json({ success: false, error: result.error });

        const session = result.session;
        // If a subscription is present or payment succeeded, set a cookie for pro
        const active = !!(session.subscription || session.payment_status === 'paid');
        if (active) {
            // Set client cookie to mark pro (1 year)
            res.setHeader('Set-Cookie', 'vibewrite_pro=1; Path=/; Max-Age=31536000; SameSite=Lax');
        }

        return res.json({ success: true, active, session });
    } catch (err) {
        console.error('confirm-checkout error', err);
        return res.status(500).json({ success: false, error: 'Failed to confirm checkout' });
    }
});

// Community Scripts Routes
app.use('/api/community', communityRoutes);

// Dev-only: reset usage for current client (convenience endpoint)
if (process.env.NODE_ENV !== 'production') {
    app.post('/api/debug/reset-usage', async (req, res) => {
        try {
            const clientKey = req.headers['x-forwarded-for'] || req.ip || 'unknown';
            await resetUsage(clientKey);
            console.log('Dev reset usage for', clientKey);
            return res.json({ success: true, clientKey });
        } catch (err) {
            console.error('reset-usage error', err);
            return res.status(500).json({ success: false, error: String(err) });
        }
    });

    app.post('/api/debug/reset-all-usage', async (req, res) => {
        try {
            await resetAllUsage();
            console.log('Dev reset all usage data');
            return res.json({ success: true });
        } catch (err) {
            console.error('reset-all-usage error', err);
            return res.status(500).json({ success: false, error: String(err) });
        }
    });
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('🔴 GLOBAL ERROR:', err);
    res.status(500).json({
        success: false,
        error: 'Global Server Error: ' + (err?.message || 'Unknown error'),
        detail: err?.stack?.split('\n')[0]
    });
});

// ===========================
// Server Start
// ===========================
app.listen(PORT, () => {
    console.log(`
    ========================================
    🚀 VibeWrite.ai
    ========================================
    App:  http://localhost:${PORT}
    API:  http://localhost:${PORT}/api
    DB:   SQLite (auto-configured)
    ========================================
    `);
});

// ===========================
// Graceful Shutdown
// ===========================
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
