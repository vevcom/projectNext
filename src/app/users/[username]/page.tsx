import styles from "./page.module.scss"
import prisma from '@/prisma'
import { getUser } from '@/auth/getUser'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'
import Image from "@/components/Image/Image"  
import { readSpecialImage } from "@/server/images/read"

type PropTypes = {
    params: {
        username: string
    },
}

export default async function User({ params }: PropTypes) {
    const { user, permissions, memberships } = await getUser({
        userRequired: true,
        shouldRedirect: true,
        returnUrl: `/users/${params.username}`,
    })

    const me = params.username === 'me'
    const username = me ? user.username : params.username

    // TODO REFACTOR
    const userProfile = await prisma.user.findUnique({
        where: {
            username
        },
        include: {
            memberships: {
                select: {
                    groupId: true
                }
            }
        }
    })

    if (!userProfile) {
        notFound()
    }

    console.log(userProfile)

    const groupIds = userProfile.memberships.map(group => group.groupId)
    console.log(groupIds)

    const committees = await prisma.committee.findMany({
        where: {
            id: {
                in: groupIds
            }
        }      
    })

    const studyProgramme = await prisma.studyProgramme.findFirst({
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
    })

    if (!studyProgramme) {
        throw new Error("studyProgramme not found")
    }

    console.log(studyProgramme)

    console.log(studyProgramme.group.memberships[0].omegaOrder.order)

    const order = studyProgramme.group.memberships[0].omegaOrder.order

    const profileImage = await readSpecialImage("DEFAULT_PROFILE_IMAGE")

    return (
        <div className={styles.pageWrapper}>
            <div className={`${styles.top} ${styles.standard}`}> {/* TODO change style based on membership*/}
            </div>
            <div className={styles.profileContent}>
                <div className={styles.profileHeader}>
                    <Image className={styles.profilePicture} image={profileImage} width={240}/>
                    <div className={styles.textSection}>
                        <h1>{`${userProfile.firstname} ${userProfile.lastname}`}</h1>
                        <p>{studyProgramme.name} {`(${studyProgramme.code})`}</p>
                        <hr/>
                        <p className={styles.orderText}>{userProfile.sex == "FEMALE" ? "Syster" : "Broder"} uudaf {order}´dis orden i Sanctus Omega Broderskab</p>
                    </div>
                </div>
                <p>{`E-post: '${userProfile.email}'`}</p>
                <ul>
                    {committees.map(committee => <li key={uuid()}>{committee.name}</li>)}
                </ul>
                <p>{`Bruker-ID: ${userProfile.id}`}</p>
                <h2>Tillganger:</h2>
                <ul>
                    {me && permissions.map(permission => <li key={uuid()}>{permission}</li>)}
                </ul>
                <h2>Grupper:</h2>
                <ul>
                    {me && memberships.map(membership => <li key={uuid()}>{membership.groupId}</li>)}
                </ul>
                {me && <Link href="/logout">Logg ut</Link>}
            </div>
            
        </div>
    )
}
