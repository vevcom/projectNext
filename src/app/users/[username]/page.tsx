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
    const { user } = await getUser({
        userRequired: true,
        shouldRedirect: true,
        returnUrl: `/users/${params.username}`,
    })

    const me = params.username === 'me' || params.username === user.username
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

    const order = studyProgramme.group.memberships[0].omegaOrder.order

    const profileImage = await readSpecialImage("DEFAULT_PROFILE_IMAGE")

    return (
        <div className={styles.pageWrapper}>
            <div className={`${styles.top} ${styles.standard}`}> {/* TODO change style based on membership*/}
            </div>
            <div className={styles.profileContent}>
                <Image className={styles.profilePicture} image={profileImage} width={240}/>
                <div className={styles.header}>
                    <h1>{`${userProfile.firstname} ${userProfile.lastname}`}</h1>
                    <p>{studyProgramme.name} {`(${studyProgramme.code})`}</p>
                    <hr/>
                    <p className={styles.orderText}>{userProfile.sex == "FEMALE" ? "Syster" : "Broder"} uudaf {order}´dis orden i Sanctus Omega Broderskab</p>
                </div>
                <div className={styles.leftSection}>
                    {me && <Link href={`/users/${username}/settings`}>Innstillinger</Link>}
                    <br/>
                    {me && <Link href="/logout">Logg ut</Link>}
                </div>
                <div className={styles.profileMain}>
                    {(userProfile.bio != "") &&
                        <div className={styles.bio}>
                            <h2>Bio:</h2>
                            <p>{userProfile.bio}</p>
                        </div>
                    }
                    <p>{`E-post: '${userProfile.email}'`}</p>
                    <p>{`Brukernavn: ${userProfile.username}`}</p>
                    <ul>
                        {committees.map(committee => <li key={uuid()}>{committee.name}</li>)}
                    </ul>
                </div> 
            </div>
            
        </div>
    )
}
