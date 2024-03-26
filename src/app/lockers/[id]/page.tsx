import { readLockerAction } from '@/actions/lockers/read'
import LockerNotFound from './LockerNotFound'
import LockerReservationForm from './LockerReservationForm'


type PropTypes = {
    params: {
        id: string
    }
}

export default async function Locker({ params }: PropTypes) {
    

    const locker = await readLockerAction(parseInt(params.id))
    if (!locker.success) {
        return <LockerNotFound />
    }

    const reserved = locker.data.LockerReservation.length > 0

    return (
        <div>
            <h1>Skap nr. {params.id}</h1>
            <p>{locker.data.building} {locker.data.floor}. etasje</p>
            {
                reserved ?
                    <p>Dette skapet er reservert av {locker.data.LockerReservation[0].user.firstname} {locker.data.LockerReservation[0].user.lastname} {locker.data.LockerReservation[0].endDate == null ? "på ubestemt tid" : `fram til ${locker.data.LockerReservation[0].endDate.toLocaleDateString()}`}</p>
                :   
                    <>
                        <p>Dette skapet er ledig</p>
                        <LockerReservationForm lockerId={params.id} />
                    </>
            }
        </div>
    )
}