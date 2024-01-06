import ImageLink from '@/components/Image/ImageLink'
import Link from 'next/link'
import BurgerMenu from './BurgerMenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faNewspaper,
    faSuitcase,
    faCalendar
} from '@fortawesome/free-solid-svg-icons'
import styles from './MobileNavBar.module.scss'
import { Session } from 'next-auth'
import EditModeSwitch from '@/components/EditModeSwitch/EditModeSwitch'

type PropTypes = {
    session: Session | null
}

function MobileNavBar({ session } : PropTypes) {
    const isLoggedIn = Boolean(session?.user)
    const applicationPeriod = true
    const isAdmin = true //temp

    return (
        <nav className={styles.MobileNavBar}>
            <div>
                {
                    isLoggedIn ?
                        <Link href="/events">
                            <FontAwesomeIcon icon={faCalendar} />
                        </Link> :
                        <Link href="/infopages/contactor">
                            <FontAwesomeIcon icon={faSuitcase} />
                        </Link>
                }
            </div>
            <div>
                <Link href="/news">
                    <FontAwesomeIcon icon={faNewspaper} />
                </Link>
            </div>
            <div>
                <Link href="/">
                    <ImageLink name="logo_simple" width={30}/>
                </Link>
            </div>
            <div>
                {
                    isLoggedIn ?
                        <Link href={'/user/profile/me'}>
                            <ImageLink width={25} name="magisk_hatt" className={styles.magiskHatt} alt="log in button"/>
                        </Link> :
                        <Link href="/login">
                            <ImageLink width={25} name="magisk_hatt" className={styles.magiskHatt} alt="log in button"/>
                        </Link>
                }
            </div>
            <BurgerMenu isLoggedIn={isLoggedIn} applicationPeriod={applicationPeriod}/>
            <div className={styles.editMode}>
            {
                isAdmin && <EditModeSwitch />
            }
            </div>
        </nav>
    )
}

export default MobileNavBar
