import styles from './LedgerTransactionRow.module.scss'
import { displayAmount } from '@/lib/currency/convert'
import type { ExpandedLedgerTransaction } from '@/services/ledger/ledgerTransactions/Type'

type Props = {
    transaction: ExpandedLedgerTransaction,
    showFees?: boolean,
}

export default function LedgerTransactionRow({ transaction, showFees }: Props) {
    const totalFunds = transaction.ledgerEntries?.reduce((sum, entry) => sum + entry.funds, 0)
    const totalFees = transaction.ledgerEntries?.reduce((sum, entry) => sum + (entry.fees ?? 0), 0)

    return <span key={transaction.id} className={styles.TransactionRow}>
        <p>{transaction.createdAt.toLocaleString()}</p>
        <p><b>{displayAmount(totalFunds)}</b></p>
        {showFees && <p><i>{transaction.ledgerEntries ? displayAmount(totalFees) : '-'}</i></p>}
        <p>{transaction.purpose}</p>
        <p>{transaction.state}</p>
    </span>
}
