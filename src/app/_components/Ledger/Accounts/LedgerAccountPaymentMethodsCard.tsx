import BankCardModal from '@/components/Ledger/Modals/BankCardModal'
import Card from '@/components/UI/Card'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readUserAction } from '@/services/users/actions'
import BooleanIndicator from '@/components/UI/BooleanIndicator'
import { createStripeCustomerSessionAction } from '@/services/stripeCustomers/actions'
import Link from 'next/link'

type Props = {
    userId: number,
}

const getCustomerSessionClientSecret = async (userId: number) => {
    const customerSessionResult = await createStripeCustomerSessionAction({ params: { userId } })
    if (customerSessionResult.success) {
        return customerSessionResult.data.customerSessionClientSecret
    }
    return undefined
}

export default async function LedgerAccountPaymentMethods({ userId }: Props) {
    const user = unwrapActionReturn(await readUserAction({ params: { id: userId } }))
    const customerSessionClientSecret = await getCustomerSessionClientSecret(userId)

    const hasBankCard = false // TODO: Actually check with Stripe
    const hasStudentCard = user.studentCard !== null

    return <Card heading="Betalingsalternativer">
        <h3>Bankkort <BooleanIndicator value={hasBankCard} /></h3>
        <p>
            Du kan lagre kortinformasjonen din for senere betalinger.
            Kortinformasjonen lagres kun hos betalingsleverandøren vår, Stripe, og ikke på våre tjenere.
        </p>
        <BankCardModal customerSessionClientSecret={customerSessionClientSecret} />
        <h3>NTNU-kort <BooleanIndicator value={hasStudentCard} /></h3>
        <p>Kortnummer: <strong>{hasStudentCard ? user.studentCard : 'ikke registrert'}</strong></p>
        <p>For å benytte Kiogeskabet på Lophtet må et NTNU-kort være registrert.</p>
        <Link href={`/users/${user.username}/settings`}>Gå til siden for kortregistrering.</Link>
    </Card>
}
