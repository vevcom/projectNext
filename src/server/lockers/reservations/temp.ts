import { createSelection } from '@/server/createSelection'
import { LockerReservation, User } from "@prisma/client"

const userFieldsToExpose = ['id', 'firstname', 'lastname'] satisfies (keyof User)[]
const userFilterSelection = createSelection([...userFieldsToExpose])
const lockerReservationFieldsToExpose = ['id', 'endDate'] satisfies (keyof LockerReservation)[]
const lockerReservationSelection = createSelection([...lockerReservationFieldsToExpose])

export const lockerReservationIncluder = {
    LockerReservation: {
        where: {
            active: true
        },
        select: {
            id: true,
            user: {
                select: userFilterSelection
            },
            endDate: true
        }
    }
}