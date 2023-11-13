import Image from '@/app/components/Image/Image/Image'
import Link from 'next/link'
import Item from './Item'
import DropDown from './Dropdown'
import styles from './NavBar.module.scss'
import {
    faNewspaper,
    faPoo,
    faShoppingCart,
    faComment,
    faQuestionCircle,
    faCamera,
    faBook,
    faList,
    faUsers,
    faCircleInfo,
    faGamepad
} from '@fortawesome/free-solid-svg-icons'
import { Session } from 'next-auth'

type PropTypes = {
    session: Session | null
}

async function NavBar({ session }: PropTypes) {
    const isLoggedIn = Boolean(session?.user)
    const applicationPeriod = false

    return (
        <nav className={styles.NavBar}>
            <ul>
                <li className={styles.logo}>
                    <Link href="/">
                        <Image
                            name="logo_simple"
                            width={30}
                            alt="omega logo"
                        />
                    </Link>
                </li>
                {isLoggedIn && <Item href="/events" name="Hvad der hender"/>}
                {!isLoggedIn && <Item href="/ombul" name="OmBul"/>}
                <Item href="/infopages/committees" name="Komitéer"/>
                {!isLoggedIn &&
                <>
                    <Item href="/infopages/contactor" name="For bedrifter"/>
                    <Item href="/infopages/nystudent" name="Ny Student?"/>
                </>}
                {isLoggedIn &&
                <>
                    <Item href="/infopages/jobbannonser" name="Jobbannonser"/>
                    {applicationPeriod &&
                        <Item href="/applications" name="Søknader"/>
                    }
                    <DropDown name="Mer" items={[
                        {
                            name: 'Om Omega',
                            href: 'ingopages/about',
                            icon: faCircleInfo,
                        },
                        {
                            name: 'Intressegrupper',
                            href: 'ingopages/interessegrupper',
                            icon: faGamepad,
                        },
                        {
                            name: 'Artikler',
                            href: 'news',
                            icon: faNewspaper
                        },
                        {
                            name: 'Ombul',
                            href: '/ombul',
                            icon: faBook,
                        },
                        {
                            name: 'Bulshit',
                            href: '/bulshit',
                            icon: faPoo,
                        },
                        {
                            name: 'Omegashop',
                            href: '/money/shop',
                            icon: faShoppingCart,
                        },
                        {
                            name: 'Omegaquotes',
                            href: '/omegaquotes',
                            icon: faComment,
                        },
                        {
                            name: 'Guider',
                            href: 'infopages/guides',
                            icon: faQuestionCircle,
                        },
                        {
                            name: 'Bilder',
                            href: '/images',
                            icon: faCamera,
                        },
                        {
                            name: 'Klasselister',
                            href: '/userlist',
                            icon: faList,
                        },
                        {
                            name: 'Komitémedlemmer',
                            href: '/committees',
                            icon: faUsers,
                        },
                    ]}/>
                </>
                }
                <li className={styles.magicHat}>
                    <Link href={isLoggedIn ? '/users/me' : '/login'}>
                        <Image name="magisk_hatt" width={25} height={25} alt="log in button"/>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}


export default NavBar
