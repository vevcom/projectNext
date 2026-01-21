'use client'

import { MINIMUM_PAYMENT_AMOUNT } from '@/services/ledger/payments/constants'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { ReactNode } from 'react'

// Next Js. can expose environment variables using the NEXT_PUBLIC_ prefix.
// However, this bakes them in during buildtime. Our setup doesn't load
// environment variables until runtime, so we have to pass the key down
// from a higher level component. When doing this, we want to avoid
// loading stripe multiple times so we cache it like so.
// TODO: Revisit this when/if we add environment variables during build.

const stripePromiseCache = new Map<string, ReturnType<typeof loadStripe>>()

function getStripePromise(stripePublishableKey: string) {
    const cachedStripePromise = stripePromiseCache.get(stripePublishableKey)

    if (cachedStripePromise) {
        return cachedStripePromise
    }

    const stripePromise = loadStripe(stripePublishableKey)
    stripePromiseCache.set(stripePublishableKey, stripePromise)

    return stripePromise
}

type Props = {
    children?: ReactNode,
    stripePublishableKey: string,
    mode: 'payment' | 'setup',
    amount?: number,
    customerSessionClientSecret?: string,
}

export default function StripeProvider({ children, stripePublishableKey, mode, amount, customerSessionClientSecret }: Props) {
    const stripe = getStripePromise(stripePublishableKey)

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
