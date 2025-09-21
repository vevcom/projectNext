'use client'

import Form from '../Form/Form'
import StripePaymentProvider from '../Stripe/StripePaymentProvider'
import PopUp from '@/app/_components/PopUp/PopUp'
import Button from '@/app/_components/UI/Button'
import { useEffect, useState } from 'react'
import { CardElement, PaymentElement } from '@stripe/react-stripe-js'
import type { PaymentProvider } from '@prisma/client'
import type { ReactNode } from 'react'
import type { Action } from '@/actions/Types'

const paymentProviders: PaymentProvider[] = ['STRIPE', 'VIPPS', 'MANUAL']

const paymentProviderNames: Record<PaymentProvider, string> = {
    STRIPE: 'Stripe',
    VIPPS: 'Vipps',
    MANUAL: 'Administratormakt',
}

type PropTypes = {
    children?: ReactNode,
    popUpKey: string,
    buttonText: string;
    amount: number,
    callback: Action<FormData>,
    toAccountId?: number,
    fromAccountId?: number,
    balanceAccepted?: boolean,
    paymentAccepted?: boolean,
}

export function CheckoutModal({
    children,
    popUpKey,
    buttonText,
    amount,
    callback,
    toAccountId,
    fromAccountId,
    balanceAccepted,
    paymentAccepted,
}: PropTypes) {
    if (!balanceAccepted && !paymentAccepted) {
        throw new Error('At least one payment option must be accepted.')
    }

    const accountBalance = 1000 // TODO: Get account balance
    const balancePossible = Boolean(balanceAccepted) && accountBalance > 0

    const [useBalance, setUseBalance] = useState<boolean>(balancePossible)
    const [selectedPaymentProvider, setPaymentProvider] = useState<PaymentProvider | undefined>(paymentAccepted ? paymentProviders[0] : undefined)
    const [paymentNeeded, setPaymentNeeded] = useState<boolean>(true)

    useEffect(() => {
        setPaymentNeeded(amount > accountBalance || !useBalance)
    }, [useBalance])

    return (
        <PopUp
            PopUpKey={popUpKey}
            customShowButton={(open) => <Button onClick={open}>{buttonText}</Button>}
        >
            {children}
            <Form action={callback} submitText={buttonText} closePopUpOnSuccess={popUpKey}>
                <label hidden={!balanceAccepted || !paymentAccepted}>
                    <input type="checkbox" name="useBalance" checked={useBalance} disabled={!balancePossible} onChange={e => setUseBalance(e.target.checked)}/>
                    Bruk saldo
                </label>

                {paymentAccepted && <fieldset disabled={!paymentNeeded}>
                    <legend>Betal med...</legend>

                    {paymentProviders.map(paymentProvider => <label key={paymentProvider}>
                        <input
                            type="radio"
                            name="paymentProvider"
                            value={paymentProvider}
                            checked={paymentProvider === selectedPaymentProvider}
                            onChange={() => setPaymentProvider(paymentProvider)}
                        />
                        {paymentProviderNames[paymentProvider]}
                    </label>)}
                </fieldset>}

                {paymentNeeded ? <div>
                    {selectedPaymentProvider === 'STRIPE' && <div>
                        <StripePaymentProvider amount={500}>
                            <CardElement />
                        </StripePaymentProvider>
                    </div>}

                    {selectedPaymentProvider === 'VIPPS' && <div>
                        <p>Vipps er ikke helt ferdig enda...</p>
                    </div>}

                    {selectedPaymentProvider === 'MANUAL' && <div>
                        <p>DU BRUKER ADMINISTRATOR MAKT!</p>
                        <p>With Great power comes great responsibility. -En viss onkel</p>
                    </div>}
                </div> : <div>
                    {paymentAccepted && <p>Kontoen din har nok saldo. Betaling er ikke nødvendig.</p>}
                </div>}
            </Form>
        </PopUp>
    )
}
