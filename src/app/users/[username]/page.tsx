import styles from './page.module.scss'
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
import { Session } from '@/auth/Session'
import { UserProfileUpdateAuther } from '@/services/users/Authers'
import ProfilePicture from '@/app/_components/User/ProfilePicture'

type PropTypes = {
    params: {
        username: string
    },
}

export default async function User({ params }: PropTypes) {
    const session = await Session.fromNextAuth()
    if (params.username === 'me') {
        if (!session.user) return notFound()
        redirect(`/users/${session.user.username}`) //This throws.
    }
    const profileRes = await readUserProfileAction(params.username)
    if (!profileRes.success) return notFound()
    const profile = profileRes.data

    // REFACTOR THIS PART, THE ORDER IS BASED ON ORDER OF MEMBERSHIP NOT STUDYPROGRAMME ALSO I THINK
    const groupIds = profile.memberships.map(group => group.groupId)
    const committees = await readCommitteesFromIds(groupIds)

    //TODO: Basic user info will exist on the profile object
    const studyProgramme = { name: 'Kybernetikk', code: 'MTTK' }

    // TODO: Change to the correct order
    const order = 105

    const profileImage = profile.user.image ? profile.user.image : await readSpecialImage('DEFAULT_PROFILE_IMAGE')

    const { authorized: canAdministrate } = UserProfileUpdateAuther.dynamicFields(
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
                            <h1>{`${profile.user.firstname} ${profile.user.lastname}`}</h1>
                            <PopUp
                                showButtonClass={styles.omegaIdOpen}
                                showButtonContent={
                                    <FontAwesomeIcon icon={faQrcode} />
                                }
                                PopUpKey={'omegaId'}
                            >
                                <div className={styles.omegaId}>
                                    <OmegaId />
                                </div>
                            </PopUp>
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
                            {profile.user.id === session?.user?.id && (
                                <Link href="/logout">
                                    <BorderButton color="secondary">
                                        <p>Logg ut</p>
                                    </BorderButton>
                                </Link>
                            )
                            }
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
