import logger from '@/lib/logger'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/prisma/client'
import type Stripe from 'stripe'
import type { PaymentState } from '@/prisma-generated-pn-types'
import { ledgerTransactionOperations } from '@/services/ledger/transactions/operations'

/**
 * Utility function to retrieve the Stripe fees for a given payment intent.
 */
export async function retrieveStripeFees(paymentIntent: Stripe.PaymentIntent): Promise<number> {
    let totalFees = 0

    const charges = await stripe.charges.list({
        payment_intent: paymentIntent.id,
    })

    for (const charge of charges.data) {
        if (!charge.balance_transaction) {
            logger.error(`Charge does not have a balance transaction: ${charge.id}`)
            continue
        }

        const balanceTransactionId = typeof charge.balance_transaction === 'string'
            ? charge.balance_transaction
            : charge.balance_transaction.id

        const balanceTransaction = await stripe.balanceTransactions.retrieve(balanceTransactionId)
        totalFees += balanceTransaction.fee
    }

    return totalFees
}

// Map between Stripe event types and our internal payment states.
const EVENT_TYPE_TO_STATE: Partial<Record<Stripe.Event['type'], PaymentState>> = {
    'payment_intent.canceled': 'CANCELED',
    'payment_intent.succeeded': 'SUCCEEDED',
    'payment_intent.payment_failed': 'FAILED',
}

/**
 * The function which is called when we receive a payment intent event from Stripe.
 * It expects that the fields `latest_charge.balance_transaction` are expanded.
 * (This is configured in the Stripe dashboard.)
 *
 * @warning This callback assumes that the Stripe payment intents always have the capture method "automatic".
 * If this ever changes this function needs to be changed to handle uncaptured payments.
 * (That is payments which are authorized, but we have not actually taken the money yet.)
 *
 * This is not implemented using `ServiceMethod` because it does not need any of its features.
 * Firstly, the webhook callback is not part of the interface of the payment service.
 * This function will only ever be used one place. Secondly, authentication and data validation
 * is already handled by the Stripe package.
 *
 * @param paymentIntent The payment intent object received in the webhook.
 * It is expected that `latest_charge.balance_transaction` is expanded.
 *
 * @returns An appropriate `Response`.
 */
export async function stripeWebhookCallback(event: Stripe.Event): Promise<Response> {
    const paymentState = EVENT_TYPE_TO_STATE[event.type]

    if (!paymentState) {
        // We return a 200 response even for unsupported event
        // types to avoid unecessary retries from Stripe.
        logger.error(`Received unsupported Stripe event type: ${event.type}`)
        return new Response('', { status: 200 })
    }

    // TypeScript cannot figure out that the above if statement narrows the possible event type
    // so we'll have to assert this our selves
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    // Declare fee, it will be undefined by default
    // which is what we want for the canceled and failed events
    let fee: number | undefined

    // If the payment succeeded we'll extract the fee
    if (event.type === 'payment_intent.succeeded') {
        fee = await retrieveStripeFees(paymentIntent)
    }

    // Update the db model with the updated values
    const stripePayment = await prisma.stripePayment.update({
        where: {
            paymentIntentId: paymentIntent.id,
            payment: {
                state: {
                    // Guard against changing final state
                    // This should never happen, but you can never be too careful
                    in: ['PENDING', 'PROCESSING', paymentState]
                },
            },
        },
        data: {
            payment: {
                update: {
                    fees: fee,
                    state: paymentState,
                },
            }
        },
        select: {
            payment: {
                select: {
                    id: true,
                    ledgerTransaction: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    })

    if (stripePayment.payment.ledgerTransaction) {
        await ledgerTransactionOperations.advance({
            params: {
                id: stripePayment.payment.ledgerTransaction.id,
            },
        })
    } else {
        console.error(`Stripe payment is not part of a ledger transaction: ${stripePayment.payment.id}`)
    }

    // We only allow one payment attempt per payment intent.
    // If this failed we cancel the payment intent to make sure it cannot be used in the future.
    if (event.type === 'payment_intent.payment_failed') {
        stripe.paymentIntents.cancel(
            paymentIntent.id,
            {},
            { idempotencyKey: `project-next-payment-id-${paymentIntent.id}` },
        )
    }

    return new Response('', { status: 200 })
}
