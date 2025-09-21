'use client'

import styles from './LedgerTransactionList.module.scss'
import LedgerTransactionRow from './LedgerTransactionRow'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import LedgerTransactionPagingProvider, { LedgerTransactionPagingContext } from '@/contexts/paging/LedgerTranasctionPaging'

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
    </LedgerTransactionPagingProvider>
}
