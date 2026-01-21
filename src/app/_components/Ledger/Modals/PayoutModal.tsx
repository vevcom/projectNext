'use client'

import styles from './PayoutModal.module.scss'
import Form from '@/components/Form/Form'
import PopUp from '@/components/PopUp/PopUp'
import NumberInput from '@/components/UI/NumberInput'
import Button from '@/components/UI/Button'
import { convertAmount } from '@/lib/currency/convert'
import { configureAction } from '@/services/configureAction'
import { createPayoutAction } from '@/services/ledger/movements/actions'
import { useState } from 'react'

type Props = {
    ledgerAccountId: number,
    defaultFunds?: number,
    defaultFees?: number,
}

export default function PayoutModal({ ledgerAccountId, defaultFunds = 0, defaultFees = 0 }: Props) {
    const [funds, setFunds] = useState(defaultFunds)
    const [fees, setFees] = useState(defaultFees)

    return <PopUp
        popUpKey="payoutModal"
        customShowButton={(open) => <Button onClick={open} color="primary">Registrer utbetaling</Button>}
    >
        <h2>Ny utbetaling</h2>
        <div className={styles.checkoutFormContainer}>
            <Form
                action={configureAction(createPayoutAction, { params: { ledgerAccountId, fees, funds } })}
                submitText="Registrer utbetaling"
                buttonClassName={styles.submitButton}
                refreshOnSuccess
                closePopUpOnSuccess="payoutModal"
            >
                <NumberInput
                    label="Beløp"
                    defaultValue={defaultFunds / 100}
                    step={1}
                    min={0}
                    onChange={(e) => setFunds(convertAmount(e.target.value))}
                />
                <NumberInput
                    label="Avgifter"
                    defaultValue={defaultFees / 100}
                    step={1}
                    min={0}
                    onChange={(e) => setFees(convertAmount(e.target.value))}
                />
            </Form>
        </div>
    </PopUp>
}
