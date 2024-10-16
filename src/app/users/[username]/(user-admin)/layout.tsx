import { notFound } from "next/navigation"
import { PropTypes } from "./getProfileForAdmin"
import { Session } from "@/auth/Session"
import { readUserProfileAction } from "@/actions/users/read"
import { unwrapActionReturn } from "@/app/redirectToErrorPage"
import styles from './layout.module.scss'
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDot, faCog, faKey, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { ReactNode } from "react"

export default async function UserAdmin({ children, params }: PropTypes & { children: ReactNode }) {
    const session = await Session.fromNextAuth()
    let username = params.username
    if (username === 'me') {
        if (!session.user) return notFound()
        username = session.user.username
    }
    const { user } = unwrapActionReturn(await readUserProfileAction(username))
    return (
        <div className={styles.userAdminLayout}>
            <h1>{user.firstname} {user.lastname} Admin</h1>
            {children}
            <aside>
                <Link href={`/users/${username}/dots`}>
                    <FontAwesomeIcon icon={faCircleDot} />
                </Link>
                <Link href={`/users/${username}/notifications`}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Link>
                <Link href={`/users/${username}/permissions`}>
                    <FontAwesomeIcon icon={faKey} />
                </Link>
                <Link href={`/users/${username}/settings`}>
                    <FontAwesomeIcon icon={faCog} />
                </Link>
            </aside>
        </div>
    )
}
