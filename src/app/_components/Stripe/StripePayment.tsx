import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useImperativeHandle } from 'react'

export type StripePaymentRef = {
    submit: () => Promise<string | undefined>;
    confirmPayment: (clientSecret: string) => Promise<string | undefined>;
    confirmSetup: (clientSecret: string) => Promise<string | undefined>;
}

type Props = {
    ref?: React.Ref<StripePaymentRef>,
}

export default function StripePayment({ ref }: Props) {
    const stripe = useStripe()
    const elements = useElements()

    useImperativeHandle(ref, () => ({
        submit: async () => {
            if (!stripe || !elements) return 'Stripe er ikke initalisert enda.'

            const { error } = await elements.submit()

            if (error) return error.message || 'En feil oppsto når betalingen skulle sendes inn.'
        },
        confirmPayment: async (clientSecret: string) => {
            if (!stripe || !elements) return 'Stripe ikke initialisert enda.'

            const { error } = await stripe.confirmPayment({
                clientSecret,
                elements,
                confirmParams: {
                    return_url: window.location.href,
                },
            })

            if (error) return error.message || 'En feil oppsto når betalingen skulle bekreftes.'
        },
        confirmSetup: async (clientSecret: string) => {
            if (!stripe || !elements) return 'Stripe ikke initialisert enda.'

            const { error } = await stripe.confirmSetup({
                clientSecret,
                elements,
                confirmParams: {
                    return_url: window.location.href,
                },
            })

            if (error) return error.message || 'En feil oppsto ved lagring av informasjon.'
        }
    }))

    return <PaymentElement />
}
