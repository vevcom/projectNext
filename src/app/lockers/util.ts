import type { LockerWithReservation } from '@/services/lockers/Types'

export function getGroupNameFromLocker(locker: LockerWithReservation): string {
    if (locker.LockerReservation.length === 0) {
        return ''
    }

    const reservation = locker.LockerReservation[0]
    if (!reservation.group) {
        return ''
    }

    const group = reservation.group

    return getGroupName(group)
}

// This should probably be in another file, but I don't know where
export function getGroupName(group) {
    switch (group.groupType) {
        case 'CLASS':
            if (!group.class) {
                return '?'
            }
            return `${group.class.year}. Klasse`
        case 'COMMITTEE':
            if (!group.committee) {
                return '?'
            }
            return group.committee.name
        case 'INTEREST_GROUP':
            if (!group.interestGroup) {
                return '?'
            }
            return group.interestGroup.name
        case 'MANUAL_GROUP':
            if (!group.manualGroup) {
                return '?'
            }
            return group.manualGroup.name
        case 'OMEGA_MEMBERSHIP_GROUP':
            if (!group.omegaMembershipGroup) {
                return '?'
            }
            return group.omegaMembershipGroup.omegaMembershipLevel
        case 'STUDY_PROGRAMME':
            if (!group.studyProgramme) {
                return '?'
            }
            return group.studyProgramme.name
        default:
            return '?'
    }
}
