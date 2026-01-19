import logger from '@/lib/logger'
import { stripe } from '@/lib/stripe'
import { stripeWebhookCallback } from '@/services/ledger/payments/stripeWebhookCallback'

export async function POST(req: Request) {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return new Response('Invalid server-side configuration', { status: 500 })
    }

    const stripeSignature = req.headers.get('stripe-signature')
    const body = await req.text()

    if (!stripeSignature) {
        return new Response('Stripe signature missing', { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, stripeSignature, process.env.STRIPE_WEBHOOK_SECRET)

    // Check if the event is one of the expected types
    if (event.type !== 'charge.succeeded' && event.type !== 'charge.updated') {
        logger.warn(`Unhandled Stripe event received: ${event.type}`)
        return new Response('', { status: 200 })
    }

    // Validate the event data types we need
    if (typeof event.data.object.balance_transaction !== 'string' || typeof event.data.object.payment_intent !== 'string') {
        return new Response('', { status: 200 })
    }

    try {
        await stripeWebhookCallback(event)
    } catch {
        return new Response('Server-side error confirming deposit', { status: 500 })
    }

    return new Response('', { status: 200 })
}
