import getNavItems from './navDef'
import styles from './MobileNavBar.module.scss'
import Menu from './Menu'
import UserNavigation from './UserNavigation'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import EditModeSwitch from '@/components/EditModeSwitch/EditModeSwitch'
import { readSpecialCmsImageFrontpage, updateSpecialCmsImageFrontpage } from '@/services/frontpage/actions'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import type { PropTypes } from './NavBar'

export default async function MobileNavBar({ profile }: PropTypes) {
    const user = profile?.user ?? null
    const isLoggedIn = user !== null
    const applicationPeriod = false //TODO
    const isAdmin = true //TODO
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
                <SpecialCmsImage
                    special="MOBILE_NAV_PRIMARY_BUTTON"
                    width={30}
                    readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                    updateCmsImageAction={updateSpecialCmsImageFrontpage}
                >
                    <Link className={styles.imagelink} href="/"/>
                </SpecialCmsImage>
            </div>
            <div className={styles.magicHat}>
                <SpecialCmsImage
                    special="MOBILE_NAV_LOGIN_BUTTON"
                    width={25}
                    height={25}
                    alt="log in button"
                    className={styles.image}
                    readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                    updateCmsImageAction={updateSpecialCmsImageFrontpage}
                />
                <UserNavigation profile={profile} />
            </div>
            <Menu
                items={itemsForMenu}
                openBtnContext={'mobile'}
            />
            <div className={styles.editMode}>
                <EditModeSwitch />
            </div>
        </nav>
    )
}
