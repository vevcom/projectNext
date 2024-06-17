export const lockerReservationIncluder = {
    LockerReservation: {
        where: {
            active: true
        },
        select: {
            id: true,
            endDate: true,
            group: {
                select: {
                    id: true
                }
            },
            user: {
                select: {
                    id: true,
                    firstname: true,
                    lastname: true
                }
            }
        }
    }
}
