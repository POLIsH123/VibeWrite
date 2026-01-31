// ===========================
// Stripe Integration
// ===========================
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session for subscription
 * @param {string} userName - User's name for reference
 * @returns {Promise<Object>} - Checkout session with URL
 */
async function createCheckoutSession(userName) {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL}?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
            metadata: {
                userName: userName
            },
            customer_email: null, // Optional: collect email during checkout
            billing_address_collection: 'required',
        });

        return {
            success: true,
            url: session.url,
            sessionId: session.id
        };
    } catch (error) {
        console.error('Error creating checkout session:', error);
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
                // Payment successful - activate subscription
                const session = event.data.object;
                console.log('Checkout completed for:', session.metadata.userName);
                // Here you would typically:
                // 1. Update your database with subscription info
                // 2. Send confirmation email
                // 3. Activate pro features for the user
                return { success: true, message: 'Subscription activated' };

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
    createCheckoutSession,
    verifyWebhookSignature,
    handleWebhookEvent,
    createPortalSession,
    getSubscriptionStatus
};
