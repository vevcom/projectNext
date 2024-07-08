import styles from "./page.module.scss"
import prisma from '@/prisma'
import { getUser } from '@/auth/getUser'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from "@/components/Image/Image"  
import { readSpecialImage } from "@/server/images/read"
import BorderButton from "@/app/components/UI/BorderButton"
import { readUserProfile } from "@/server/users/read"
import { readCommitteesFromIds } from "@/server/groups/committees/read"
import { prismaCall } from "@/server/prismaCall"

type PropTypes = {
    params: {
        username: string
    },
}

export default async function User({ params }: PropTypes) {
    const { user } = await getUser({
        userRequired: true,
        shouldRedirect: true,
        returnUrl: `/users/${params.username}`,
    })

    const me = params.username === 'me' || params.username === user.username
    const username = me ? user.username : params.username

    const profile = await readUserProfile({username})

    if (!profile) {
        notFound()
    }

    const groupIds = profile.memberships.map(group => group.groupId)
    const committees = await readCommitteesFromIds(groupIds)

    const studyProgramme = await prismaCall(() => prisma.studyProgramme.findFirst({
        where: {
            id: {
                in: groupIds
            }
        },
        include: {
            group: {
                include: {
                    memberships: {
                        include: {
                            omegaOrder: {
                                select: {
                                    order: true
                                }
                            }
                        }
                    }
                }
            }
        }
    }))

    if (!studyProgramme) {
        throw new Error("studyProgramme not found")
    }

    const order = studyProgramme.group.memberships[0].omegaOrder.order

    let profileImage = profile.image
    if (!profileImage) {
        profileImage = await readSpecialImage("DEFAULT_PROFILE_IMAGE")
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={`${styles.top} ${styles.standard}`}> {/* TODO change style based on flair */}
            </div>
            <div className={styles.profileContent}>
                <div className={styles.imageWrapper}>
                    <Image className={styles.profilePicture} image={profileImage} width={240}/>
                </div>
                <div className={styles.header}>
                    <h1>{`${profile.firstname} ${profile.lastname}`}</h1>
                    <p className={styles.studyProgramme}>{studyProgramme.name} {`(${studyProgramme.code})`}</p>
                    <div className={styles.committeesWrapper}>
                        {committees.map(committee => <div className={styles.committee}><p>{committee.name}</p></div>)} {/* TODO change to your own committee title instead of committee name*/}
                    </div>
                    <hr/>
                    <p className={styles.orderText}>{profile.sex == "FEMALE" ? "Syster" : "Broder"} uudaf {order}´dis orden i Sanctus Omega Broderskab</p>
                </div>
                <div className={styles.leftSection}>
                    <div className={styles.buttons}>
                        {me && <Link href={`/users/${username}/settings`}>
                            <BorderButton color="secondary" children={<p>Innstillinger</p>} /> 
                        </Link>}
                        {me && <Link href="/logout">
                        <BorderButton color="secondary" children={<p>Logg ut</p>} />
                    </Link>}
                    </div>
                    
                </div>
                <div className={styles.profileMain}>
                    {(profile.bio != "") &&
                        <div className={styles.bio}>
                            <h2>Bio:</h2>
                            <p>{profile.bio}</p>
                        </div>
                    }
                    <p>
                        <span className={styles.email}>E-post:</span> 
                        {profile.email}
                    </p>
                    <p>
                        <span className={styles.username}>Brukernavn:</span>
                        {profile.username}
                    </p>
                </div> 
            </div>
            
        </div>
    )
}
