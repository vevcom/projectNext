import TransactionList from '@/components/Ledger/Transactions/LedgerTransactionList'
import { notFound } from 'next/navigation'

type Props = {
    params: Promise<{
        accountId: string,
    }>,
}

export default async function LedgerAccountTransactions({ params }: Props) {
    const accountId = Number((await params).accountId)

    if (!accountId) {
        notFound()
    }

    return <TransactionList accountId={accountId} />
}
