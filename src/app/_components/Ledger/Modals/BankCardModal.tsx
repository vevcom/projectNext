'use client'

import styles from './BankCardModal.module.scss'
import PopUp from '@/app/_components/PopUp/PopUp'
import Button from '@/app/_components/UI/Button'
import StripePayment from '@/components/Stripe/StripePayment'
import StripeProvider from '@/components/Stripe/StripeProvider'

type PropTypes = {
    userId: number,
}

export default function BankCardModal({ userId }: PropTypes) {
    return (
        <PopUp
            PopUpKey="BankAccountModal"
            customShowButton={(open) => <Button onClick={open}>Legg til bankkort</Button>}
        >
            <h3>Legg til bankkort</h3>
            <div className={styles.bankCardFormContainer}> 
                <StripeProvider mode='setup'>
                    <StripePayment />
                </StripeProvider>
            </div>
        </PopUp>
    )
}
