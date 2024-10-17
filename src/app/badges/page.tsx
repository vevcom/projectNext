import PageWrapper from "../_components/PageWrapper/PageWrapper";
import styles from './page.module.scss'
import { readAllBadgesAction } from "@/actions/users/badges/read";
import { getUser } from "@/auth/getUser";
import Badge from '@/components/Badge/Badge'
import Link from 'next/link'
import { Prisma } from "@prisma/client";


type PropTypes = {
    badge: Prisma.BadgeGetPayload < {include : { cmsImage: {include: {image: true}}}}>,
}

export default async function Badges() {
    const isBadgeAdmin = await getUser()
    const res = await readAllBadgesAction.bind(null, {})()
    if (!res.success) throw new Error(`Kunne ikke hente badges - ${res.errorCode}`)
    const badges = res.data
    return (
        <PageWrapper title="" headerItem={
            isBadgeAdmin ? (
                <Link href="/admin/badges" className={styles.adminLink}>
                    Gå til administrasjon
                </Link>
            ) : <></>
        }>
            <main className={styles.wrapper}>
                {
                    badges.length ? (
                        badges.map((badge) => (
                            <Badge
                                key={badge.id}
                                title={badge.name}
                                csImage = {badge.cmsImage} 
                            >
                            </Badge>
                        ))
                    ) : (
                        <i>
                            Ingen badges å vise
                        </i>
                    )
                }
            </main>
                
        </PageWrapper>
    )
}

