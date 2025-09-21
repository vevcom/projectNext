import LedgerAccountBalance from '@/components/Ledger/Account/LedgerAccountBalance'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { getUser } from '@/auth/getUser'
import { calculateLedgerAccountBalanceAction } from '@/services/ledger/ledgerAccount/actions'
import LedgerAccountOverview from '@/components/Ledger/Account/LedgerAccountOverviewCard'
import LedgerAccountPaymentMethods from '@/components/Ledger/Account/LedgerAccountPaymentMethodsCard'

export default async function Account() {
    const session = await getUser({
        userRequired: true,
        shouldRedirect: true,
    }) // TODO: Replace with whatever we agree should be the standard for getting user

    const account = { id: 1 } //unwrapActionReturn(await readLedgerAccount({ userId: session.user.id }))

    const balance = unwrapActionReturn(await calculateLedgerAccountBalanceAction({ id: account.id }))

    return <div>
        <LedgerAccountOverview ledgerAccountId={account.id} />
        <LedgerAccountPaymentMethods userId={session.user.id} />
        <LedgerAccountBalance ledgerAccountId={account.id} showFees />
    </div>
}
