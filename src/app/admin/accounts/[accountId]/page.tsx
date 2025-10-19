import LedgerAccountOverview from '@/components/Ledger/Accounts/LedgerAccountOverviewCard'
import LedgerAccountTransactionSummary from '@/components/Ledger/Accounts/LedgerAccountTransactionSummaryCard'
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

    return <div>
        <LedgerAccountOverview ledgerAccountId={accountId} showPayoutButton showDeactivateButton />
        {/* Add link to products overview */}
        <LedgerAccountTransactionSummary ledgerAccountId={accountId} transactionsHref={`${accountId}/transactions`} />
    </div>
}
