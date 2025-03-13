"use client"

import TransactionPagingProvider, { TransactionPagingContext } from "@/contexts/paging/TranasctionPaging";
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import TransactionRow from "./TransactionRow";

type Props = {
    accountId: number,
    showFees?: boolean,
}

export default function TransactionList({ accountId, showFees }: Props) {
    return <TransactionPagingProvider startPage={{ page: 0, pageSize: 10 }} details={{ accountId }} serverRenderedData={[]}>
        <EndlessScroll
            pagingContext={TransactionPagingContext}
            renderer={
                transaction => <TransactionRow key={transaction.id} transaction={transaction}/>
            }
        />
    </TransactionPagingProvider>
}