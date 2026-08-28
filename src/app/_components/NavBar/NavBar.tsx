import Item from './Item'
import styles from './NavBar.module.scss'
import getNavItems from './navDef'
import UserNavigation from './UserNavigation'
import ReportButton from './ReportButton'
import NavBarTitle from './NavBarTitle'
import { hasAnyAdminAccess } from './adminNavDef'
import PageTitleSetter from '@/contexts/PageTitleSetter'
import StandardImageServer from '@/components/Image/StandardImageServer'
import ProfilePicture from '@/components/User/ProfilePicture'
import { ServerSession } from '@/auth/session/ServerSession'
import Link from 'next/link'
import type { ExpandedImage } from '@/services/images/subservice/types'

export type PropTypes = {
    username: string | null,
    profileImage: ExpandedImage | null,
}

export default async function NavBar({ username, profileImage }: PropTypes) {
    const isLoggedIn = username !== null
    const applicationPeriod = false
    const session = await ServerSession.fromNextAuth()
    const isAdmin = hasAnyAdminAccess(session)

    const navSize = 4
    const navItems = getNavItems(isLoggedIn, isAdmin, applicationPeriod)
    const itemsForNav = navItems.slice(0, navSize - 1)

    return (
        <nav className={styles.NavBar}>
            <ul className={styles.list}>
                <li className={styles.logoContainer}>
                    <Link aria-label={'Go to homepage'} href="/" className={styles.logo}>
                        <div className={styles.logoWrapper}>
                            <StandardImageServer
                                standardImage="LOGO_SIMPLE"
                                width={30}
                                alt="omega logo"
                                tint="var(--surface-base)"
                            />
                        </div>
                    </Link>
                </li>

                <PageTitleSetter title="" />
                <li className={styles.pageTitleLi}>
                    <NavBarTitle />
                </li>
                <li className={styles.grower}></li>
                {
                    itemsForNav.map((item) => (
                        <li className={styles.navItem} key={item.name}>
                            <Item key={item.name} {...item} />
                        </li>
                    ))
                }
                <li className={styles.rightSide}>
                    <ReportButton/>
                    <div className={`${styles.magicHat} ${isLoggedIn ? styles.loggedIn : styles.loggedOut}`}>
                        {
                            profileImage ? (
                                <ProfilePicture
                                    profileImage={profileImage}
                                    width={48}
                                />
                            ) : (
                                <span>Logg inn</span>
                            )
                        }
                        <UserNavigation isLoggedIn={isLoggedIn} />
                    </div>
                </li>
            </ul>
        </nav>
    )
}
