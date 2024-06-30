import { LockerWithReservation } from "@/server/lockers/Types";

export function getGroupNameFromLocker(locker: LockerWithReservation) {
    if (locker.LockerReservation.length == 0) {
        return ""
    }

    const reservation = locker.LockerReservation[0]
    if (!reservation.group) {
        return ""
    } 

    const group = reservation.group

    switch (group.groupType) {
        case "CLASS":
            return group.class?.year + ". Klasse"
        case "COMMITTEE":
            return group.committee?.name 
        case "INTEREST_GROUP":
            return group.interestGroup?.name
        case "MANUAL_GROUP":
            return group.manualGroup?.name
        case "OMEGA_MEMBERSHIP_GROUP":
            return group.omegaMembershipGroup?.omegaMembershipLevel
        case "STUDY_PROGRAMME":
            return group.studyProgramme?.name
    }
}
