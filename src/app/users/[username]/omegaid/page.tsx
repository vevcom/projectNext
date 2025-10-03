'use server'
import { Session } from '@/auth/Session'
import { forbidden, notFound, redirect } from 'next/navigation'
import type { PropTypes } from '@/app/users/[username]/page'
import OmegaId from '@/components/OmegaId/identification/OmegaId'
import styles from './page.module.scss'


export default async function OmegaIdPage({ params }: PropTypes) {
    const session = await Session.fromNextAuth()
    let username = (await params).username

    if (!session.user) return notFound()

    if (username === 'me') {
        redirect(`/users/${session.user.username}/omegaid`)
    }

    if (username !== session.user.username) {
        forbidden();
    }

    return <div className={styles.wrapper}>
        <OmegaId />
    </div>
}
