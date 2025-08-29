// import { readLedgerAccount } from '@/actions/ledger/ledgerAccount'
import TransactionList from '@/app/_components/Ledger/TransactionList/TransactionList'
import { getUser } from '@/auth/getUser'
import { Session } from '@/auth/Session'

export default async function Transactions() {
    // const transactionPagingContext = useContext(TransactionPagingContext)

    // if (!transactionPagingContext) {
    //     throw new Error('fuck')
    // }

    const { user } = await getUser({
        userRequired: true,
        shouldRedirect: true,
    })

    // const account = unwrapActionReturn(await readLedgerAccount({ userId: user.id }))

    const account = { id: 1 }

    return <TransactionList accountId={account.id}/>
}
