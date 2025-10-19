'use client'

import LedgerTransactionRow from './LedgerTransactionRow'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import LedgerTransactionPagingProvider, { LedgerTransactionPagingContext } from '@/contexts/paging/LedgerTransactionPaging'

type Props = {
    accountId: number,
    showFees?: boolean,
}

export default function TransactionList({ accountId, showFees }: Props) {
    return <LedgerTransactionPagingProvider startPage={{ page: 0, pageSize: 10 }} details={{ accountId }} serverRenderedData={[]}>
        <EndlessScroll
            pagingContext={LedgerTransactionPagingContext}
            renderer={
                transaction => <LedgerTransactionRow key={transaction.id} transaction={transaction} showFees={showFees} />
            }
        />
        {/* TODO: Add message "Her var det tomt! Hva med å ta seg en tur innom Kiogeskapet?" when no transaksjons exist. */}
    </LedgerTransactionPagingProvider>
}
