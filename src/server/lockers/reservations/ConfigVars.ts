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
                    id: true,
                    groupType: true,
                    class: {
                        select: {
                            year: true
                        }
                    },
                    committee: {
                        select: {
                            name: true
                        }
                    },
                    interestGroup: {
                        select: {
                            name: true
                        }
                    },
                    manualGroup: {
                        select: {
                            name: true
                        }
                    },
                    omegaMembershipGroup: {
                        select: {
                            omegaMembershipLevel: true
                        }
                    },
                    studyProgramme: {
                        select: {
                            name: true
                        }
                    }
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
