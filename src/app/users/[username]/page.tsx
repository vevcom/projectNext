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
        }
    })

    if (!userProfile) {
        notFound()
    }

    const img = await readSpecialImage("DEFAULT_PROFILE_IMAGE")

    // if (!img) {
    //     throw new Error("image not found")
    // }
    console.log(img)

    console.log(userProfile)

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.profileHeader}>
                <Image image={img} width={120}/>
            </div>
            <h1>{`${userProfile.firstname} ${userProfile.lastname}`}</h1>
            <p>{`E-post: '${userProfile.email}'`}</p>
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
    )
}
