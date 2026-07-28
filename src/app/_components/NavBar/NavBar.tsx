import Item from './Item'
import styles from './NavBar.module.scss'
import getNavItems from './navDef'
import UserNavigation from './UserNavigation'
import ReportButton from './ReportButton'
import NavBarTitle from './NavBarTitle'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import { readSpecialCmsImageFrontpage, updateSpecialCmsImageFrontpage } from '@/services/frontpage/actions'
import PageTitleSetter from '@/contexts/PageTitleSetter'
import Link from 'next/link'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'
import type { Profile } from '@/services/users/types'

export type PropTypes = {
    profile: Profile | null
    canEditSpecialCmsImage: AuthResultTypeAny
}

export default async function NavBar({ profile, canEditSpecialCmsImage }: PropTypes) {
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
                            <SpecialCmsImage
                                canEdit={canEditSpecialCmsImage}
                                special="NAV_PRIMARY_BUTTON"
                                width={30}
                                alt="omega logo"
                                readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                                updateCmsImageAction={updateSpecialCmsImageFrontpage}
                            >
                                <Link aria-label={'Go to homepage'} href="/" />
                            </SpecialCmsImage>
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
                        <SpecialCmsImage
                            canEdit={canEditSpecialCmsImage}
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
