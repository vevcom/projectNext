import logger from '@/lib/logger'
import { stripe } from '@/lib/stripe'
import prisma from '@/prisma'

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

    if (event.type !== 'charge.succeeded' && event.type !== 'charge.updated') {
        logger.warn(`Unhandled Stripe event received: ${event.type}`)
        return new Response('', { status: 200 })
    }

    if (typeof event.data.object.balance_transaction !== 'string' || typeof event.data.object.payment_intent !== 'string') {
        return new Response('', { status: 200 })
    }

    const balanceTransaction = await stripe.balanceTransactions.retrieve(event.data.object.balance_transaction)

    const { transactionId } = await prisma.stripeDeposit.findUniqueOrThrow({
        where: {
            paymentIntentId: event.data.object.payment_intent,
        }
    })

    await prisma.transaction.update({
        where: {
            id: transactionId,
        },
        data: {
            status: 'SUCCEEDED',
            fee: balanceTransaction.fee,
        }
    })

    return new Response('', { status: 200 })
}
