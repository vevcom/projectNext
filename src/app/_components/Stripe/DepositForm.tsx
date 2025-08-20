'use client'

import PaymentProvider from './StripePaymentProvider'
import PaymentForm from './PaymentForm'
import NumberInput from '@/components/UI/NumberInput'
import { useState } from 'react'
import type { ChangeEvent } from 'react'

type Props = {
    accountId: number,
}

export default function DepositForm({ accountId }: Props) {
    const [depositAmount, setDepositAmount] = useState<number>()

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDepositAmount(Number(event.target.value) * 100)
    }

    return <div>
        <br/>
        <PaymentProvider amount={depositAmount || 0}>
            <PaymentForm accountId={accountId}>
                <NumberInput label="Sum" name="amount" min="0" onChange={onChange}/>
            </PaymentForm>
        </PaymentProvider>
    </div>
}
