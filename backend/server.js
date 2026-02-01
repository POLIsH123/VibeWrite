// ===========================
// VibeWrite.ai Backend Server
// ===========================
import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from root directory
config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import modules
import { rewriteText } from './ai.js';
import * as stripeHelper from './stripe.js';
import connectDB from './db/connection.js';
import communityRoutes from './routes/community.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// Middleware
// ===========================

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
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
          'childlike', 'elderly', 'celebrity', 'villain', 'superheroVillain'
        ];
        if (!validVibes.includes(vibe)) {
            return res.status(400).json({
                success: false,
                error: `Invalid vibe. Must be one of: ${validVibes.join(', ')}`
            });
        }

        // Generate rewrite - rewriteText handles the response directly
        await rewriteText(req, res);
        return;

    } catch (error) {
        console.error('Error in /api/rewrite:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate rewrite. Please try again.'
        });
    }
});

/**
 * POST /api/create-checkout-session
 * Create a Stripe checkout session for subscription
 */
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { userName } = req.body;

        if (!userName) {
            return res.status(400).json({
                success: false,
                error: 'User name is required'
            });
        }

        const result = await stripeHelper.createCheckoutSession(userName);

        if (result.success) {
            res.json({
                success: true,
                url: result.url,
                sessionId: result.sessionId
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('Error in /api/create-checkout-session:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create checkout session'
        });
    }
});

/**
 * POST /api/webhook
 * Handle Stripe webhook events
 */
app.post('/api/webhook', async (req, res) => {
    try {
        const event = stripeHelper.verifyWebhookSignature(req);

        if (!event) {
            return res.status(400).json({
                success: false,
                error: 'Invalid webhook signature'
            });
        }

        const result = await stripeHelper.handleWebhookEvent(event);

        res.json(result);

    } catch (error) {
        console.error('Error in /api/webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Webhook processing failed'
        });
    }
});

/**
 * POST /api/create-portal-session
 * Create a Stripe Customer Portal session for subscription management
 */
app.post('/api/create-portal-session', async (req, res) => {
    try {
        const { customerId } = req.body;

        if (!customerId) {
            return res.status(400).json({
                success: false,
                error: 'Customer ID is required'
            });
        }

        const result = await stripeHelper.createPortalSession(customerId);

        res.json(result);

    } catch (error) {
        console.error('Error in /api/create-portal-session:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create portal session'
        });
    }
});

/**
 * GET /api/subscription-status/:customerId
 * Check subscription status for a customer
 */
app.get('/api/subscription-status/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        const result = await stripeHelper.getSubscriptionStatus(customerId);

        res.json(result);

    } catch (error) {
        console.error('Error in /api/subscription-status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get subscription status'
        });
    }
});

// Community Scripts Routes
app.use('/api/community', communityRoutes);

// Serve frontend static files (CSS, JS, etc.)
app.use(express.static(join(__dirname, '..', 'frontend')));

// Serve index.html for all non-API routes (SPA fallback)
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(join(__dirname, '..', 'frontend', 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
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
