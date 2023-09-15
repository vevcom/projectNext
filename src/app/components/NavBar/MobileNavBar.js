"use client"

import Image from 'next/image'
import Link from 'next/link'
import BurgerMenu from './BurgerMenu'

import magiskHatt from '@/images/magisk_hatt.png'
import simpleLogo from '@/images/logo_simple.png'

import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars,
    faNewspaper,
    faSuitcase,
    faCalendar
} from "@fortawesome/free-solid-svg-icons"

import styles from './MobileNavBar.module.scss'

function MobileNavBar() {
    const [burgerOpen, setBurgerOpen] = useState(false)

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
                    <Image src={simpleLogo} width={30} alt="omega logo"/>
                </Link>
            </div>
            <div className={styles.item}>
                {
                    isLoggedIn ? 
                    <Link href={`/user/profile/${username}${order}`}> 
                        <Image width={25} src={magiskHatt} className={styles.magiskHatt} alt="log in button"/>
                    </Link> :
                    <Link href="/user/login">
                        <Image width={25} src={magiskHatt} className={styles.magiskHatt} alt="log in button"/>
                    </Link>
                }
            </div>
            <div className={styles.item} onClick={() => setBurgerOpen(!burgerOpen)}>
                <button>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
            <div className={styles.burgerMenu}>
            {
                burgerOpen && <BurgerMenu isLoggedIn={isLoggedIn} applicationPeriod={applicationPeriod}/>
            }
            </div>
        </nav>
    )
}

export default MobileNavBar