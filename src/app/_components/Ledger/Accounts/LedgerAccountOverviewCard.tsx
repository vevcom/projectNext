import styles from './LedgerAccountOverview.module.scss'
import LedgerAccountBalance from './LedgerAccountBalance'
import Card from '@/components/UI/Card'
import DepositModal from '@/components/Ledger/Modals/DepositModal'
import PayoutModal from '@/components/Ledger/Modals/PayoutModal'
import Button from '@/components/UI/Button'

type Props = {
    ledgerAccountId: number,
    showFees?: boolean,
    showDepositButton?: boolean,
    showPayoutButton?: boolean,
    showDeactivateButton?: boolean,
}

export default function LedgerAccountOverview({
    showFees,
    ledgerAccountId, 
    showPayoutButton, 
    showDepositButton,
    showDeactivateButton,
}: Props) {
    return <Card heading="Kontooversikt">
        <LedgerAccountBalance ledgerAccountId={ledgerAccountId} showFees={showFees} />
        <div className={styles.ledgerAccountOverviewButtons}>
            { showDepositButton && <DepositModal ledgerAccountId={ledgerAccountId} /> }
            { showPayoutButton && <PayoutModal ledgerAccountId={ledgerAccountId} /> }
            { showDeactivateButton && <Button color='red' className={styles.rightAligned}>Deaktiver</Button> }
        </div>
    </Card>
}
