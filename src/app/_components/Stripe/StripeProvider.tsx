'use client'

import { MINIMUM_PAYMENT_AMOUNT } from '@/services/ledger/payments/constants'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { ReactNode } from 'react'

// To avoid inlining of the publishable key during build time (where the 
// environment variable is not set) we use a variable for the key name.
// See the non inlined examples here: 
// https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'

if (!process.env[NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY]) {
    throw new Error('Stripe publishable key not set')
}

const stripe = loadStripe(process.env[NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY]!)

type Props = {
    children?: ReactNode,
    mode: 'payment' | 'setup',
    amount?: number,
    customerSessionClientSecret?: string,
}

export default function StripeProvider({ children, mode, amount, customerSessionClientSecret }: Props) {
    return (
        <Elements stripe={stripe} options={{
            mode,
            currency: 'nok',
            amount: amount ? Math.max(MINIMUM_PAYMENT_AMOUNT, amount) : undefined,
            customerSessionClientSecret,
        }}>
            {children}
        </Elements>
    )
}
