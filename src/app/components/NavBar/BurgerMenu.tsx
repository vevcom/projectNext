import BurgerItem from './BurgerItem'
import {
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
} from "@fortawesome/free-solid-svg-icons"

import styles from './BurgerMenu.module.scss'

type PropTypes = {
    isLoggedIn: boolean,
    applicationPeriod: boolean
}

function BurgerMenu({ isLoggedIn, applicationPeriod }:PropTypes) {
    return (
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
    )
}

export default BurgerMenu