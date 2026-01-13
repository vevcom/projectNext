import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readLedgerAccountAction } from '@/services/ledger/accounts/actions'
import LedgerAccountOverview from '@/components/Ledger/Accounts/LedgerAccountOverviewCard'
import LedgerAccountPaymentMethods from '@/components/Ledger/Accounts/LedgerAccountPaymentMethodsCard'
import LedgerAccountTransactionSummary from '@/components/Ledger/Accounts/LedgerAccountTransactionSummaryCard'
import { ServerSession } from '@/auth/session/ServerSession'
import { unauthorized } from 'next/navigation'

export default async function Account() {
    const session = await ServerSession.fromNextAuth()

    if (!session.user) unauthorized()

    const ledgerAccount = unwrapActionReturn(await readLedgerAccountAction({ params: { userId: session.user.id } }))

    return <div>
        <LedgerAccountOverview
            ledgerAccount={ledgerAccount}
            showPayoutButton
            showDepositButton
            showDeactivateButton
            showFees
        />
        <LedgerAccountPaymentMethods userId={session.user.id} />
        <LedgerAccountTransactionSummary ledgerAccountId={ledgerAccount.id} transactionsHref="account/transactions" />
    </div>
}
