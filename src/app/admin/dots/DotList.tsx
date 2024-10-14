'use client'
import EndlessScroll from '@/app/_components/PagingWrappers/EndlessScroll'
import { DotPagingContext } from '@/contexts/paging/DotPaging'
import styles from './DotList.module.scss'
import { displayDate } from '@/dates/displayDate'
import { UtcToOslo } from '@/dates/UtcToOslo'

export default function DotList() {
    return (
        <table className={styles.DotList}>
            <thead>
                <tr>
                    <th>Grunn</th>
                    <th>For</th>
                    <th>Gitt av</th>
                    <th>Utløpstider</th>
                </tr>
            </thead>
            <tbody>
                <EndlessScroll pagingContext={DotPagingContext} renderer={
                    dotWrapper => <tr key={dotWrapper.id}>
                        <td>{dotWrapper.reason}</td>
                        <td>{dotWrapper.user.username}</td>
                        <td>{dotWrapper.accuser.username}</td>
                        <td>
                        {
                            dotWrapper.dots.map(dot => (
                                <div key={dot.id}>
                                    {displayDate(dot.expiresAt)}
                                </div>
                            ))
                        }
                        </td>
                    </tr>
                } />
            </tbody>
        </table>
    )
}
