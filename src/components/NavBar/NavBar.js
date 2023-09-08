import Image from "next/image"

import Item from "./Item"
import DropDown from "./DropDown"
import Link from "next/link"
import magiskHatt from "@/images/magisk_hatt.png"
import simpleLogo from "@/images/logo_simple.png"

import styles from "./NavBar.module.scss"
import {
    faNewspaper,
    faPoo,
    faShoppingCart,
    faComment,
    faQuestionCircle,
    faCamera,
    faChartBar,
    faList,
    faUser,
    faU,
} from "@fortawesome/free-solid-svg-icons"

function NavBar() {
    const isLoggedIn = true
    const applicationPeriod = true

    const username = "johanhst"
    const order = 103

    return (
        <nav className={styles.NavBar}>
            <ul>
                <li>
                    <Link href="/frontpage">
                        <Image 
                            src={simpleLogo}
                            width={30}
                            alt="omega logo"
                        />
                    </Link>
                </li>
                {isLoggedIn && <Item href="/events" name="hvad der hender"/>}
                <Item href="/news" name="Artikler"/> 
                {!isLoggedIn && <Item href="/ombul" name="OmBul"/>}
                <Item href="/infopages/about" name="Om Omega"/> 
                <Item href="/infopages/interessegrupper" name="Interessegrupper"/> 
                <Item href="/infopages/committees" name="Komitéer"/> 
                {!isLoggedIn && 
                <>
                    <Item href="/infopages/contactor" name="For bedrifter"/> 
                    <Item href="/infopages/nystudent" name="Ny Student?"/> 
                </>}
                {isLoggedIn && 
                <>
                    <Item href="/infopages/jobbannonser" name="Jobbannonser"/> 
                    <DropDown name="OmBul" items={[
                        {
                            name: "Utgivelser",
                            href: "/ombul",
                            icon: faNewspaper,
                        },
                        {
                            name: "Bulshit",
                            href: "/bulshit",
                            icon: faPoo,
                        },
                    ]} />
                    <DropDown name="Omegating" items={[
                        {
                            name: "Omegashop",
                            href: "/money/shop",
                            icon: faShoppingCart,
                        },
                        {
                            name: "Omegaquotes",
                            href: "/omegaquotes",
                            icon: faComment,
                        },
                        {
                            name: "Guider",
                            href: "infopages/guides",
                            icon: faQuestionCircle,
                        },
                        {  
                            name: "Bilder",
                            href: "/images",
                            icon: faCamera,
                        },
                        /*{   //what happend to polls :(
                            name: "Polls",
                            href: "/",
                            icon: faChartBar,
                        },*/
                        {  
                            name: "Klasselister",
                            href: "/userlist",
                            icon: faList,
                        },
                        {
                            name: "Komité-<br />medlemmer",
                            href: "/committees",
                            icon: faUser,
                        },
                    ]}/>
                    {applicationPeriod && 
                    <Item href="/applications" name="Søknader"/> 
                    }
                </>
                }
                <li className={styles.magicHat}>
                    <Link href={isLoggedIn ? `/user/profile/${username}${order}` : "/user/login"}>
                        <Image src={magiskHatt} width={20} alt="log in button"/>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar