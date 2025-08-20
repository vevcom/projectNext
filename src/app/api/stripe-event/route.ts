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

    return await stripeWebhookCallback(event)
}
