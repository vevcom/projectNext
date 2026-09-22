'use client'

import LedgerTransactionModal from './LedgerTransactionModal'
import NumberInput from '@/components/UI/NumberInput'
import { convertAmount } from '@/lib/currency/convert'
import { createPayoutAction } from '@/services/ledger/movements/actions'
import { useState } from 'react'

type Props = {
    ledgerAccountId: number,
}

export default function PayoutModal({ ledgerAccountId }: Props) {
    const [funds, setFunds] = useState(0)

    return <LedgerTransactionModal
        popUpKey="payoutModal"
        triggerLabel="Registrer utbetaling"
        title="Ny utbetaling"
        submitText="Registrer utbetaling"
        funds={funds}
        showTotal={false}
        availablePaymentMethods={['MANUAL']}
        refreshOnSuccess
        onSubmitAction={({ manualFees, description }) => createPayoutAction({
            params: {
                ledgerAccountId,
                funds,
                fees: manualFees ?? 0,
                description,
            }
        })}
    >
        <NumberInput
            label="Beløp"
            name="funds"
            step={1}
            min={0}
            defaultValue={0}
            onChange={e => setFunds(convertAmount(e.target.value))}
            required
        />
    </LedgerTransactionModal>
}
