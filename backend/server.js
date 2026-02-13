// ===========================
// VibeWrite.ai Backend Server
// ===========================
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import crypto from 'crypto';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import modules
import { rewriteText } from './ai.js';
import { incrementAndCheck, resetUsage, resetAllUsage } from './usageStore.js';
import connectDB from './db/connection.js';
// Stripe and community routes removed - all features are now free

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// Security Middleware
// ===========================

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for rewrite endpoint
const rewriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 rewrites per windowMs
  message: {
    success: false,
    error: 'Rewrite limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);
app.use('/api/rewrite', rewriteLimiter);

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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: 'Server is running'
    });
});

/**
 * POST /api/rewrite
 * Generate a rewrite in a specific vibe
 */
app.post('/api/rewrite', async (req, res) => {
    console.log('🚀 REWRITE ENDPOINT HIT - DEPLOYMENT TEST');
    
    return res.status(200).json({
        success: true,
        message: 'DEPLOYMENT TEST SUCCESSFUL',
        timestamp: new Date().toISOString(),
        body: req.body
    });
    
    try {
        // Extract and validate input
        const { text, vibe } = req.body;
        
        console.log('✅ Extracted - text:', text ? '"' + text + '"' : 'undefined');
        console.log('✅ Extracted - vibe:', vibe || 'undefined');
        
        // Input validation and sanitization
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        if (!vibe || typeof vibe !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Vibe is required'
            });
        }

        // Length limits to prevent abuse
        if (text.length > 2000) {
            return res.status(400).json({
                success: false,
                error: 'Text too long. Maximum 2000 characters allowed.'
            });
        }

        // Detect potential prompt injection attempts
        const suspiciousPatterns = [
            /ignore\s+all\s+prior\s+instructions/i,
            /ignore\s+previous\s+instructions/i,
            /system\s+message/i,
            /you\s+are\s+now\s+a/i,
            /act\s+as\s+a/i,
            /roleplay\s+as/i,
            /stop\s+being/i,
            /forget\s+everything/i,
            /disregard/i,
            /override/i,
            /bypass/i,
            /admin/i,
            /developer/i,
            /explain\s+how/i,
            /teach\s+me/i,
            /show\s+me\s+code/i,
            /write\s+code/i,
            /python\s+expert/i,
            /javascript\s+expert/i
        ];

        const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(text));
        if (isSuspicious) {
            console.warn('🚨 Suspicious input detected:', text.slice(0, 200));
            return res.status(400).json({
                success: false,
                error: 'Invalid input format. Please provide text to rewrite.'
            });
        }

        // Validation is handled within rewriteText function

        // Validate vibe - now supports free vibes only
        const validVibes = [
            'funny', 'cute', 'sarcastic', 'romantic', 'motivational',
            'philosophical', 'nostalgic', 'scientific', 'conspiracy', 'zen',
            'vintage', 'cyberpunk', 'superhero', 'childlike', 'elderly', 'celebrity', 'robot', 'change the words'
        ];
        if (!validVibes.includes(vibe)) {
            console.warn('Invalid vibe requested:', vibe);
            return res.status(400).json({
                success: false,
                error: `Invalid vibe. Must be one of: ${validVibes.join(', ')}`
            });
        }

        // If client has pro cookie, skip limit (now everyone is effectively pro)
        const cookies = req.headers.cookie || '';
        const isProCookie = cookies.split(';').map(s => s.trim()).includes('vibewrite_pro=1');
        // Everyone gets unlimited rewrites now - no limits!

        // Generate rewrite with output validation
        try {
            const result = await rewriteText(req);
            
            // Validate output is actually a rewrite, not a response
            if (result && typeof result === 'object' && result.rewrittenText) {
                const rewrittenText = result.rewrittenText;
                
                // Check if output looks like a response instead of a rewrite
                const responsePatterns = [
                    /^(I|I'm|I am)\s+(a|an)/i,
                    /^(Sure|Okay|Of course|Certainly|Absolutely)/i,
                    /^(Let me|I can|I will|I'll)/i,
                    /^(Here's|Here is)/i,
                    /^(The|This|A)\s+(Python|JavaScript|Code)\s+/i,
                    /def\s+\w+\s*\(/i,  // Python function definition
                    /function\s+\w+\s*\(/i,  // JavaScript function
                    /class\s+\w+/i,  // Class definition
                    /import\s+\w+/i,  // Import statement
                    /```/i  // Code blocks
                ];
                
                const isInvalidResponse = responsePatterns.some(pattern => pattern.test(rewrittenText));
                
                if (isInvalidResponse) {
                    console.error('🚨 Invalid response detected, falling back to simple rewrite');
                    return res.status(200).json({
                        success: true,
                        rewrittenText: text + ' (rewritten in ' + vibe + ' style)'
                    });
                }
                
                // Send the validated result
                return res.status(200).json(result);
            }
            
            console.log('✅ Rewrite completed successfully');
            return res.status(200).json(result);
        } catch (innerErr) {
            console.error('❌ Rewrite failed:', innerErr);
            return res.status(500).json({ 
                success: false, 
                error: 'Rewrite service temporarily unavailable' 
            });
        }

    } catch (error) {
        console.error('💥 /api/rewrite outer crash:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ 
            success: false, 
            error: 'Server error: ' + (error.message || 'Unknown error'),
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Payment system removed - all features are now free

// ===========================
// Community Scripts API (Starting Fresh)
// ===========================

/**
 * GET /api/community/scripts
 * Get all community scripts (currently empty - starting fresh)
 */
app.get('/api/community/scripts', async (req, res) => {
    try {
        // Starting fresh with zero community scripts
        res.json({
            success: true,
            scripts: [], // Empty array - no scripts yet
            total: 0,
            message: "Community scripts feature is being rebuilt. Check back soon!"
        });
    } catch (error) {
        console.error('❌ Error fetching community scripts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch community scripts'
        });
    }
});

/**
 * GET /api/community/scripts/count
 * Get community script count
 */
app.get('/api/community/scripts/count', async (req, res) => {
    try {
        res.json({
            success: true,
            count: 0, // Starting with zero scripts
            unlocked: false
        });
    } catch (error) {
        console.error('❌ Error getting script count:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get script count'
        });
    }
});

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
