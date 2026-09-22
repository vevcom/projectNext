'use client'

import { MINIMUM_PAYMENT_AMOUNT } from '@/services/ledger/payments/constants'
import { isBuildPhase } from '@/lib/isBuildPhase'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { ReactNode } from 'react'

// The publishable key might not be set during the build phase. To avoid build-time
// errors, we skip the check during the build phase, mirroring src/lib/stripe.ts.
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !isBuildPhase()) {
    throw new Error('Stripe publishable key not set')
}

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? 'fake-key')

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
