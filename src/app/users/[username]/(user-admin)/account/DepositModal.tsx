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

export default function DepositModal({ accountId }: PropTypes) {
    return (
        <PopUp
            PopUpKey="DepositModal"
            customShowButton={(open) => <Button onClick={open}>{`Sett inn ${currencySymbol}`}</Button>}
        >
            <h3>Sett inn {currencySymbol}</h3>
            {/* <Form
                submitText={`Sett inn ${currencySymbol}`}
                refreshOnSuccess={true}
                action={async () => ({ success: true, data: { accountId } })}
            > */}
            <NumberInput name="sum" label={`Antall ${currencySymbol}`} min="0" required />
            {/* </Form> */}
            <p>Betal med...</p>
            <Button>Stripe</Button>
            <Button>Vipps</Button>
            <Button>Administratormakt</Button>
        </PopUp>
    )
}
