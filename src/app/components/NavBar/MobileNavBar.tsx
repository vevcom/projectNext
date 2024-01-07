import ImageLink from '@/components/Image/ImageLink'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons' 
import getNavItems from './navDef'
import styles from './MobileNavBar.module.scss'
import { Session } from 'next-auth'
import EditModeSwitch from '@/components/EditModeSwitch/EditModeSwitch'
import Menu from './Menu'

type PropTypes = {
    session: Session | null
}

function MobileNavBar({ session } : PropTypes) {
    const isLoggedIn = Boolean(session?.user)
    const applicationPeriod = true
    const isAdmin = true //temp

    const navItems = getNavItems(isLoggedIn, isAdmin, applicationPeriod)
    const itemsForNav = navItems.slice(0, 1)
    const itemsForMenu = navItems.slice(2, navItems.length - 1)

    return (
        <nav className={styles.MobileNavBar}>
            {
                itemsForNav.map((item) => (
                    <div key={item.name}>
                        <Link href={item.href}>
                            <ImageLink name={item.name} width={25}/>
                        </Link>
                    </div>
                ))
            }
            <div>
                <Link href="/">
                    <ImageLink name="logo_simple" width={30}/>
                </Link>
            </div>
            <div>
                {
                    isLoggedIn ?
                        <Link href={'/user/profile/me'}>
                            <ImageLink width={25} name="magisk_hatt" className={styles.magiskHatt} alt="profile button"/>
                        </Link> :
                        <Link href="/login">
                            <ImageLink width={25} name="magisk_hatt" className={styles.magiskHatt} alt="log in button"/>
                        </Link>
                }
            </div>
            <Menu items={itemsForMenu} openBtnContent={
                <div className={styles.menuBtn}>
                    <FontAwesomeIcon icon={faBars}/>
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
