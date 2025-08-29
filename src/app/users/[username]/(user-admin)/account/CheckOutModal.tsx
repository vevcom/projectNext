"use client"

import { createUserAction } from "@/actions/users/create"
import PopUp from "@/app/_components/PopUp/PopUp"
import Button from "@/app/_components/UI/Button"
import Form from "@/components/Form/Form"
import { PaymentProvider } from "@prisma/client"

type PropTypes = {
    title: string,
    children?: React.ReactNode,
}

const defaultPaymentProvider: PaymentProvider = "STRIPE"

const paymentProviders: Record<PaymentProvider, string> = {
    STRIPE: "Stripe",
    MANUAL: "Manuell betaling",
}

export default function CheckoutModal({ title, children }: PropTypes) {
    return (
        <PopUp
            PopUpKey={title}
            customShowButton={(open) => <Button onClick={open}>{title}</Button>}
        >
            <p>1 kg. Maragin</p>
            <p>1 kg. Farin</p>
            <p>1 ts. Pepper</p>
            {children}
            <Form action={createUserAction} submitText={title} closePopUpOnSuccess={title}>
                <fieldset>
                    <legend>Betal med...</legend>

                    {Object.entries(paymentProviders).map(([provider, name]) => (
                        <label key={provider}>
                            <input type="radio" name="paymentProvider" value={provider} defaultChecked={provider===defaultPaymentProvider} />
                            {name}
                        </label>
                    ))}
                </fieldset>
            </Form>


        </PopUp>
    )
}