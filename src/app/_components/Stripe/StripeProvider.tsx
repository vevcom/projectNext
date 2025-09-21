'use client'

import { MINIMUM_PAYMENT_AMOUNT } from '@/services/ledger/payments/config'
import { Elements } from '@stripe/react-stripe-js'
import { CustomerOptions, loadStripe } from '@stripe/stripe-js'
import type { ReactNode } from 'react'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe publishable key not set')
}

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

type Props = {
    children?: ReactNode,
    mode: 'payment' | 'setup',
    amount?: number,
    customerOptions?: CustomerOptions,
}

export default function StripeProvider({ children, mode, amount, customerOptions }: Props) {
    return (
        <Elements stripe={stripe} options={{
            mode,
            currency: 'nok',
            amount: amount ? Math.max(MINIMUM_PAYMENT_AMOUNT, amount) : undefined,
            customerOptions,
        }}>
            {children}
        </Elements>
    )
}
