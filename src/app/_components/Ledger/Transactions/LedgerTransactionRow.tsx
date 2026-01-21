import styles from './LedgerTransactionRow.module.scss'
import { displayAmount } from '@/lib/currency/convert'
import type { ExpandedLedgerTransaction } from '@/services/ledger/transactions/types'

type Props = {
    transaction: ExpandedLedgerTransaction,
    accountId: number,
    showFees?: boolean,
}

export default function LedgerTransactionRow({ transaction, accountId, showFees }: Props) {
    const totalFunds = (
        transaction.ledgerEntries?.reduce((sum, entry) => sum + Math.abs(entry.funds), 0)
        + Math.abs(transaction.payment?.funds ?? 0)
    ) / 2

    const fundsChange = transaction.ledgerEntries.find(entry => entry.ledgerAccountId === accountId)?.funds ?? null
    const feesChange = transaction.ledgerEntries.find(entry => entry.ledgerAccountId === accountId)?.fees ?? null

    return <tr>
        <td>{transaction.createdAt.toLocaleString()}</td>
        <td>{transaction.purpose}</td>
        <td>{transaction.state}</td>
        <td className={styles.rightAlign}><b>{displayAmount(totalFunds)}</b></td>
        <td className={styles.rightAlign}><b>{fundsChange !== null ? displayAmount(fundsChange) : '-'}</b></td>
        {showFees && <td className={styles.rightAlign}><i>{feesChange !== null ? displayAmount(feesChange) : '-'}</i></td>}
    </tr>
}
