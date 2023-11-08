'use client'

import BurgerItem from './BurgerItem'
import {
    faBars,
    faShoppingCart,
    faComment,
    faPoo,
    faNewspaper,
    faCamera,
    faBriefcase,
    faList,
    faUsers,
    faCircleInfo,
    faGamepad,
    faBeer,
    faQuestionCircle,
    faAddressCard,
    faGraduationCap,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './BurgerMenu.module.scss'
import { useState } from 'react'

type PropTypes = {
    isLoggedIn: boolean,
    applicationPeriod: boolean
}

function BurgerMenu({ isLoggedIn, applicationPeriod }:PropTypes) {
    const [burgerOpen, setBurgerOpen] = useState(false)

    return (
        <>
            <div className={styles.item}>
                <button onClick={() => setBurgerOpen(!burgerOpen)}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
            {burgerOpen ? (
                <div className={styles.BurgerMenu}>
                    <BurgerItem href="/ombul" name="OmBul" icon={faNewspaper}/>
                    <BurgerItem href="/infopages/about" name="Om Omega" icon={faCircleInfo}/>
                    <BurgerItem href="/infopages/committees" name="Komitéer" icon={faBeer}/>
                    <BurgerItem href="/infopages/guides" name="Guider" icon={faQuestionCircle}/>
                    {!isLoggedIn &&
                    <BurgerItem href="/infopages/nystudent" name="Ny Student?" icon={faGraduationCap}/>
                    }
                    {isLoggedIn &&
                <>
                    <BurgerItem href="/money/shop" name="Omegashop" icon={faShoppingCart}/>
                    <BurgerItem href="/omegaquotes" name="Omegaquotes" icon={faComment}/>
                    <BurgerItem href="/bulshit" name="Bulshit" icon={faPoo}/>
                    <BurgerItem href="/images" name="Bilder" icon={faCamera}/>
                    <BurgerItem href="/infopages/jobbannonser" name="Jobbannonser" icon={faBriefcase}/>
                    <BurgerItem href="/userlist" name="Klasselister" icon={faList}/>
                    <BurgerItem href="/committees" name="Komitémedlemmer" shortName="Kom.med." icon={faUsers}/>
                    <BurgerItem href="/infopages/interessegrupper" name="Interessegrupper" shortName="Interessegr." icon={faGamepad}/>
                    {applicationPeriod &&
                        <BurgerItem href="/applications" name="Søknad" icon={faAddressCard}/>
                    }
                </>
                    }
                </div>
            ) : (<div></div>)}
        </>
    )
}

export default BurgerMenu
