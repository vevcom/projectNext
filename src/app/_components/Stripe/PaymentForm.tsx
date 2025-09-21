'use client'

import Form from '@/components/Form/Form'
import { createStripeDeposit } from '@/actions/ledger/transactions/deposits'
import { createActionError } from '@/services/actionError'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React from 'react'

type Props = {
    accountId: number,
    children?: React.ReactNode,
}

export default function PaymentForm({ accountId, children }: Props) {
    const stripe = useStripe()
    const elements = useElements()

    const handleSubmit = async (formData: FormData) => {
        if (!stripe || !elements) {
            return createActionError('BAD DATA')
        }

        const { error: submitError } = await elements.submit()
        if (submitError) {
            return createActionError('BAD DATA', '')
        }

        const deposit = await createStripeDeposit({ accountId }, formData)

        if (!deposit.success) {
            return deposit
        }

        const { error: confirmationError } = await stripe.confirmPayment({
            clientSecret: deposit.data.clientSecret,
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            // redirect: 'if_required',
        })

        if (confirmationError) {
            return createActionError('UNKNOWN ERROR', confirmationError.message)
        }

        return {
            success: true,
        } as const
    }

    return <Form submitText="Sett inn" refreshOnSuccess action={handleSubmit}>
        {children}
        <PaymentElement />
    </Form>
}
