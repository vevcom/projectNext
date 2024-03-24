'use client'
import styles from './LockerList.module.scss'
import { LockerPagingContext } from '@/context/paging/LockerPaging'
import { useContext } from 'react'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'

export default function LockerList() {
    const context = useContext(LockerPagingContext)
    if (!context) throw new Error('No context')

    return (
        <div className={styles.lockerTable}>
            <div className={styles.lockerTableHeader}>
                <h3>Skap nr.</h3>
                <h3>Bygg</h3>
                <h3>Etasje</h3>
                <h3>Kommentar</h3>
                <h3>Person</h3>
                <h3>Komité</h3>
            </div>
            <div>
                <EndlessScroll pagingContext={LockerPagingContext} renderer={locker => (
                    <div className={styles.lockerRow} key={locker.id}>
                        <p>{locker.id}</p>
                        <p>{locker.building}</p>
                        <p>{locker.floor}</p>
                        <p>K</p>
                        <p>{locker.LockerReservation.length ? locker.LockerReservation[0].user.firstname + " " +  locker.LockerReservation[0].user.lastname: ""}</p>
                        <p></p>
                    </div>
                )} />
            </div>
        </div>
    )
}