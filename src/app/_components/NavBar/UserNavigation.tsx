'use client'
import styles from './UserNavigation.module.scss'
import ProfilePicture from '@/components/User/ProfilePicture'
import BorderButton from '@/UI/BorderButton'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import useOnNavigation from '@/hooks/useOnNavigation'
import UserDisplayName from '@/components/User/UserDisplayName'
import { faCog, faMoneyBill, faQrcode, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useState } from 'react'
import type { Profile } from '@/services/users/Types'

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
        return <button className={styles.hidden} onClick={() => setIsMenuOpen(!isMenuOpen)} />
    }

    return (
        <div ref={ref} className={styles.UserNavigation}>
            <ProfilePicture profileImage={profile.user.image} width={180} />
            <h2><UserDisplayName user={profile.user} /></h2>

            <Link href="/logout" className={styles.logout}>
                <BorderButton color="secondary">
                    <FontAwesomeIcon icon={faSignOut} /> <p>Logg ut</p>
                </BorderButton>
            </Link>

            <div className={styles.navs}>
                <Link href="/users/me">
                    <FontAwesomeIcon icon={faUser} />
                    <p>Profil</p>
                </Link>
                <Link href="/users/me/omegaid">
                    <FontAwesomeIcon icon={faQrcode} />
                    <p>OmegaId</p>
                </Link>
                <Link href="/users/me/money">
                    <FontAwesomeIcon icon={faMoneyBill} />
                    <p>Konto</p>
                </Link>
                <Link href="/users/me/settings">
                    <FontAwesomeIcon icon={faCog} />
                    <p>Instillinger</p>
                </Link>
            </div>
        </div>
    )
}
