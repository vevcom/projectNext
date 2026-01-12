import PaymentMethodList from '@/components/Ledger/Modals/PaymentMethodList'
import PaymentMethodModal from '@/components/Ledger/Modals/PaymentMethodModal'
import Card from '@/components/UI/Card'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readUserAction } from '@/services/users/actions'
import BooleanIndicator from '@/components/UI/BooleanIndicator'
import { readSavedPaymentMethodsAction } from '@/services/stripeCustomers/actions'
import Link from 'next/link'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
    userId: number,
}

export default async function LedgerAccountPaymentMethods({ userId }: Props) {
    const user = unwrapActionReturn(await readUserAction({ params: { id: userId } })) // TODO: Change to better method
    const savedPaymentMethods = unwrapActionReturn(await readSavedPaymentMethodsAction({ params: { userId } }))

    const hasBankCard = savedPaymentMethods.length > 0
    const hasStudentCard = user.studentCard !== null

    return <Card heading="Betalingsalternativer">
        <h3>Bankkort <BooleanIndicator value={hasBankCard} /></h3>
        <p>
            Du kan lagre kortinformasjonen din for senere betalinger.
            Kortinformasjonen lagres kun hos betalingsleverandøren vår, Stripe, og ikke på våre tjenere.
        </p>
        <PaymentMethodList paymentMethods={savedPaymentMethods} />
        <PaymentMethodModal userId={userId} />
        <h3>NTNU-kort <BooleanIndicator value={hasStudentCard} /></h3>
        <p>For å benytte Kiogeskabet på Lophtet må et NTNU-kort være registrert.</p>
        <p>Kortnummer: <strong>{hasStudentCard ? user.studentCard : 'ikke registrert'}</strong></p>
        <Link href={`/users/${user.username}/settings`}>
            Gå til siden for kortregistrering <FontAwesomeIcon icon={faArrowRight} />
        </Link>
    </Card>
}
