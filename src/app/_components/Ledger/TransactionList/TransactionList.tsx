'use client'

import styles from './TransactionList.module.scss'
import TransactionRow from './TransactionRow'
import TransactionPagingProvider, { TransactionPagingContext } from '@/contexts/paging/TranasctionPaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'

type Props = {
    accountId: number,
    // TODO: showFees?: boolean,
}

export default function TransactionList({ accountId }: Props) {
    return <TransactionPagingProvider startPage={{ page: 0, pageSize: 10 }} details={{ accountId }} serverRenderedData={[]}>
        <table className={styles.DotList}>
            <thead>
                <tr>
                    <th>Dato</th>
                    <th>Beløp</th>
                    <th>Type</th>
                    <th>Beskrivelse</th>
                    <th>Betalingsmåte</th>
                    <th>Saldoendring</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>01.01.1970</td>
                    <td align='right'>0 Kluengende Meunt</td>
                    <td>Innskudd</td>
                    <td>-</td>
                    <td>Ingen</td>
                    <td>-</td>
                </tr>
                {/* The EndlessScroll component will render the rows */}
            </tbody>
        </table>
        <EndlessScroll
            pagingContext={TransactionPagingContext}
            renderer={
                transaction => <TransactionRow key={transaction.id} transaction={transaction}/>
            }
        />
    </TransactionPagingProvider>
}
