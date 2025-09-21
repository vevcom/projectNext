import TransactionList from '@/components/Ledger/Transactions/LedgerTransactionList'
import { getUser } from '@/auth/getUser'

export default async function Transactions() {
    const { user } = await getUser({
        userRequired: true,
        shouldRedirect: true,
    })

    const account = { id: 1 }

    return <TransactionList accountId={account.id}/>
}
