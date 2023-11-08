import Image from '@/components/Image/Image'
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

type PropTypes = {
    session: Session | null
}

function MobileNavBar({ session } : PropTypes) {
    const isLoggedIn = Boolean(session?.user)
    const applicationPeriod = true

    return (
        <nav className={styles.MobileNavBar}>
            <div className={styles.item}>
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
            <div className={styles.item}>
                <Link href="/news">
                    <FontAwesomeIcon icon={faNewspaper} />
                </Link>
            </div>
            <div className={styles.item}>
                <Link href="/">
                    <Image name="simple_logo" width={30}/>
                </Link>
            </div>
            <div className={styles.item}>
                {
                    isLoggedIn ?
                        <Link href={'/user/profile/me'}>
                            <Image width={25} name="magisk_hatt" className={styles.magiskHatt} alt="log in button"/>
                        </Link> :
                        <Link href="/login">
                            <Image width={25} name="magisk_hatt" className={styles.magiskHatt} alt="log in button"/>
                        </Link>
                }
            </div>
            <BurgerMenu isLoggedIn={isLoggedIn} applicationPeriod={applicationPeriod}/>
        </nav>
    )
}

export default MobileNavBar
