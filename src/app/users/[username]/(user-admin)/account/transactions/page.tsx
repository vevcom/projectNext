import { readLedgerAccount } from "@/actions/ledger/ledgerAccount"
import TransactionList from "@/app/_components/Ledger/TransactionList/TransactionList";
import { unwrapActionReturn } from "@/app/redirectToErrorPage"
import { getUser } from "@/auth/getUser"

export default async function Transactions() {
    // const transactionPagingContext = useContext(TransactionPagingContext)

    // if (!transactionPagingContext) {
    //     throw new Error('fuck')
    // }

    const { user } = await getUser({
        userRequired: true,
        shouldRedirect: true,
    })

    const account = unwrapActionReturn(await readLedgerAccount({ userId: user.id }));

    return <TransactionList accountId={account.id}/>
}