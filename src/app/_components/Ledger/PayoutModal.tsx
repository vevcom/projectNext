'use client'

import styles from "./PayoutModal.module.scss"
import Form from "../Form/Form";
import PopUp from "../PopUp/PopUp";
import NumberInput from "../UI/NumberInput";
import { createPayout } from "@/services/ledger/ledgerOperations/actions";
import Button from "../UI/Button";
import { convertAmount } from "@/lib/currency/convert";
import { useState } from "react";
import { bindParams } from "@/actions/bind";

type Props = {
    ledgerAccountId: number,
    defaultFunds?: number,
    defaultFees?: number,
}

export default function PayoutModal({ ledgerAccountId, defaultFunds = 0, defaultFees = 0 }: Props) {
    const [funds, setFunds] = useState(defaultFunds)
    const [fees, setFees] = useState(defaultFees)
    
    return <PopUp PopUpKey="payoutModal" customShowButton={(open) => <Button onClick={open} color="primary">Registrer utbetaling</Button>}>
        <div className={styles.checkoutFormContainer}>
            <Form 
                action={bindParams(createPayout, { ledgerAccountId, fees, funds })} 
                submitText="Registrer utbetaling"
                buttonClassName={styles.submitButton}
            >
                <NumberInput
                    label="Beløp"
                    defaultValue={defaultFunds/100}
                    step={1}
                    min={0}
                    onChange={(e) => setFunds(convertAmount(e.target.value))}
                />
                <NumberInput
                    label="Avgifter"
                    defaultValue={defaultFees/100}
                    step={1}
                    min={0}
                    onChange={(e) => setFees(convertAmount(e.target.value))}
                />
            </Form>
        </div>
    </PopUp>
}
