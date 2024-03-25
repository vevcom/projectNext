import { readLocker } from "@/actions/lockers/read"
import LockerNotFound from "./LockerNotFound"

type PropTypes = {
    params: {
        id: string
    },
}

export default async function Locker({ params }: PropTypes) {
    const locker = await readLocker(parseInt(params.id))
    if (!locker.success) {
        return <LockerNotFound />
    }

    let user = undefined
    if (locker.data.LockerReservation.length > 0) {
        user = locker.data.LockerReservation[0].user
    }

    return (
        <div>
            <h1>Skap nr. {params.id}</h1>
            <p>{locker.data.building} {locker.data.floor}. etasje</p>
            <p>Dette skapet er {user ? `reservert av ${user.firstname} ${user.lastname}` : "ledig"}</p>
        </div>
    )
}