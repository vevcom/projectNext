import Image from "next/image"

import Item from "./Item"
import DropDown from "./DropDown"
import Link from "next/link"
import magiskHatt from "@/images/magisk_hatt.png"
import simpleLogo from "@/images/logo_simple.png"

import styles from "./NavBar.module.scss"

function NavBar() {
    const isLoggedIn = true
    const applicationPeriod = true

    const username = "johanhst"
    const order = 103

    return (
        <nav className={styles.navBar}>
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
                            href: "/ombul"
                        },
                        {
                            name: "Bulshit",
                            href: "/bulshit"
                        },
                    ]} />
                    <DropDown name="Omegating" items={[
                        {
                            name: "Omegashop",
                            href: "/money/shop",
                        },
                        {
                            name: "Omegaquotes",
                            href: "/omegaquotes",
                        },
                        {
                            name: "Guider",
                            href: "infopages/guides",
                        },
                        {  
                            name: "Bilder",
                            href: "/images",
                        },
                        /*{   //what happend to polls :(
                            name: "Polls",
                            href: "/",
                        },*/
                        {  
                            name: "Klasselister",
                            href: "/userlist",
                        },
                        {
                            name: "Komité-<br />medlemmer",
                            href: "/committees",
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