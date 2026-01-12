import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import LedgerAccountOverview from '@/components/Ledger/Accounts/LedgerAccountOverviewCard'
import LedgerAccountTransactionSummary from '@/components/Ledger/Accounts/LedgerAccountTransactionSummaryCard'
import { readLedgerAccountAction } from '@/services/ledger/ledgerAccount/actions'
import { notFound } from 'next/navigation'

type Props = {
    params: Promise<{
        accountId: string,
    }>,
}

export default async function LedgerAccount({ params }: Props) {
    const accountId = Number((await params).accountId)

    if (!accountId) {
        notFound()
    }

    const ledgerAccount = unwrapActionReturn(await readLedgerAccountAction({ params: { ledgerAccountId: accountId } }))

    return <div>
        <LedgerAccountOverview ledgerAccount={ledgerAccount} showPayoutButton showDeactivateButton showFees />
        {/* Add link to products overview */}
        <LedgerAccountTransactionSummary ledgerAccountId={accountId} transactionsHref={`${accountId}/transactions`} />
    </div>
}
