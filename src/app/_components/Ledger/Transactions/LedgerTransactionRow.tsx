import styles from './LedgerTransactionRow.module.scss'
import { displayAmount } from '@/lib/currency/convert'
import type { ExpandedLedgerTransaction } from '@/services/ledger/transactions/types'
import type { LedgerTransactionPurpose, LedgerTransactionState } from '@/prisma-generated-pn-types'

type Props = {
    transaction: ExpandedLedgerTransaction,
    accountId: number,
    showFees?: boolean,
}

const transactionPurposeNames: Record<LedgerTransactionPurpose, string> = {
    SHOP_PURCHASE: 'Kjøp i Kiogeskabet',
    EVENT_PAYMENT: 'Arrangementsbetaling',
    DEPOSIT: 'Innskudd',
    PAYOUT: 'Utbetaling',
    REFUND: 'Refusjon',
}

const transactionStateNames: Record<LedgerTransactionState, string> = {
    PENDING: 'Under behandling',
    SUCCEEDED: 'Fullført',
    FAILED: 'Feilet',
    CANCELED: 'Avbrutt',
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
        <td>{transaction.description ?? transactionPurposeNames[transaction.purpose]}</td>
        <td>{transactionStateNames[transaction.state]}</td>
        <td className={styles.rightAlign}><b>{displayAmount(totalFunds)}</b></td>
        <td className={styles.rightAlign}><b>{fundsChange !== null ? displayAmount(fundsChange) : '-'}</b></td>
        {showFees && <td className={styles.rightAlign}><i>{feesChange !== null ? displayAmount(feesChange) : '-'}</i></td>}
    </tr>
}
