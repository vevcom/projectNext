import styles from './page.module.scss'
import { getUser } from '@/auth/getUser'
import Image from '@/components/Image/Image'
import { readSpecialImage } from '@/services/images/read'
import BorderButton from '@/components/UI/BorderButton'
import { readCommitteesFromIds } from '@/services/groups/committees/read'
import { readUserProfileAction } from '@/actions/users/read'
import { sexConfig } from '@/services/users/ConfigVars'
import OmegaId from '@/components/OmegaId/identification/OmegaId'
import PopUp from '@/components/PopUp/PopUp'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { v4 as uuid } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import type { UserFiltered } from '@/services/users/Types'

type PropTypes = {
    params: {
        username: string
    },
}

/**
 * Function to get the correct profile to view on profile pages
 * @param user - The user logged on
 * @param username - The username of the user to get the profile of
 * @returns - The profile of the user to view, me if the user is the same as the logged on user
 */
export async function getProfile(user: UserFiltered | null, paramUsername: string) {
    const me = user && (paramUsername === 'me' || paramUsername === user.username)

    const profileRes = await readUserProfileAction(me ? user.username : paramUsername)

    if (!profileRes.success) notFound()

    return { profile: profileRes.data, me }
}

export default async function User({ params }: PropTypes) {
    const { user, permissions } = await getUser({
        shouldRedirect: true,
        returnUrl: `/users/${params.username}`,
        userRequired: params.username === 'me'
    })

    if (params.username === 'me' && user) {
        redirect(user.username)
    }
    const { profile, me } = await getProfile(user, params.username)

    // REFACTOR THIS PART, THE ORDER IS BASED ON ORDER OF MEMBERSHIP NOT STUDYPROGRAMME ALSO I THINK
    const groupIds = profile.memberships.map(group => group.groupId)
    const committees = await readCommitteesFromIds(groupIds)

    //TODO: Basic user info will exist on the profile object
    const studyProgramme = { name: 'Kybernetikk', code: 'MTTK' }

    // TODO: Change to the correct order
    const order = 105

    const profileImage = profile.user.image ? profile.user.image : await readSpecialImage('DEFAULT_PROFILE_IMAGE')

    const canAdministrate = me || permissions.includes('USERS_UPDATE')

    return (
        <div className={styles.wrapper}>
            <div className={styles.profile}>
                <div className={`${styles.top} ${styles.standard}`} /> {/* TODO change style based on flair */}

                <div className={styles.profileContent}>
                    <div className={styles.imageWrapper}>
                        <Image className={styles.profilePicture} image={profileImage} width={240}/>
                    </div>
                    <div className={styles.header}>
                        <div className={styles.nameAndId}>
                            <h1>{`${profile.user.firstname} ${profile.user.lastname}`}</h1>
                            {me && <PopUp
                                showButtonClass={styles.omegaIdOpen}
                                showButtonContent={
                                    <FontAwesomeIcon icon={faQrcode} />
                                }
                                PopUpKey={'omegaId'}
                            >
                                <div className={styles.omegaId}>
                                    <OmegaId />
                                </div>
                            </PopUp> }
                        </div>
                        {
                            studyProgramme && (
                                <p className={styles.studyProgramme}>{studyProgramme.name} {`(${studyProgramme.code})`}</p>
                            )
                        }
                        <div className={styles.committeesWrapper}>
                            {
                                committees.map(committee =>
                                    <div className={styles.committee} key={uuid()}><p>{committee.name}</p></div>
                                )
                            }
                            {/* TODO change to your own committee title instead of committee name*/}
                        </div>
                        <hr/>
                        <p className={styles.orderText}>
                            {sexConfig[profile.user.sex ?? 'OTHER'].title} uudaf {order}´dis orden i Sanctus Omega Broderskab
                        </p>
                    </div>
                    <div className={styles.leftSection}>
                        <div className={styles.buttons}>
                            {canAdministrate && <Link href={`/users/${profile.user.username}/settings`}>
                                <BorderButton color="secondary">
                                    <p>Instillinger</p>
                                </BorderButton>
                            </Link>}
                            {me && <Link href="/logout">
                                <BorderButton color="secondary">
                                    <p>Logg ut</p>
                                </BorderButton>
                            </Link>}
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
                    </div>
                </div>
            </div>
        </div>
    )
}
