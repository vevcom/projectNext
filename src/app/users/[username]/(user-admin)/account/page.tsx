import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { getUser } from '@/auth/session/getUser'
import { calculateLedgerAccountBalanceAction, readLedgerAccountAction } from '@/services/ledger/ledgerAccount/actions'
import LedgerAccountOverview from '@/components/Ledger/Accounts/LedgerAccountOverviewCard'
import LedgerAccountPaymentMethods from '@/components/Ledger/Accounts/LedgerAccountPaymentMethodsCard'
import LedgerAccountTransactionSummary from '@/components/Ledger/Accounts/LedgerAccountTransactionSummaryCard'

export default async function Account() {
    const session = await getUser({
        userRequired: true,
        shouldRedirect: true,
    }) // TODO: Replace with whatever we agree should be the standard for getting user

    const ledgerAccount = unwrapActionReturn(await readLedgerAccountAction({ params: { userId: session.user.id } }))

    return <div>
        <LedgerAccountOverview ledgerAccount={ledgerAccount} showPayoutButton showDepositButton showDeactivateButton />
        <LedgerAccountPaymentMethods userId={session.user.id} />
        <LedgerAccountTransactionSummary ledgerAccountId={ledgerAccount.id} transactionsHref="account/transactions" />
    </div>
}
