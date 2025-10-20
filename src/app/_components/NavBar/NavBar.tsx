import Item from './Item'
import styles from './NavBar.module.scss'
import Menu from './Menu'
import getNavItems from './navDef'
import UserNavigation from './UserNavigation'
import EditModeSwitch from '@/components/EditModeSwitch/EditModeSwitch'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import { readSpecialCmsImageFrontpage, updateSpecialCmsImageFrontpage } from '@/services/frontpage/actions'
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
                    <SpecialCmsImage
                        special="NAV_PRIMARY_BUTTON"
                        width={30}
                        alt="omega logo"
                        readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                        updateCmsImageAction={updateSpecialCmsImageFrontpage}
                    >
                        <Link href="/" />
                    </SpecialCmsImage>
                </li>
                {
                    itemsForNav.map((item) => (
                        <Item key={item.name} {...item} />
                    ))
                }
                <li>
                    <Menu
                        openBtnContent={<p className={styles.openMenu}>Mer</p>}
                        items={itemsForMenu}
                    />
                </li>
                <li className={styles.rightSide}>
                    <EditModeSwitch />
                    <div className={styles.magicHat}>
                        <SpecialCmsImage
                            special="NAV_LOGIN_BUTTON"
                            width={25}
                            height={25}
                            alt="log in button"
                            readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                            updateCmsImageAction={updateSpecialCmsImageFrontpage}
                        />
                        <UserNavigation profile={profile} />
                    </div>
                </li>
            </ul>
        </nav>
    )
}
