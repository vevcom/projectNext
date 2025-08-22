import styles from './page.module.scss'
import LockerNotFound from './LockerNotFound'
import CreateLockerReservationForm from './CreateLockerReservationForm'
import UpdateLockerReservationForm from './UpdateLockerReservationForm'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readLockerAction } from '@/services/lockers/actions'
import { getUser } from '@/auth/getUser'
import { checkGroupValidity, GroupMethods, inferGroupName } from '@/services/groups/methods'


type PropTypes = {
    params: Promise<{
        id: string
    }>
}

export default async function Locker({ params }: PropTypes) {
    const { user, status, authorized } = await getUser({
        userRequired: true,
        shouldRedirect: true,
        requiredPermissions: [['LOCKER_USE']],
    })
    if (!authorized) return Error(status)

    const lockerId = parseInt((await params).id, 10)

    const locker = await readLockerAction({ id: lockerId })
    if (!locker.success) {
        return <LockerNotFound />
    }

    const isReserved = locker.data.LockerReservation.length > 0
    const reservation = locker.data.LockerReservation[0]
    const groupName = (isReserved && reservation.group) ? inferGroupName(checkGroupValidity(reservation.group)) : ''

    const groups = await GroupMethods.readGroupsOfUser({
        bypassAuth: true,
        params: {
            userId: user.id,
        },
    })

    const groupsFormData = groups.map(group => {
        const name = inferGroupName(group)
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
                <h2>Skap nr. {(await params).id}</h2>
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
                            <CreateLockerReservationForm
                                lockerId={lockerId}
                                groupsFormData={groupsFormData}
                            />
                        </>
                }
            </div>
        </PageWrapper>
    )
}
