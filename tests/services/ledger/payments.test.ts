import { describe, test, expect, jest, beforeEach, beforeAll } from '@jest/globals'

// TODO: 
// jest.mock('@/lib/stripe', () => ({
//     stripe: {
//         paymentIntent: {
//             create: jest.fn(),
//             cancel: jest.fn(),
//         },
//     },
// }))

import { Smorekopp } from '@/services/error'
import { PaymentMethods } from '@/services/ledger/payments/methods'
import prisma from '@/prisma'
import { PaymentProvider } from '@prisma/client'
import { stripeWebhookCallback } from '@/services/ledger/payments/stripeWebhookCallback'
import Stripe from 'stripe'

const TEST_PAYMENT_DEFAULTS = {
    ledgerAccountId: 0,
    amount: 100, // 1 kr
    provider: 'STRIPE',
    description: 'Test betaling',
    descriptor: 'Test betaling',
}

describe.skip('payments', () => {
    beforeAll(async () => {
        await prisma.ledgerAccount.createMany({
            data: Array(2).fill({ type: 'USER' }),
        })
    })

    beforeEach(async () => {
        await prisma.ledgerEntry.deleteMany()
        await prisma.payment.deleteMany()
    })

    test.each([PaymentProvider.MANUAL, PaymentProvider.STRIPE])('payment flow', async (provider) => {
        let payment = await PaymentMethods.create.newClient().execute({
            params: {
                ...TEST_PAYMENT_DEFAULTS,
                provider,
            },
            session: null,
        })

        if (payment.state === 'PENDING') {
            payment = await PaymentMethods.initiate.newClient().execute({
                params: {
                    paymentId: payment.id,
                },
                session: null,
            })

            stripeWebhookCallback({
                type: 'payment_intent.succeeded',
                data: {
                    object: {
                        amount: payment.amount,
                        latest_charge: {
                            balance_transaction: {
                                fee: payment.amount / 100,
                            },
                        },
                    },
                },
            } as Stripe.PaymentIntentSucceededEvent)
        }

        expect(payment).toMatchObject({
            state: 'SUCCEEDED',
        })
    })

    test('initiate manual payment', async () => {
        const payment = await PaymentMethods.create.newClient().execute({
            params: {
                ledgerAccountId: 0,
                amount: 100, // 1 kr
                provider: 'MANUAL',
                description: 'Test betaling',
                descriptor: 'Test betaling',
            },
            session: null,
        })

        expect(PaymentMethods.initiate.newClient().execute({ params: { paymentId: payment.id }, session: null }))
            .rejects.toThrow(new Smorekopp('BAD DATA'))
    })
})
