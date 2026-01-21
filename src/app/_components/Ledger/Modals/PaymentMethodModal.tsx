'use client'

import styles from './PaymentMethodModal.module.scss'
import PopUp from '@/app/_components/PopUp/PopUp'
import Button from '@/app/_components/UI/Button'
import Form from '@/components/Form/Form'
import StripePayment from '@/components/Stripe/StripePayment'
import StripeProvider from '@/components/Stripe/StripeProvider'
import { createActionError } from '@/services/actionError'
import { createSetupIntentAction } from '@/services/stripeCustomers/actions'
import { useRef } from 'react'
import type { StripePaymentRef } from '@/components/Stripe/StripePayment'

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!

type PropTypes = {
    userId: number,
}

export default function PaymentMethodModal({ userId }: PropTypes) {
    const stripePaymentRef = useRef<StripePaymentRef>(null)

    const handleSubmit = async () => {
        if (!stripePaymentRef.current) return createActionError('UNKNOWN ERROR', 'Noe gikk galt ved innhenting av Stripe.')

        const submitError = await stripePaymentRef.current.submit()

        if (submitError) return createActionError('BAD DATA', submitError)

        const createSetupIntentResult = await createSetupIntentAction({ params: { userId } })

        if (!createSetupIntentResult.success) return createSetupIntentResult

        const setupError = await stripePaymentRef.current.confirmSetup(createSetupIntentResult.data.setupIntentClientSecret)

        if (setupError) return createActionError('UNKNOWN ERROR', setupError)

        return {
            success: true,
            data: undefined,
        } as const
    }

    return (
        <PopUp
            popUpKey="PaymentMethodModal"
            customShowButton={(open) => <Button onClick={open}>Legg til bankkort</Button>}
        >
            <h3>Legg til bankkort</h3>
            <div className={styles.bankCardFormContainer}>
                <Form action={handleSubmit} submitText="Legg til bankkort">
                    <StripeProvider stripePublishableKey={stripePublishableKey} mode="setup">
                        <StripePayment ref={stripePaymentRef} />
                    </StripeProvider>
                </Form>
            </div>
        </PopUp>
    )
}
