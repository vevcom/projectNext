"use client"

import { CheckoutModal } from "@/app/_components/Ledger/CheckoutModal";
import { currencySymbol } from "@/lib/currency/config";

export default function EventPaymentModal() {
    return <CheckoutModal
        callback={(transactionDetails) => ({ success: true })}
        popUpKey="eventPaymentModal"
        buttonText={'Betal'}
        amount={1}
        paymentAccepted
    >
        <h3>Arrangementsbetaling</h3>
        <p>Phaestum Immatricularis XXX</p>
        <p><b>Total: 123 {currencySymbol}</b></p>
    </CheckoutModal>    
}