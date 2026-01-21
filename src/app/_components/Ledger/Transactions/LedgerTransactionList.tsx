'use client'

import styles from './LedgerTransactionList.module.scss'
import LedgerTransactionRow from './LedgerTransactionRow'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import { LedgerTransactionPagingProvider, LedgerTransactionPagingContext } from '@/contexts/paging/LedgerTransactionPaging'

type Props = {
    accountId: number,
    showFees?: boolean,
}

export default function TransactionList({ accountId, showFees }: Props) {
    return <LedgerTransactionPagingProvider
        startPage={{ page: 0, pageSize: 10 }}
        details={{ accountId }} serverRenderedData={[]}
    >
        <EndlessScroll
            pagingContext={LedgerTransactionPagingContext}
            renderer={
                transaction => <LedgerTransactionRow
                    key={transaction.id}
                    accountId={accountId}
                    transaction={transaction}
                    showFees={showFees}
                />
            }
            wrapper={children =>
                <table className={styles.transactionList}>
                    <thead>
                        <tr>
                            <th>Dato</th>
                            <th>Beskrivelse</th>
                            <th>Status</th>
                            <th>Beløp</th>
                            <th>Saldoendring</th>
                            {showFees && <th>Gebyrendring</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            }
        />
        {/* TODO: Add message "Her var det tomt! Hva med å ta seg en tur innom Kiogeskapet?" when no transaksjons exist. */}
    </LedgerTransactionPagingProvider>
}
