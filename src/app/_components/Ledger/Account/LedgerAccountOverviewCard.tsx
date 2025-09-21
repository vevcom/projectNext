import LedgerAccountBalance from './LedgerAccountBalance'
import Card from '@/components/UI/Card'
import DepositModal from '@/components/Ledger/Modals/DepositModal'
import PayoutModal from '@/components/Ledger/Modals/PayoutModal'

type Props = {
    ledgerAccountId: number,
}

export default function LedgerAccountOverview({ ledgerAccountId }: Props) {
    return <Card>
        <h2>Kontooversikt</h2>
        <LedgerAccountBalance ledgerAccountId={ledgerAccountId} showFees />
        <DepositModal ledgerAccountId={ledgerAccountId} />
        <PayoutModal ledgerAccountId={ledgerAccountId} />
    </Card>
}
