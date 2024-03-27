import { readLockerAction } from '@/actions/lockers/read'
import LockerNotFound from './LockerNotFound'
import CreateLockerReservationForm from './CreateLockerReservationForm'
import UpdateLockerReservationForm from './UpdateLockerReservationForm' 
import { getUser } from '@/auth/getUser'


type PropTypes = {
    params: {
        id: string
    }
}

export default async function Locker({ params }: PropTypes) {
    const { user, status, authorized } = await getUser({
        userRequired: true,
        shouldRedirect: true,
        requiredPermissions: [['LOCKER_READ']],
    })
    if (!authorized) return Error(status)
    
    const lockerId = parseInt(params.id)

    const locker = await readLockerAction(lockerId)
    if (!locker.success) {
        return <LockerNotFound />
    }

    const reserved = locker.data.LockerReservation.length > 0

    return (
        <div>
            <h1>Skap nr. {params.id}</h1>
            <p>{locker.data.building} {locker.data.floor}. etasje</p>
            {
                reserved 
                ?
                    <>
                        <p>Dette skapet er reservert av {locker.data.LockerReservation[0].user.firstname} {locker.data.LockerReservation[0].user.lastname} {locker.data.LockerReservation[0].endDate == null ? "på ubestemt tid" : `fram til ${locker.data.LockerReservation[0].endDate.toLocaleDateString()}`}</p>
                        {
                            user.id == locker.data.LockerReservation[0].user.id
                            ?
                                <UpdateLockerReservationForm reservationId={locker.data.LockerReservation[0].id}/>
                            :
                                <></>
                        }
                    </>
                :   
                    <>
                        <p>Dette skapet er ledig</p>
                        <CreateLockerReservationForm lockerId={lockerId} />
                    </>
            }
        </div>
    )
}