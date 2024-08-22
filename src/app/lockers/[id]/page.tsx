import styles from './page.module.scss'
import LockerNotFound from './LockerNotFound'
import CreateLockerReservationForm from './CreateLockerReservationForm'
import UpdateLockerReservationForm from './UpdateLockerReservationForm'
import { getGroupNameFromLocker } from '@/app/lockers/util'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readLockerAction } from '@/actions/lockers/read'
import { getUser } from '@/auth/getUser'
import { readGroupsOfUser } from '@/server/groups/read'


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

    const lockerId = parseInt(params.id, 10)

    const locker = await readLockerAction(lockerId)
    if (!locker.success) {
        return <LockerNotFound />
    }

    const isReserved = locker.data.LockerReservation.length > 0
    const reservation = locker.data.LockerReservation[0]
    const groupName = getGroupNameFromLocker(locker.data)

    const groups = await readGroupsOfUser(user.id)

    const groupsFormData = groups.map(group => {
        let name = 'test'
        switch (group.groupType) {
            case 'CLASS':
                name = `${group.class?.year}. Klasse`
                break
            case 'COMMITTEE':
                name = group.committee?.name
                break
            case 'INTEREST_GROUP':
                name = group.interestGroup?.name
                break
            case 'MANUAL_GROUP':
                name = group.manualGroup?.name
                break
            case 'OMEGA_MEMBERSHIP_GROUP':
                name = group.omegaMembershipGroup?.omegaMembershipLevel
                break
            case 'STUDY_PROGRAMME':
                name = group.studyProgramme?.name
                break
        }
        return { value: group.id.toString(), label: name }
    })

    const { firstname, lastname } = isReserved
        ? reservation.user
        : { firstname: '', lastname: '' }
    const groupText = isReserved && reservation.group
        ? `på vegne av ${groupName}`
        : ''
    let endDateText = ''
    if (isReserved) {
        if (reservation.endDate === null) {
            endDateText = 'på ubestemt tid'
        } else {
            endDateText = `fram til ${reservation.endDate.toLocaleDateString()}`
        }
    }

    return (
        <PageWrapper title="Skapreservasjon">
            <div className={styles.lockerCard}>
                <h2>Skap nr. {params.id}</h2>
                <p>{locker.data.building} {locker.data.floor}. etasje</p>
                {
                    isReserved
                        ?
                        <>
                            <p>Dette skapet er reservert av {firstname} {lastname} {groupText} {endDateText}</p>
                            {
                                user.id === reservation.user.id
                                    ?
                                    <UpdateLockerReservationForm
                                        reservationId={reservation.id}
                                        groupsFormData={groupsFormData}
                                    />
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
