import styles from './LedgerAccountOverview.module.scss'
import LedgerAccountBalance from './LedgerAccountBalance'
import Card from '@/components/UI/Card'
import DepositModal from '@/components/Ledger/Modals/DepositModal'
import PayoutModal from '@/components/Ledger/Modals/PayoutModal'
import Button from '@/components/UI/Button'
import { getUser } from '@/auth/session/getUser'
import { createStripeCustomerSessionAction } from '@/services/stripeCustomers/actions'

type Props = {
    ledgerAccountId: number,
    showFees?: boolean,
    showDepositButton?: boolean,
    showPayoutButton?: boolean,
    showDeactivateButton?: boolean,
}

const getCustomerSessionClientSecret = async () => {
    const { user } = await getUser()
    if (!user) {
        return undefined
    }

    const customerSessionResult = await createStripeCustomerSessionAction({ params: { userId: user.id } })
    if (!customerSessionResult.success) {
        return undefined
    }

    return customerSessionResult.data.customerSessionClientSecret
}

export default async function LedgerAccountOverview({
    showFees,
    ledgerAccountId,
    showPayoutButton,
    showDepositButton,
    showDeactivateButton,
}: Props) {
    const customerSessionClientSecret = showDepositButton
        ? await getCustomerSessionClientSecret()
        : undefined

    return <Card heading="Kontooversikt">
        <LedgerAccountBalance ledgerAccountId={ledgerAccountId} showFees={showFees} />
        <div className={styles.ledgerAccountOverviewButtons}>
            {
                showDepositButton &&
                <DepositModal ledgerAccountId={ledgerAccountId} customerSessionClientSecret={customerSessionClientSecret} />
            }
            { showPayoutButton && <PayoutModal ledgerAccountId={ledgerAccountId} /> }
            { showDeactivateButton && <Button color="red" className={styles.rightAligned}>Deaktiver</Button> }
        </div>
    </Card>
}
