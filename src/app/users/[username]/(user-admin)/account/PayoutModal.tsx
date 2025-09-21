'use client'

import Form from '@/app/_components/Form/Form'
import PopUp from '@/app/_components/PopUp/PopUp'
import Button from '@/app/_components/UI/Button'
import Checkbox from '@/app/_components/UI/Checkbox'
import NumberInput from '@/app/_components/UI/NumberInput'
import TextInput from '@/app/_components/UI/TextInput'
import { currencySymbol } from '@/lib/currency/config'
import { displayAmount } from '@/lib/currency/convert'

type PropTypes = {
    accountId: number,
    paymentAmount?: number,
    accountNumber?: string,
}

export default function PayoutModal({ accountId, paymentAmount, accountNumber }: PropTypes) {
    return (
        <PopUp
            PopUpKey="PayoutForm"
            customShowButton={(open) => <Button onClick={open}>Registrer utbetaling</Button>}
        >
            <h3>Registrer utbetaling</h3>
            {paymentAmount && <p>Utestående beløp: <b>{displayAmount(paymentAmount)}</b> {currencySymbol}</p>}
            <p>Oppgitt kontonummer for utbetaling: {accountNumber ? <b>{accountNumber}</b> : <i>Ingen</i>}</p>
            <Form
                submitText="Registrer utbetaling"
                refreshOnSuccess={true}
                action={async () => ({ success: true, data: { accountId } })}
            >
                <NumberInput name="sum" label={`Antall ${currencySymbol}`} min="0" defaultValue={paymentAmount} required />
                <TextInput name="comment" label="Kommentar" defaultValue={accountNumber && `Utbetalt til ${accountNumber}`} required />
                <Checkbox name="hsMaaGaa" label="Jeg er klar over at utbetalinger gjøres manuelt og lover å overføre riktig beløp til oppgitt kontonummer." required/>
            </Form>
        </PopUp>
    )
}
