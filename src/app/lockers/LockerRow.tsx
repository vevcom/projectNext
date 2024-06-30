import styles from './LockerRow.module.scss'
import Link from 'next/link'
import { LockerWithReservation } from '@/server/lockers/Types'
import { getGroupNameFromLocker } from './util'

type PropTypes = {
    locker: LockerWithReservation
}

export default function LockerRow({ locker }: PropTypes) {
    const isReserved = locker.LockerReservation.length > 0
    const reservation = locker.LockerReservation[0]
    const groupName = getGroupNameFromLocker(locker)

    return (
        <Link href={`/lockers/${locker.id}`} className={styles.lockerRow}>
            <p>{locker.id}</p>
            <p>{locker.building}</p>
            <p>{locker.floor}</p>
            <p className={styles.hideSecond}>{isReserved ? reservation.user.firstname + " " +  reservation.user.lastname : ""}</p>
            <p className={styles.hideFirst}>{groupName}</p>
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
