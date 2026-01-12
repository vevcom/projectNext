import TransactionList from '@/components/Ledger/Transactions/LedgerTransactionList'
// import { getUser } from '@/auth/session/getUser'

export default async function Transactions() {
    // const { user } = await getUser({
    //     userRequired: true,
    //     shouldRedirect: true,
    // })

    const account = { id: 2 }

    return <TransactionList accountId={account.id}/>
}
