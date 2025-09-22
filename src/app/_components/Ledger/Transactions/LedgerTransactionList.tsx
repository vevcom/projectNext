'use client'

import LedgerTransactionRow from './LedgerTransactionRow'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import LedgerTransactionPagingProvider, { LedgerTransactionPagingContext } from '@/contexts/paging/LedgerTransactionPaging'
import { readLedgerAccountPageAction } from '@/services/ledger/ledgerAccount/actions'

type Props = {
    accountId: number,
    // TODO: showFees?: boolean,
}

export default function TransactionList({ accountId }: Props) {
    return <LedgerTransactionPagingProvider startPage={{ page: 0, pageSize: 10 }} details={{ accountId }} serverRenderedData={[]}>
        <EndlessScroll
            pagingContext={LedgerTransactionPagingContext}
            renderer={
                transaction => <LedgerTransactionRow key={transaction.id} transaction={transaction}/>
            }
        />
        <p>Her var det tomt! Hva med å ta seg en tur innom Kiogeskapet?</p>
    </LedgerTransactionPagingProvider>
}
