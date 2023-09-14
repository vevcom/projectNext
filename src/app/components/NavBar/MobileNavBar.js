import Image from 'next/image'
import Link from 'next/link'

import magiskHatt from "@/images/magisk_hatt.png"
import simpleLogo from '@/images/logo_simple.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars,
    faNewspaper,
    faSuitcase,
    faCalendar
} from "@fortawesome/free-solid-svg-icons"

import styles from './MobileNavBar.module.scss'

function MobileNavBar() {
    const isLoggedIn = true
    const applicationPeriod = true

    const username = "johanhst"
    const order = 103

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
                    <Image src={simpleLogo} width={30}/>
                </Link>
            </div>
            <div className={styles.item}>
                {
                    isLoggedIn ? 
                    <Link href={`/user/profile/${username}${order}`}> 
                        <Image width={25} src={magiskHatt} className={styles.magiskHatt}/>
                    </Link> :
                    <Link href="/user/login">
                        <Image width={25} src={magiskHatt} className={styles.magiskHatt}/>
                    </Link>
                }
            </div>
            <div className={styles.item}>
                <FontAwesomeIcon icon={faBars} />
                <button></button>
            </div>
        </nav>
    )
}

export default MobileNavBar