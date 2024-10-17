import { notFound } from "next/navigation"
import { PropTypes } from "./getProfileForAdmin"
import { Session } from "@/auth/Session"
import { readUserProfileAction } from "@/actions/users/read"
import { unwrapActionReturn } from "@/app/redirectToErrorPage"
import styles from './layout.module.scss'
import { ReactNode } from "react"
import PageWrapper from "@/app/_components/PageWrapper/PageWrapper"
import Nav from "./Nav"
import BorderButton from "@/app/_components/UI/BorderButton"
import Link from "next/link"

export default async function UserAdmin({ children, params }: PropTypes & { children: ReactNode }) {
    const session = await Session.fromNextAuth()
    let username = params.username
    if (username === 'me') {
        if (!session.user) return notFound()
        username = session.user.username
    }
    const { user } = unwrapActionReturn(await readUserProfileAction(username))
    return (
        <PageWrapper title={`${user.firstname} ${user.lastname} Admin`}>
            <Link href={`/users/${username}`} className={styles.toProfile}>
                Til Profilsiden
            </Link>
            <div className={styles.userAdminLayout}>
                <i>Bruker Id: {user.id}</i> <br />
                <i>Brukernavn: {user.username}</i>
                <main>
                    {children}
                </main>
                <Nav username={username} />
            </div>
        </PageWrapper>
    )
}
