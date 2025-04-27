import styles from './TransactionRow.module.scss'
import { displayAmount } from '@/lib/currency/convert'
import type { Transaction } from '@prisma/client'

type Props = {
    transaction: Transaction,
    showFees?: boolean,
}

export default function TransactionRow({ transaction, showFees }: Props) {
    return <span key={transaction.id} className={styles.TransactionRow}>
        <p>{transaction.createdAt.toLocaleString()}</p>
        <p><b>{displayAmount((transaction.amount))}</b></p>
        {showFees && <p><i>{transaction.fee ? displayAmount(transaction.fee) : '-'}</i></p>}
        <p>{transaction.type}</p>
        <p>{transaction.status}</p>
    </span>
}
