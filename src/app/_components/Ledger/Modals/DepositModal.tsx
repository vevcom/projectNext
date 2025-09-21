'use client'

import styles from './DepositModal.module.scss'
import Form from '../../Form/Form'
import PopUp from '../../PopUp/PopUp'
import NumberInput from '../../UI/NumberInput'
import Button from '../../UI/Button'
import { createDepositAction } from '@/services/ledger/ledgerOperations/actions'
import { convertAmount, displayAmount } from '@/lib/currency/convert'
import { lazy, useRef, useState } from 'react'
import type { PaymentProvider } from '@prisma/client'
import type { ExpandedPayment } from '@/services/ledger/payments/Types'
import type { StripePaymentRef } from '../../Stripe/StripePayment'
import { createActionError } from '@/services/actionError'

// Avoid loading the Stripe components until they are needed
const StripePayment = lazy(() => import('../../Stripe/StripePayment'))
const StripeProvider = lazy(() => import('../../Stripe/StripeProvider'))

const minFunds = 50_00

const defaultPaymentProvider: PaymentProvider = 'STRIPE'
const paymentProviderNames: Record<PaymentProvider, string> = {
    STRIPE: 'Stripe',
    MANUAL: 'Manuell Betaling',
}

type Props = {
    ledgerAccountId: number,
}

export default function DepositModal({ ledgerAccountId }: Props) {
    const [funds, setFunds] = useState(minFunds)
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>(defaultPaymentProvider)

    const stripePaymentRef = useRef<StripePaymentRef>(null)

    const confirmPayment = async (payment: ExpandedPayment) => {
        // Stripe payments are the only payments that need confirmation
        if (payment.provider !== 'STRIPE') return 'Ukjent betalingsleverandør.'

        // The client secret key should be set after creation
        const clientSecret = payment.stripePayment?.clientSecret
        if (!clientSecret) return 'Noe gikk galt ved opprettelse av betalingen.'

        // The stripe payment ref should be set when using stripe
        const current = stripePaymentRef.current
        if (!current) return 'Noe gikk galt ved innhenting av Stripe.'

        // Call the stripe payment ref to confirm the payment
        const confirmError = await current.confirm(clientSecret)
        if (confirmError) return confirmError
    }

    const handleSubmit = async (data: FormData) => {
        // If the stripe payment ref is set, validate the input
        if (stripePaymentRef.current) {
            const submitError = await stripePaymentRef.current.submit()
            if (submitError) return createActionError('UNKNOWN ERROR', submitError)
        }

        // Call the server action to create the deposit
        const createResult = await createDepositAction({ ledgerAccountId, funds, provider: selectedProvider })
        if (!createResult.success) return createResult

        // The returned transaction should have a payment
        const transaction = createResult.data
        const payment = transaction.payment
        if (!payment) return createActionError('UNKNOWN ERROR', 'Noe gikk galt ved opprettelse av betalingen.')

        // Confirm the payment if its needed
        if (payment.state === 'PENDING') {
            const confirmError = await confirmPayment(payment)
            if (confirmError) return createActionError('UNKNOWN ERROR', confirmError)
        }

        return { success: true } as const
    }

    return <PopUp PopUpKey={'depositModal'} customShowButton={(open) => <Button onClick={open} color="primary">Sett inn</Button>}>
        <div className={styles.checkoutFormContainer}>
            <Form action={handleSubmit} submitText="Sett inn">
                <NumberInput
                    label="Beløp"
                    name="funds"
                    step={1}
                    min={minFunds / 100}
                    defaultValue={funds / 100}
                    onChange={e => setFunds(convertAmount(e.target.value))}
                />

                <fieldset>
                    <legend>Betal med...</legend>

                    {Object.entries(paymentProviderNames).map(([provider, name]) => (
                        <label key={provider}>
                            <input
                                type="radio"
                                name="provider"
                                value={provider}
                                checked={selectedProvider === provider}
                                onChange={() => setSelectedProvider(provider as PaymentProvider)}
                            />
                            {name}
                        </label>
                    ))}
                </fieldset>

                {selectedProvider === 'STRIPE' && (
                    <StripeProvider amount={funds} >
                        <StripePayment ref={stripePaymentRef} />
                    </StripeProvider>
                )}

                {selectedProvider === 'MANUAL' && (
                    <div>
                        <p>Etter innsending vil du motta instruksjoner for manuell betaling.</p>
                    </div>
                )}
            </Form>
        </div>
    </PopUp>
}
