import getNavItems from './navDef'
import styles from './MobileNavBar.module.scss'
import Menu from './Menu'
import CmsImage from '@/app/components/Cms/CmsImage/CmsImage'
import EditModeSwitch from '@/components/EditModeSwitch/EditModeSwitch'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Session } from 'next-auth'

type PropTypes = {
    session: Session | null
}

function MobileNavBar({ session } : PropTypes) {
    const isLoggedIn = Boolean(session?.user)
    const applicationPeriod = false //temp
    const isAdmin = true //temp

    const navItems = getNavItems(isLoggedIn, isAdmin, applicationPeriod)
    const itemsForNav = navItems.slice(0, 2)
    const itemsForMenu = navItems.slice(2, navItems.length)

    return (
        <nav className={styles.MobileNavBar}>
            {
                itemsForNav.map((item) => (
                    <div key={item.name}>
                        <Link href={item.href}>
                            <FontAwesomeIcon className={styles.icon} icon={item.icon} width={25}/>
                        </Link>
                    </div>
                ))
            }
            <div>
                <CmsImage name="logo_simple" width={30}>
                    <Link className={styles.imagelink} href="/"/>
                </CmsImage>
            </div>
            <div className={styles.magicHat}>
                <CmsImage name="magisk_hatt" width={25} height={25} alt="log in button">
                    <Link className={styles.imagelink} href={isLoggedIn ? '/users/me' : '/login'} />
                </CmsImage>
            </div>
            <Menu items={itemsForMenu} openBtnContent={
                <div className={styles.menuBtn}>
                    <FontAwesomeIcon className={styles.icon} icon={faBars}/>
                </div>
            }/>
            <div className={styles.editMode}>
                {
                    isAdmin && <EditModeSwitch />
                }
            </div>
        </nav>
    )
}

export default MobileNavBar
