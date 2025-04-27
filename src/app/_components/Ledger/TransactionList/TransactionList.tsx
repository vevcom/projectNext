'use client'

import TransactionRow from './TransactionRow'
import TransactionPagingProvider, { TransactionPagingContext } from '@/contexts/paging/TranasctionPaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'

type Props = {
    accountId: number,
    // TODO: showFees?: boolean,
}

export default function TransactionList({ accountId }: Props) {
    return <TransactionPagingProvider startPage={{ page: 0, pageSize: 10 }} details={{ accountId }} serverRenderedData={[]}>
        <EndlessScroll
            pagingContext={TransactionPagingContext}
            renderer={
                transaction => <TransactionRow key={transaction.id} transaction={transaction}/>
            }
        />
    </TransactionPagingProvider>
}
