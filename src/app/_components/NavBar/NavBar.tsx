import Item from './Item'
import styles from './NavBar.module.scss'
import getNavItems from './navDef'
import UserNavigation from './UserNavigation'
import ReportButton from './ReportButton'
import NavBarTitle from './NavBarTitle'
import PageTitleSetter from '@/contexts/PageTitleSetter'
import StandardImageServer from '@/components/Image/StandardImageServer'
import Link from 'next/link'
import type { Profile } from '@/services/users/types'

export type PropTypes = {
    profile: Profile | null
}

export default async function NavBar({ profile }: PropTypes) {
    const user = profile?.user ?? null
    const isLoggedIn = user !== null
    const applicationPeriod = false
    const isAdmin = user?.username === 'harambe'

    const navSize = 4
    const navItems = getNavItems(isLoggedIn, isAdmin, applicationPeriod)
    const itemsForNav = navItems.slice(0, navSize - 1)

    return (
        <nav className={styles.NavBar}>
            <ul className={styles.list}>
                <li className={styles.logoContainer}>
                    <div className={styles.logo}>
                        <div className={styles.logoWrapper}>
                            <StandardImageServer
                                standardImage="LOGO_SIMPLE"
                                width={30}
                                alt="omega logo"
                            >
                                <Link aria-label={'Go to homepage'} href="/" />
                            </StandardImageServer>
                        </div>
                    </div>
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
                    <div className={styles.magicHat}>
                        <StandardImageServer
                            standardImage="MAGISK_HATT"
                            width={25}
                            height={25}
                            alt="log in button"
                        />
                        <UserNavigation profile={profile} />
                    </div>
                </li>
            </ul>
        </nav>
    )
}
