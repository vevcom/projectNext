import type Stripe from "stripe"
import prisma from "@/prisma"
import logger from "@/lib/logger"
import { PaymentState } from "@prisma/client"
import { stripe } from "@/lib/stripe"

/**
 * Utility function which extracts the `latest_charge.balance_transaction` object
 * from the provided payment intent object if it exists.
 * 
 * @param paymentIntent 
 * @returns 
 */
function extractBalanceTransaction(paymentIntent: Stripe.PaymentIntent): Stripe.BalanceTransaction | null {
    const latestCharge = paymentIntent.latest_charge

    if (!latestCharge || typeof latestCharge !== 'object') {
        // logger.error(`Stripe payment intent event was missing latest charge object. 'latest_charge': ${latest_charge}`)
        return null
    }

    const balanceTransaction = latestCharge.balance_transaction

    if (!balanceTransaction || typeof balanceTransaction !== 'object') {
        // logger.error(`Stripe payment intent event was missing balance transaction object. 'balance_transaction': ${balance_transaction}`)
        return null
    }

    return balanceTransaction
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
 * Firstly, the webhook callback is not part of the interface of the payment service. This function will only ever be used one place.
 * Secondly, authentication and data validation is already handled by the Stripe package.
 * 
 * @param paymentIntent The payment intent object received in the webhook. It is expected that `latest_charge.balance_transaction` is expanded.
 * 
 * @returns An appropriate `Response`.
 */
export async function stripeWebhookCallback(event: Stripe.Event): Promise<Response> {
    const paymentState = EVENT_TYPE_TO_STATE[event.type];

    if (!paymentState) {
        logger.error('Received unsupported Stripe event type.')
        return new Response('Unsupported Stripe event type', { status: 400 })
    }

    // TypeScript cannot figure out that the above if statement narrows the possible event type
    // so we'll have to assert this our selves
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    // Declare fee, it will be undefined by default
    // which is what we want for the canceled and failed events
    let fee

    // If the payment succeeded we'll extract the fee
    if (event.type === 'payment_intent.succeeded') {
        const balanceTransaction = extractBalanceTransaction(paymentIntent)
        
        if (!balanceTransaction) {
            logger.error('Received successful payment intent event without balance transaction object.')
            return new Response('', { status: 400 })
        }

        fee = balanceTransaction.fee
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
            paymentId: true,
        },
    })

    // We only allow one payment attempt per payment intent.
    // If this failed we cancel the payment intent to make sure it cannot be used in the future.
    if (event.type === 'payment_intent.payment_failed') {
        stripe.paymentIntents.cancel(paymentIntent.id, {}, { idempotencyKey: `project-next-payment-id-${stripePayment.paymentId}` })
    }

    return new Response('', { status: 200 })
}
