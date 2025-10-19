import styles from './page.module.scss'
import BorderButton from '@/components/UI/BorderButton'
import { Session } from '@/auth/session/Session'
import { userAuth } from '@/services/users/auth'
import ProfilePicture from '@/components/User/ProfilePicture'
import UserDisplayName from '@/components/User/UserDisplayName'
import { readUserProfileAction } from '@/services/users/actions'
import { readSpecialImageAction } from '@/services/images/actions'
import { sexConfig } from '@/services/users/constants'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { v4 as uuid } from 'uuid'

export type PropTypes = {
    params: Promise<{
        username: string
    }>,
}

export default async function User({ params }: PropTypes) {
    const session = await Session.fromNextAuth()
    if ((await params).username === 'me') {
        if (!session.user) return notFound()
        redirect(`/users/${session.user.username}`) //This throws.
    }
    const profileRes = await readUserProfileAction({ params: { username: (await params).username } })
    if (!profileRes.success) return notFound()
    const profile = profileRes.data

    const committeeMemberships = profile.user.memberships.filter(membership => membership.group.groupType === 'COMMITTEE')
        .filter(membership => membership.group.committee !== null)

    const studyProgrammes = profile.user.memberships.filter(membership => membership.group.groupType === 'STUDY_PROGRAMME')
        .map(membership => membership.group.studyProgramme).filter(membership => membership !== null)

    const omegaMembership = profile.user.memberships
        .find(membership => membership.group.groupType === 'OMEGA_MEMBERSHIP_GROUP')
    if (!omegaMembership) {
        throw new Error('Failed to load the omega membership level')
    }

    const profileImage = profile.user.image ? profile.user.image : await readSpecialImageAction.bind(
        null, { params: { special: 'DEFAULT_PROFILE_IMAGE' } }
    )().then(res => {
        if (!res.success) throw new Error('Kunne ikke finne standard profilbilde')
        return res.data
    })

    const { authorized: canAdministrate } = userAuth.updateProfile.dynamicFields(
        { username: profile.user.username }
    ).auth(session)

    return (
        <div className={styles.wrapper}>
            <div className={styles.profile}>
                <div className={`${styles.top} ${styles.standard}`} /> {/* TODO change style based on flair */}

                <div className={styles.profileContent}>
                    <ProfilePicture width={240} profileImage={profileImage} />
                    <div className={styles.header}>
                        <div className={styles.nameAndId}>
                            <h1><UserDisplayName user={profile.user} /></h1>
                        </div>
                        { studyProgrammes.map((studyProgramme, i) =>
                            <p key={i} className={styles.studyProgramme}>
                                {studyProgramme.name} {`(${studyProgramme.code})`}
                            </p>
                        )}
                        <div className={styles.committeesWrapper}>
                            {
                                committeeMemberships.filter(membership => membership.active).map(membership =>
                                    <div className={styles.committee} key={uuid()}>
                                        <Link href={`/committees/${membership.group.committee?.shortName}`}>
                                            <p>{membership.title}</p>
                                        </Link>
                                    </div>
                                )
                            }
                            {/* TODO change to your own committee title instead of committee name*/}
                        </div>
                        <hr />
                        <p className={styles.orderText}>
                            {sexConfig[profile.user.sex ?? 'OTHER'].title}
                            uudaf {omegaMembership.order}´dis orden i Sanctus Omega Broderskab
                        </p>
                    </div>
                    <div className={styles.leftSection}>
                        <div className={styles.buttons}>
                            {canAdministrate && <Link href={`/users/${profile.user.username}/settings`}>
                                <BorderButton color="secondary">
                                    <p>Innstillinger</p>
                                </BorderButton>
                            </Link>}
                            {profile.user.id === session?.user?.id && (
                                <Link href="/logout">
                                    <BorderButton color="secondary">
                                        <p>Logg ut</p>
                                    </BorderButton>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className={styles.profileMain}>
                        {(profile.user.bio !== '') &&
                            <div className={styles.bio}>
                                <h2>Bio:</h2>
                                <p>{profile.user.bio}</p>
                            </div>
                        }
                        <p>
                            <span className={styles.email}>E-post:</span>
                            {profile.user.email}
                        </p>
                        <p>
                            <span className={styles.username}>Brukernavn:</span>
                            {profile.user.username}
                        </p>
                        <p>
                            <span className={styles.username}>Mobilnummer:</span>
                            {profile.user.mobile}
                        </p>

                        { (committeeMemberships.length > 0) && <div>
                            <h2>Medlemsskap</h2>
                            {committeeMemberships.map((membership, i) => (
                                <Link
                                    href={`/committees/${membership.group.committee?.shortName}`}
                                    key={i}
                                >
                                    <p>{membership.title} i {membership.group.committee?.name}</p>
                                </Link>
                            ))}
                        </div> }
                    </div>
                </div>
            </div>
        </div>
    )
}
