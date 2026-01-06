'use client'
import styles from './CheckoutModal.module.scss'
import Form from '@/components/Form/Form'
import PopUp from '@/components/PopUp/PopUp'
import Button from '@/components/UI/Button'
import { createActionError } from '@/services/actionError'
import React, { useState, lazy, Ref, useRef } from 'react'
import type { ExpandedLedgerTransaction } from '@/services/ledger/ledgerTransactions/types'
import type { PaymentProvider } from '@prisma/client'
import type { StripePaymentRef } from '../../Stripe/StripePayment'
import type { ActionReturn } from '@/services/actionTypes'

const StripeProvider = lazy(() => import('../../Stripe/StripeProvider'))
const StripePayment = lazy(() => import('../../Stripe/StripePayment'))

const defaultPaymentProvider: PaymentProvider = 'STRIPE'

const paymentProviderNames: Record<PaymentProvider, string> = {
    STRIPE: 'Stripe',
    MANUAL: 'Manuell Betaling',
}

type Props = {
    callback: (data: object) => Promise<ActionReturn<ExpandedLedgerTransaction>>,
    title?: string,
    showSummary?: boolean,
    availableFunds?: number,
    totalFunds?: number,
    manualFees?: number,
    sourceLedgerAccountId?: number,
    targetLedgerAccountId?: number,
    children?: React.ReactNode,
}

export default function CheckoutModal({
    callback,
    title = 'Betal',
    showSummary = true,
    totalFunds = 100,
    availableFunds = 50,
    manualFees = 0,
    sourceLedgerAccountId,
    targetLedgerAccountId,
}: Props) {
    // const stripe = useStripe()

    const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>(defaultPaymentProvider)
    const [useFunds, setUseFunds] = useState<boolean>(availableFunds > 0)

    const stripePaymentRef = useRef<StripePaymentRef>(null)

    const fundsToTransfer = useFunds ? Math.min(totalFunds, availableFunds) : 0
    const fundsToPay = Math.max(0, totalFunds - fundsToTransfer)

    const handleSubmit = async (): Promise<ActionReturn<void, false>> => {
        if (paymentProvider === 'STRIPE') {
            const result = await stripePaymentRef?.current?.submit()

            if (!result) {
                return createActionError('BAD DATA', 'Stripe er ikke initalisert enda.')
            }

            if (!result.success) {
                return result
            }
        }

        const result = await callback({
            ledgerEntries: [
                ...(fundsToTransfer > 0 ? [{
                    ledgerAccountId: sourceLedgerAccountId,
                    funds: -fundsToTransfer,
                }] : []),
                ...(fundsToTransfer > 0 ? [{
                    ledgerAccountId: targetLedgerAccountId,
                    funds: fundsToTransfer,
                }] : []),
            ],
            payment: {
                paymentProvider,
                funds: fundsToPay,
            },
        })

        if (!result.success) return result

        const transaction = result.data

        if (transaction.payment?.state === 'PENDING') {
            if (paymentProvider !== 'STRIPE' || !transaction.payment?.stripePayment) {
                return createActionError('BAD DATA', 'Ugyldig betalingsdata fra server.')
            }

            stripePaymentRef.current?.confirm(transaction.payment.stripePayment.clientSecret)
        }

        const { payment } = result.data
        return { success: true }
    }

    return (
        <PopUp
            PopUpKey={title}
            showButtonContent={title}
            customShowButton={(open) => <Button onClick={open} color="primary">{title}</Button>}
        >
            <div className={styles.checkoutFormContainer}>
                <Form action={handleSubmit} submitText={title}>
                    <label>
                        <input
                            type="checkbox"
                            name="useFunds"
                            defaultChecked={useFunds}
                            disabled={availableFunds <= 0}
                            onChange={(events) => setUseFunds(events.target.checked)}
                        />
                        Bruk saldo
                    </label>

                    <fieldset disabled={fundsToPay <= 0}>
                        <legend>Betal med...</legend>

                        {Object.entries(paymentProviderNames).map(([provider, name]) => (
                            <label key={provider}>
                                <input
                                    type="radio"
                                    name="paymentProvider"
                                    value={provider}
                                    defaultChecked={provider === defaultPaymentProvider}
                                    onChange={() => setPaymentProvider(provider as PaymentProvider)}
                                />
                                {name}
                            </label>
                        ))}
                    </fieldset>

                    <div className={styles.paymentDetails}>
                        {fundsToPay > 0 && (
                            paymentProvider === 'STRIPE' && (
                                <StripeProvider amount={fundsToPay}>
                                    <StripePayment ref={stripePaymentRef}/>
                                </StripeProvider>
                            ) ||
                            paymentProvider === 'MANUAL' && (
                                <blockquote>
                                    With great power comes great responsibility.
                                    <footer>— <cite>A wise uncle</cite></footer>
                                </blockquote>
                            )
                        )}
                    </div>
                    {/* {amountToPay > 0 ? (
                        // paymentProvider === "STRIPE" && <p>Du vil bli omdirigert til Stripe for å fullføre betalingen.</p> ||
                        // paymentProvider === "MANUAL" && <p>Du vil motta instruksjoner for manuell betaling via e-post etter at du har sendt inn skjemaet.</p>
                        // ) : (
                        //     <p>Saldoen din dekker hele beløpet; ingen betaling er nødvendig.</p>
                        // )} */}

                    {showSummary && <table className={styles.summary}>
                        <tbody>
                            <tr>
                                <td>Trukket fra saldo</td>
                                <td className="text-right" align="right">{fundsToTransfer} Kluengende Muente</td>
                            </tr>
                            <tr>
                                <td>Å betale</td>
                                <td className="text-right" align="right">{fundsToPay} Kluengende Muente</td>
                            </tr>
                        </tbody>
                    </table>}
                    {/* <p>Trukket fra saldo: <strong>{fundsToTransfer}</strong> Kluengende Muente.</p>
                    <p>Å betale: <strong>{fundsToPay}</strong> Kluengende Muente.</p> */}
                </Form>
            </div>
        </PopUp>
    )
}

{/* <table>
    <tbody>
    <tr>
        <td>Tilgjengelig Saldo</td>
        <td className="text-right" align="right">{displayAmount(availableFunds)} Kluengende Muente</td>
    </tr>
    <tr>
        <td>Totalt</td>
        <td className="text-right" align="right">{displayAmount(totalAmount)} Kluengende Muente</td>
    </tr>
    <tr>
        <td>Å betal</td>
        <td className="text-right" align="right">{displayAmount(amountToPay)} Kluengende Muente</td>
    </tr>
    </tbody>
</table> */}


// type PropType = {
//     supportedProviders?: PaymentProvider[],
// }

// export function CheckoutForm({ supportedProviders }: PropType) {
//     const paymentProviders = [
//         { provider: "STRIPE", name: "Stripe", component: <StripeForm /> },
//         { provider: "MANUAL", name: "Manuell Betaling", component: <ManualForm /> }
//     ].filter(({ provider }) => !supportedProviders || supportedProviders.includes(provider as PaymentProvider))

//     const [selectedProvider, setSelectedProvider] = useState("STRIPE")

//     return <div>
//         <fieldset>
//             <legend>Betal med...</legend>
//             {paymentProviders.map(({ provider, name }) => (
//                 <label key={provider}>
//                     <input
//                         type="radio"
//                         name="paymentProvider"
//                         value={provider}
//                         defaultChecked={provider==="STRIPE"}
//                         onChange={() => setSelectedProvider(provider)}
//                     />
//                     {name}
//                 </label>
//             ))}
//         </fieldset>

//         {paymentProviders.map(({ provider, component }, i) =>
//             provider === selectedProvider && <div key={i}>{component}</div>
//         )}
//     </div>
// }
