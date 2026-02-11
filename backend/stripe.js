// ===========================
// Stripe Integration
// ===========================
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session for support payment (one-time)
 * @param {number} amount - Support amount in dollars
 * @param {string} userName - User's name for reference
 * @returns {Promise<Object>} - Checkout session with URL
 */
async function createSupportSession(amount, userName) {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Support VibeWrite 💝',
                            description: `Thank you for supporting VibeWrite!`,
                            images: []
                        },
                        unit_amount: amount * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL}?support=true`,
            cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
            metadata: {
                type: 'support',
                amount: amount,
                userName: userName
            },
            customer_email: null,
            billing_address_collection: 'required',
        });

        return {
            success: true,
            url: session.url,
            sessionId: session.id
        };
    } catch (error) {
        console.error('Error creating support session:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Verify Stripe webhook signature
 * @param {Object} req - Express request object
 * @returns {Object} - Parsed webhook event or null if invalid
 */
function verifyWebhookSignature(req) {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
        );
        return event;
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return null;
    }
}

/**
 * Handle Stripe webhook events
 * @param {Object} event - Stripe event object
 * @returns {Object} - Processing result
 */
async function handleWebhookEvent(event) {
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                // Payment successful - support payment or subscription
                const session = event.data.object;
                if (session.metadata?.type === 'support') {
                    console.log('Support payment completed for:', session.metadata.userName, 'Amount:', session.metadata.amount);
                    // Here you would typically:
                    // 1. Send thank you email
                    // 2. Log support payment for analytics
                    return { success: true, message: 'Support payment received' };
                } else {
                    console.log('Legacy subscription completed for:', session.metadata.userName);
                    return { success: true, message: 'Legacy subscription activated' };
                }

            case 'customer.subscription.deleted':
                // Subscription cancelled
                const subscription = event.data.object;
                console.log('Subscription cancelled:', subscription.id);
                // Here you would typically:
                // 1. Update database to deactivate pro features
                // 2. Send cancellation confirmation
                return { success: true, message: 'Subscription cancelled' };

            case 'invoice.payment_failed':
                // Payment failed
                const invoice = event.data.object;
                console.log('Payment failed:', invoice.id);
                // Here you would typically:
                // 1. Notify user of payment failure
                // 2. Provide grace period before deactivating
                return { success: true, message: 'Payment failure handled' };

            default:
                console.log('Unhandled event type:', event.type);
                return { success: true, message: 'Event received' };
        }
    } catch (error) {
        console.error('Error handling webhook event:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Create a Customer Portal session for managing subscriptions
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<Object>} - Portal session with URL
 */
async function createPortalSession(customerId) {
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: process.env.FRONTEND_URL,
        });

        return {
            success: true,
            url: session.url
        };
    } catch (error) {
        console.error('Error creating portal session:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get subscription status for a customer
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<Object>} - Subscription details
 */
async function getSubscriptionStatus(customerId) {
    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1
        });

        if (subscriptions.data.length > 0) {
            const subscription = subscriptions.data[0];
            return {
                success: true,
                isActive: true,
                subscription: {
                    id: subscription.id,
                    status: subscription.status,
                    currentPeriodEnd: subscription.current_period_end,
                    cancelAtPeriodEnd: subscription.cancel_at_period_end
                }
            };
        } else {
            return {
                success: true,
                isActive: false
            };
        }
    } catch (error) {
        console.error('Error getting subscription status:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export {
    createSupportSession,
    verifyWebhookSignature,
    handleWebhookEvent,
    createPortalSession,
    getSubscriptionStatus,
    getSession
};

/**
 * Retrieve a checkout session and expand related objects
 * @param {string} sessionId
 */
async function getSession(sessionId) {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['subscription', 'customer']
        });
        return { success: true, session };
    } catch (error) {
        console.error('Error retrieving session:', error);
        return { success: false, error: error.message };
    }
}
