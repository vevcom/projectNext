import styles from "./page.module.scss"
import prisma from '@/prisma'
import { getUser } from '@/auth/getUser'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from "@/components/Image/Image"  
import { readSpecialImage } from "@/server/images/read"
import BorderButton from "@/app/components/UI/BorderButton"

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

    const groupIds = userProfile.memberships.map(group => group.groupId)

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

    const order = studyProgramme.group.memberships[0].omegaOrder.order

    const profileImage = await readSpecialImage("DEFAULT_PROFILE_IMAGE")

    return (
        <div className={styles.pageWrapper}>
            <div className={`${styles.top} ${styles.standard}`}> {/* TODO change style based on membership */}
            </div>
            <div className={styles.profileContent}>
                <div className={styles.imageWrapper}>
                    <Image className={styles.profilePicture} image={profileImage} width={240}/>
                </div>
                <div className={styles.header}>
                    <h1>{`${userProfile.firstname} ${userProfile.lastname}`}</h1>
                    <p className={styles.studyProgramme}>{studyProgramme.name} {`(${studyProgramme.code})`}</p>
                    <div className={styles.committeesWrapper}>
                        {committees.map(committee => <div className={styles.committee}><p>{committee.name}</p></div>)} {/* TODO change to your own committee title instead of committee name*/}
                    </div>
                    <hr/>
                    <p className={styles.orderText}>{userProfile.sex == "FEMALE" ? "Syster" : "Broder"} uudaf {order}´dis orden i Sanctus Omega Broderskab</p>
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
                    {(userProfile.bio != "") &&
                        <div className={styles.bio}>
                            <h2>Bio:</h2>
                            <p>{userProfile.bio}</p>
                        </div>
                    }
                    <p>
                        <span className={styles.email}>E-post:</span> 
                        {userProfile.email}
                    </p>
                    <p>
                        <span className={styles.username}>Brukernavn:</span>
                        {userProfile.username}
                    </p>
                </div> 
            </div>
            
        </div>
    )
}
