import getNavItems from './navDef'
import styles from './MobileNavBar.module.scss'
import Menu from './Menu'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import EditModeSwitch from '@/components/EditModeSwitch/EditModeSwitch'
import { getUser } from '@/auth/getUser'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import User from '@/app/users/[username]/page'

export default async function MobileNavBar() {
    const { user } = await getUser()
    const isLoggedIn = user !== null
    const applicationPeriod = false //temp
    const isAdmin = user?.username === 'Harambe104' // temp

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
                <SpecialCmsImage special="MOBILE_NAV_PRIMARY_BUTTON" width={30}>
                    <Link className={styles.imagelink} href="/"/>
                </SpecialCmsImage>
            </div>
            <div className={styles.magicHat}>
                <SpecialCmsImage special="MOBILE_NAV_LOGIN_BUTTON" width={25} height={25} alt="log in button">
                    <Link className={styles.imagelink} href={isLoggedIn ? `/users/${user.username}`: '/login'} />
                </SpecialCmsImage>
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
