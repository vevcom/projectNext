"use client"

import PopUp from "@/app/_components/PopUp/PopUp";
import Button from "@/app/_components/UI/Button";
import { CardElement } from "@stripe/react-stripe-js";

type PropTypes = {
    userId: number,
}

export default function BankCardModal({userId }: PropTypes) {
    
    return (
        <PopUp
            PopUpKey="BankAccountModal"
            customShowButton={(open) => <Button onClick={open}>Legg til bankkort</Button>}
        >
            <h3>Legg til bankkort</h3>
            <p>TODO</p>
            {/* <CardElement  /> */}
        </PopUp>
    )
}
