'use client'

import styles from './LedgerAccountList.module.scss'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import LedgerAccountPagingProvider, { LedgerAccountPagingContext } from '@/contexts/paging/LedgerAccountPaging'
import Link from 'next/link'

export default function LedgerAccountList() {
    return <LedgerAccountPagingProvider startPage={{ page: 0, pageSize: 10 }} details={{ accountType: 'GROUP' }} serverRenderedData={[]}>
        <table className={styles.ledgerAccountListTable}>
            <thead>
                <tr>
                    <th>Navn</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>
                <EndlessScroll pagingContext={LedgerAccountPagingContext} renderer={account =>
                    <tr key={account.id}>
                        <td><Link href={`accounts/${account.id}`}>{account.name}</Link></td>
                        <td>19.19 Klinguende Muente</td>
                    </tr>
                }/>
            </tbody>
        </table>
    </LedgerAccountPagingProvider>
}
