// import styles from './TransactionRow.module.scss'
import { displayAmount } from '@/lib/currency/convert'
import type { Prisma } from '@prisma/client'

type Props = {
    transaction: Prisma.TransactionGetPayload<{ include: { payment: true, transfer: true } }>,
    showFees?: boolean,
}

export default function TransactionRow({ transaction, showFees }: Props) {
    const totalAmount = Number(transaction.transfer?.amount) + Number(transaction.payment?.amount)
    const totalFees = Number(transaction.transfer?.fees) + Number(transaction.payment?.fees)
    return <tr key={transaction.id}>
        <td>{transaction.createdAt.toLocaleString()}</td>
        <td>{transaction.purpose}</td>
        <td><b>{displayAmount(totalAmount)}</b></td>
        {/* {showFees && <p><i>{displayAmount(totalFees)}</i></p>} */}
        <td>{transaction.status}</td>
    </tr>
}
