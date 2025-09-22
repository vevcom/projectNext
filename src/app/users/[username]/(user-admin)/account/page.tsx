import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { getUser } from '@/auth/getUser'
import { calculateLedgerAccountBalanceAction } from '@/services/ledger/ledgerAccount/actions'
import LedgerAccountOverview from '@/components/Ledger/Accounts/LedgerAccountOverviewCard'
import LedgerAccountPaymentMethods from '@/components/Ledger/Accounts/LedgerAccountPaymentMethodsCard'
import LedgerAccountTransactionSummary from '@/components/Ledger/Accounts/LedgerAccountTransactionSummaryCard'

export default async function Account() {
    const session = await getUser({
        userRequired: true,
        shouldRedirect: true,
    }) // TODO: Replace with whatever we agree should be the standard for getting user
    
    const account = { id: 1 } //unwrapActionReturn(await readLedgerAccount({ userId: session.user.id }))

    const balance = unwrapActionReturn(await calculateLedgerAccountBalanceAction({ id: account.id }))

    return <div>
        <LedgerAccountOverview ledgerAccountId={account.id} showPayoutButton showDepositButton showDeactivateButton />
        <LedgerAccountPaymentMethods userId={session.user.id} />
        <LedgerAccountTransactionSummary ledgerAccountId={account.id} />
    </div>
}
