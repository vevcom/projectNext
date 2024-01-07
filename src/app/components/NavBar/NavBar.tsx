import ImageLink from '@/components/Image/ImageLink'
import Link from 'next/link'
import Item from './Item'
import styles from './NavBar.module.scss'
import { Session } from 'next-auth'
import EditModeSwitch from '../EditModeSwitch/EditModeSwitch'
import Menu from './Menu'

type PropTypes = {
    session: Session | null
}

async function NavBar({ session }: PropTypes) {
    const isLoggedIn = Boolean(session?.user)
    const applicationPeriod = false
    const isAdmin = true //temp

    return (
        <nav className={styles.NavBar}>
            <ul>
                <li className={styles.logo}>
                    <Link href="/">
                        <ImageLink
                            name="logo_simple"
                            width={30}
                            alt="omega logo"
                        />
                    </Link>
                </li>
                {
                    isLoggedIn ? (
                    <>
                        <Item href="/events" name="Hvad der hender"/>
                        <Item href="/infopages/committees" name="Komitéer"/>
                        <Item href="/infopages/jobbannonser" name="Jobbannonser"/>
                        {
                        applicationPeriod &&
                            <Item href="/applications" name="Søknader"/>
                        }
                        <li>
                            <Menu 
                                openBtnContent={<p className={styles.openMenu}>Mer</p>} 
                                items={itemsForMenu}/>
                        </li>
                    </>
                    ) : (
                    <>
                        <Item href="/ombul" name="OmBul"/>
                        <Item href="/infopages/committees" name="Komitéer"/>
                        <Item href="/infopages/contactor" name="For bedrifter"/>
                        <Item href="/infopages/nystudent" name="Ny Student?"/>
                    </>
                    )
                }
                <li className={styles.rightSide}>
                    {
                        isAdmin && <EditModeSwitch />
                    }
                    <div className={styles.magicHat}>
                        <Link href={isLoggedIn ? '/users/me' : '/login'}>
                            <ImageLink name="magisk_hatt" width={25} height={25} alt="log in button"/>
                        </Link>
                    </div>
                </li>
            </ul>
        </nav>
    )
}


export default NavBar
