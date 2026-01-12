'use client'

import styles from './PaymentMethodList.module.scss'
import { deleteSavedPaymentMethodAction } from '@/services/stripeCustomers/actions'
import { FilteredPaymentMethod } from '@/services/stripeCustomers/types'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

type Params = {
    paymentMethods: FilteredPaymentMethod[],
}

export default function PaymentMethodList({ paymentMethods }: Params) {
    const router = useRouter()

    const displayPaymentMethod = ({ type, card, id }: FilteredPaymentMethod) => {
        switch (type) {
            case 'card':
                return <>
                    <span>{card?.brand.toUpperCase()}</span>
                    <span>**** **** **** {card?.last4}</span>
                    <span>(utløper {card?.exp_month}/{card?.exp_year})</span>
                </>
            default:
                return <><span>{type.toUpperCase()}</span></>
        }
    }

    const removePaymentMethod = async (id: string) => {
        await deleteSavedPaymentMethodAction({ params: { paymentMethodId: id } })
        router.refresh()
    }
    
    return (
        <ul>
            {paymentMethods.map((method) => (
                <li key={method.id} className={styles.paymentMethodElement}>
                    {displayPaymentMethod(method)} 
                    <button onClick={() => removePaymentMethod(method.id)} className={styles.deletePaymentMethodButton}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </li>
            ))}
        </ul>
    )
}