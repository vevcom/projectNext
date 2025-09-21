'use client'

import { CheckoutModal } from '@/app/_components/Ledger/CheckoutModal'
import NumberInput from '@/app/_components/UI/NumberInput'
import { currencySymbol } from '@/lib/currency/config'

export default function DepositModal() {
    return <CheckoutModal callback={() => ({ success: true })} popUpKey="depositModal" buttonText={`Fyll på ${currencySymbol}`} amount={1} paymentAccepted>
        <h3>Sett inn {currencySymbol}</h3>
        <NumberInput label={`Antall ${currencySymbol}`} />
    </CheckoutModal>
}
