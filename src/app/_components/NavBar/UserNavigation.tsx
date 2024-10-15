'use client'
import useClickOutsideRef from "@/hooks/useClickOutsideRef"
import { Profile } from "@/services/users/Types"
import { faCog, faDotCircle, faMoneyBill, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useState } from "react"
import styles from "./UserNavigation.module.scss"
import ProfilePicture from "../User/ProfilePicture"
import BorderButton from "../UI/BorderButton"
import useOnNavigation from "@/hooks/useOnNavigation"

type PropTypes = {
    profile: Profile | null
}

/**
 * This component either renders an empty link with a href to /login page if there is no profile
 * Else it renders a usefull component for a logged in user.
 * @param profile - The profile of the user
 * @returns 
 */
export default function UserNavigation({ profile }: PropTypes) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const ref = useClickOutsideRef(() => setIsMenuOpen(false))
    useOnNavigation(() => setIsMenuOpen(false))

    if (!profile || !profile.user) {
        return <Link className={styles.hidden} href="/login" />
    }

    if (!isMenuOpen) {
        return <button className={styles.hidden} onClick={() => setIsMenuOpen(true)} />
    }

    return (
        <div ref={ref} className={styles.UserNavigation}>
            <ProfilePicture profileImage={profile.user.image} width={180} />
            <h2>{profile.user.firstname} {profile.user.lastname}</h2>

            <Link href="/logout" className={styles.logout}>
                <BorderButton color="secondary">
                    <FontAwesomeIcon icon={faSignOut} /> <p>Logg ut</p>
                </BorderButton>
            </Link>

            <div className={styles.navs}>
                <Link href="/users/me">
                    <FontAwesomeIcon icon={faUser} />
                </Link>
                <Link href="/users/me/dots">
                    <FontAwesomeIcon icon={faDotCircle} />
                </Link>
                <Link href="/users/me/money">
                    <FontAwesomeIcon icon={faMoneyBill} />
                </Link>
                <Link href="/users/me/settings">
                    <FontAwesomeIcon icon={faCog} />
                </Link>
            </div>
        </div>
    )
}
