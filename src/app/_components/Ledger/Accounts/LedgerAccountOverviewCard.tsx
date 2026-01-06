import styles from './LedgerAccountOverviewCard.module.scss'
import LedgerAccountBalance from './LedgerAccountBalance'
import Card from '@/components/UI/Card'
import DepositModal from '@/components/Ledger/Modals/DepositModal'
import PayoutModal from '@/components/Ledger/Modals/PayoutModal'
import { getUser } from '@/auth/session/getUser'
import { createStripeCustomerSessionAction } from '@/services/stripeCustomers/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { LedgerAccount } from '@prisma/client'
import { updateLedgerAccountAction } from '@/services/ledger/ledgerAccount/actions'
import LedgerAccountFreezeButton from './LedgerAccountFreezeButton'

type Props = {
    ledgerAccount: LedgerAccount,
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
    ledgerAccount,
    showPayoutButton,
    showDepositButton,
    showDeactivateButton,
}: Props) {
    const customerSessionClientSecret = showDepositButton
        ? await getCustomerSessionClientSecret()
        : undefined

    return <Card heading="Kontooversikt">
        <LedgerAccountBalance ledgerAccountId={ledgerAccount.id} showFees={showFees} />
        <div className={styles.frozenStatus}>
            {
                <p className={ledgerAccount.frozen ? "" : styles.frozenWarningHidden}><FontAwesomeIcon icon={faWarning}/> Kontoen er fryst; Ingen transaksjoner kan utføres.</p>
            }
        </div>
        <div className={styles.ledgerAccountOverviewButtons}>
            {
                showDepositButton &&
                <DepositModal ledgerAccountId={ledgerAccount.id} customerSessionClientSecret={customerSessionClientSecret} />
            }
            { showPayoutButton && <PayoutModal ledgerAccountId={ledgerAccount.id} /> }
            { showDeactivateButton && <LedgerAccountFreezeButton ledgerAccount={ledgerAccount} className={styles.rightAligned} /> }
        </div>
    </Card>
}
