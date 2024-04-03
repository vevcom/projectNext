import styles from './LockerRow.module.scss'
import Link from 'next/link'
import { LockerWithReservation } from '@/server/lockers/Types'

type PropTypes = {
    locker: LockerWithReservation
}

export default function LockerRow({ locker }: PropTypes) {
    return (
        <Link href={`/lockers/${locker.id}`} className={styles.lockerRow}>
            <p>{locker.id}</p>
            <p>{locker.building}</p>
            <p>{locker.floor}</p>
            <p className={styles.hideSecond}>{locker.LockerReservation.length ? locker.LockerReservation[0].user.firstname + " " +  locker.LockerReservation[0].user.lastname : ""}</p>
            <p className={styles.hideFirst}></p>
            <p>
                {
                locker.LockerReservation.length
                ? 
                    locker.LockerReservation[0].endDate == null
                    ?
                        "ubestemt"
                    :
                        locker.LockerReservation[0].endDate.toLocaleDateString()
                : 
                    ""
                }
            </p>
        </Link>
    )
}