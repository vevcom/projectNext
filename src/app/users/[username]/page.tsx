import styles from './page.module.scss'
import BorderButton from '@/components/UI/BorderButton'
import { userAuth } from '@/services/users/auth'
import ProfilePicture from '@/components/User/ProfilePicture'
import UserDisplayName from '@/components/User/UserDisplayName'
import { readUserProfileAction } from '@/services/users/actions'
import { readSpecialImageAction } from '@/services/images/actions'
import { ServerSession } from '@/auth/session/ServerSession'
import { sexConfig } from '@/services/users/constants'
import { readUserFlairsAction } from '@/services/flairs/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { RelationshipStatus } from '@/prisma-generated-pn-types'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { v4 as uuid } from 'uuid'
import React from 'react'


export type PropTypes = {
    params: Promise<{
        username: string
    }>,
}

export default async function User({ params }: PropTypes) {
    const session = await ServerSession.fromNextAuth()
    if ((await params).username === 'me') {
        if (!session.user) redirect('/login')
        redirect(`/users/${session.user.username}`) //This throws.
    }
    const profileRes = await readUserProfileAction({ params: { username: (await params).username } })
    if (!profileRes.success) return notFound()
    const profile = profileRes.data

    const committeeMemberships = profile.user.memberships.filter(membership => membership.group.groupType === 'COMMITTEE')
        .filter(membership => membership.group.committee !== null)

    const studyProgrammes = profile.user.memberships.filter(membership => membership.group.groupType === 'STUDY_PROGRAMME')
        .map(membership => membership.group.studyProgramme).filter(membership => membership !== null)

    const classes = profile.user.memberships.filter(membership => membership.group.groupType === 'CLASS')
        .map(membership => membership.group.class).filter(membership => membership !== null)

    const omegaMembership = profile.user.memberships
        .find(membership => membership.group.groupType === 'OMEGA_MEMBERSHIP_GROUP')
    if (!omegaMembership) {
        throw new Error('Failed to load the omega membership level')
    }
    const flairs = unwrapActionReturn(await readUserFlairsAction({ params: { userId: profile.user.id } })).sort(
        (a, b) => a.rank - b.rank
    )

    const profileImage = profile.user.image ? profile.user.image : await readSpecialImageAction.bind(
        null, { params: { special: 'DEFAULT_PROFILE_IMAGE' } }
    )().then(res => {
        if (!res.success) throw new Error('Kunne ikke finne standard profilbilde')
        return res.data
    })


    const { authorized: canAdministrate } = userAuth.updateProfile.dynamicFields(
        { username: profile.user.username }
    ).auth(session)

    const relationshipColour = {
        [RelationshipStatus.SINGLE]: 'green',
        [RelationshipStatus.ITS_COMPLICATED]: 'yellow',
        [RelationshipStatus.TAKEN]: 'red',
        [RelationshipStatus.NOT_SPECIFIED]: 'white'
    }

    const borderColour = { '--border-colour': relationshipColour[profile.user.relationshipStatus] } as React.CSSProperties

    function memberhipTitle(): string {
        switch (omegaMembership?.group.omegaMembershipGroup?.omegaMembershipLevel) {
            case 'SOELLE':
                return 'Soelle Noviice (avsky!)'
            case 'MEMBER':
                return `
                    ${sexConfig[profile.user.sex ?? 'OTHER'].title}
                    uudaf ${omegaMembership.order}´dis orden i Sanctus Omega Broderskab
                `
            case 'EXTERNAL':
                return 'Ekstern'
            default:
        }
        return 'Kunne ikke finne tittel'
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.profile}>
                <div
                    style={ flairs.length > 0 ? {
                        backgroundColor: `rgb(${flairs[0].colorR}, ${flairs[0].colorG}, ${flairs[0].colorB})`
                    } : {} }
                    className={`${styles.top} ${styles.standardFlairColor}`}
                />

                <div className={styles.profileContent} style={borderColour}>
                    <ProfilePicture width={240} profileImage={profileImage} className={styles.profilePicture}/>
                    <div className={styles.header}>
                        <div className={styles.nameAndId}>
                            <h1><UserDisplayName
                                user={profile.user}
                                width={40}
                                asClient={false}
                            /></h1>
                        </div>
                        {studyProgrammes.map((studyProgramme, i) =>
                            <p key={i} className={styles.studyProgramme}>
                                {studyProgramme.name} {`(${studyProgramme.code})`}
                            </p>
                        )}
                        {classes.map((classGroup, i) =>
                            <p key={i} className={styles.studyProgramme}>{classGroup.year}. årstrinn</p>
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
                            { memberhipTitle() }
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

                        {(profile.user.relationshipStatus !== RelationshipStatus.NOT_SPECIFIED) &&
                        <p>
                            <span className={styles.relationshipStatus}>Sivilstatus: </span>
                            {profile.user.relationshipStatusText ? profile.user.relationshipStatusText :
                                profile.user.relationshipStatus === RelationshipStatus.SINGLE && 'Singel' ||
                            profile.user.relationshipStatus === RelationshipStatus.ITS_COMPLICATED && 'Det er komplisert' ||
                            profile.user.relationshipStatus === RelationshipStatus.TAKEN && 'I et forhold'

                            }

                        </p>
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

                        {(committeeMemberships.length > 0) && <div>
                            <h2>Medlemsskap</h2>
                            {committeeMemberships.map((membership, i) => (
                                <Link
                                    href={`/committees/${membership.group.committee?.shortName}`}
                                    key={i}
                                >
                                    <p>{membership.title} i {membership.group.committee?.name}</p>
                                </Link>
                            ))}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
