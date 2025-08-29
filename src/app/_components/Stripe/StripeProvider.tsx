'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { ReactNode } from 'react'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe publishable key not set')
}

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

type Props = {
    amount: number,
    children?: ReactNode
}

export default function StripeProvider({ children, amount }: Props) {
    return (
        <Elements stripe={stripe} options={{
            mode: 'payment',
            currency: 'nok',
            amount: Math.max(500, amount)
        }}>
            {children}
        </Elements>
    )
}
