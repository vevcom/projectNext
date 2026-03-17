import styles from './page.module.scss'
import getCommittee from '@/app/committees/[shortName]/getCommittee'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readCommitteeApplicationsInPeriodAction } from '@/services/applications/committeeParticipation/actions'
import ProfilePicture from '@/components/User/ProfilePicture'
import { readSpecialImageAction } from '@/services/images/actions'
import Link from 'next/link'
import type { Image as ImageT } from '@/prisma-generated-pn-types'
export type PropTypes = {
    params: Promise<{
        shortName: string,
        participationId: number,
    }>
}


async function loadUserImage(image: ImageT | null) {
    return image ? image : await readSpecialImageAction.bind(
        null, { params: { special: 'DEFAULT_PROFILE_IMAGE' } }
    )().then(res => {
        if (!res.success) throw new Error('Kunne ikke finne standard profilbilde')
        return res.data
    })
}


export default async function PeriodeCommitteePage({ params }: PropTypes) {
    const participationId = (await params).participationId
    const applications = unwrapActionReturn(
        await readCommitteeApplicationsInPeriodAction({ params: { participationId } })
    )
    if (applications.length === 0) { return 'ingen søknader funnet' }
    const sortedApplications = applications.sort((a, b) => a.applicationPriority - b.applicationPriority)
    return (
        <div className={styles.applicationContainer}>
            {sortedApplications.map(async (application, index) => (
                <table key={index}>
                    <tr>
                        <th><h3>{application.applicationPriority}.</h3></th>
                        <th>
                            <ProfilePicture
                                width={240}
                                profileImage={(await loadUserImage(application.image))}
                                className={styles.profilePicture}
                            />
                        </th>
                        <th><Link href={`/users/${application.username}`}>
                            <h3>{application.firstname} {application.lastname}</h3>
                        </Link>
                        </th>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td><p>{application.applicationText}</p></td>
                    </tr>
                </table>
            ))
            }
        </div>
    )
}


