import ImageLink from '@/app/components/Image/link/ImageLink'
import Link from 'next/link'
import Item from './Item'
import styles from './NavBar.module.scss'
import { Session } from 'next-auth'
import EditModeSwitch from '../EditModeSwitch/EditModeSwitch'
import Menu from './Menu'
import getNavItems from './navDef'

type PropTypes = {
    session: Session | null
}

async function NavBar({ session }: PropTypes) {
    const isLoggedIn = Boolean(session?.user)

    //temporary
    const applicationPeriod = false
    const isAdmin = true

    const navSize = 4
    const navItems = getNavItems(isLoggedIn, isAdmin, applicationPeriod)
    const itemsForNav = navItems.slice(0, navSize - 1)
    const itemsForMenu = navItems.slice(navSize - 1, navItems.length)

    return (
        <nav className={styles.NavBar}>
            <ul>
                <li className={styles.logo}>
                    <ImageLink
                        name="logo_simple"
                        width={30}
                        alt="omega logo"
                    >
                        <Link href="/" />
                    </ImageLink>
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
                    {
                        isAdmin && <EditModeSwitch />
                    }
                    <div className={styles.magicHat}>
                        <ImageLink name="magisk_hatt" width={25} height={25} alt="log in button">
                            <Link href={isLoggedIn ? '/users/me' : '/login'} />
                        </ImageLink>
                    </div>
                </li>
            </ul>
        </nav>
    )
}


export default NavBar
