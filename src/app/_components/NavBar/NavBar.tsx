import Item from './Item'
import styles from './NavBar.module.scss'
import Menu from './Menu'
import getNavItems from './navDef'
import UserNavigation from './UserNavigation'
import ReportButton from './ReportButton'
import EditModeSwitch from '@/components/EditModeSwitch/EditModeSwitch'
import StandardImageServer from '@/components/Image/StandardImageServer'
import Link from 'next/link'
import type { Profile } from '@/services/users/types'

export type PropTypes = {
    profile: Profile | null
}

export default async function NavBar({ profile }: PropTypes) {
    const user = profile?.user ?? null
    const isLoggedIn = user !== null
    // TODO: Actual application period check
    const applicationPeriod = false
    // TODO: Actual admin/auth check
    const isAdmin = user?.username === 'harambe'

    const navSize = 4
    const navItems = getNavItems(isLoggedIn, isAdmin, applicationPeriod)
    const itemsForNav = navItems.slice(0, navSize - 1)
    const itemsForMenu = navItems.slice(navSize - 1, navItems.length)

    return (
        <nav className={styles.NavBar}>
            <ul>
                <li className={styles.logo}>
                    <StandardImageServer
                        standardImage="LOGO_SIMPLE"
                        width={30}
                        alt="omega logo"
                    >
                        <Link aria-label={'Gå til hjemmesiden'} href="/" />
                    </StandardImageServer>
                </li>
                {
                    itemsForNav.map((item) => (
                        <Item key={item.name} {...item} />
                    ))
                }
                <li>
                    <Menu
                        openBtnVariant={'desktop'}
                        items={itemsForMenu}
                    />
                </li>
                <li className={styles.rightSide}>
                    <EditModeSwitch />
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
