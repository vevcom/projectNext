import styles from './page.module.scss'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readLockerAction } from '@/actions/lockers/read'
import LockerNotFound from './LockerNotFound'
import CreateLockerReservationForm from './CreateLockerReservationForm'
import UpdateLockerReservationForm from './UpdateLockerReservationForm' 
import { getUser } from '@/auth/getUser'
import { readGroupsOfUser } from '@/server/groups/read'
import { getGroupNameFromLocker } from '../util'


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

    const isReserved = locker.data.LockerReservation.length > 0
    const reservation = locker.data.LockerReservation[0]
    const groupName = getGroupNameFromLocker(locker.data)

    const groups = await readGroupsOfUser(user.id)

    const groupsFormData = groups.map(group => {
        let name = "test"
        switch (group.groupType) {
            case "CLASS":
                name = group.class?.year + ". Klasse"
                break
            case "COMMITTEE":
                name = group.committee?.name 
                break
            case "INTEREST_GROUP":
                name = group.interestGroup?.name
                break
            case "MANUAL_GROUP":
                name = group.manualGroup?.name
                break
            case "OMEGA_MEMBERSHIP_GROUP":
                name = group.omegaMembershipGroup?.omegaMembershipLevel
                break
            case "STUDY_PROGRAMME":
                name = group.studyProgramme?.name
                break

        }
        return {value: group.id.toString(), label: name}
    })

    return (
        <PageWrapper title="Skapreservasjon">
            <div className={styles.lockerCard}>
                <h2>Skap nr. {params.id}</h2>
                <p>{locker.data.building} {locker.data.floor}. etasje</p>
                {
                    isReserved 
                    ?
                    <>
                            <p>Dette skapet er reservert av {reservation.user.firstname} {reservation.user.lastname} {reservation.group ? `på vegne av ${groupName}` : ""} {reservation.endDate == null ? "på ubestemt tid" : `fram til ${reservation.endDate.toLocaleDateString()}`}</p>
                            {
                                user.id == reservation.user.id
                                ?
                                <UpdateLockerReservationForm reservationId={reservation.id} groupsFormData={groupsFormData}/>
                                :
                                <></>
                            }
                        </>
                    :   
                    <>
                            <p>Dette skapet er ledig</p>
                            <CreateLockerReservationForm lockerId={lockerId} groupsFormData={groupsFormData}/>
                        </>
                }
            </div>
        </PageWrapper>
    )
}
