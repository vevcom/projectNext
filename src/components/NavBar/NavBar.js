import Image from "next/image"
import magiskHatt from "../../images/magisk_hatt.png"
import Item from "./Item"
import DropDown from "./DropDown"
import Img from "../Img/Img"

function NavBar() {
    const isLoggedIn = true
    const applicationPeriod = true
    return (
        <nav class="navbar fixed-top navbar-desktop navbar-expand-sm d-none d-md-block navbar-dark bg-dark py-0">
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link pl-0" href="/frontpage">
                            <Image 
                                src="/../images/logo_simple.png"
                                width={100}
                                height={100}
                                alt=""
                            />
                        </a>
                    </li>
                    {isLoggedIn && <Item href="/events" name="hvad der hender" pl0/>}
                    <Item href="/news" name="Artikler"/> 
                    {!isLoggedIn && <Item href="/ombul" name="OmBul" pl0/>}
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
                </ul>
                <form class="form-inline ml-auto">
                    <a href={isLoggedIn ? "/user/profile/{{username}}{{order}}" : "/user/login"} className="p-0 border-0">
                        <div class=" btn-nav-profile">
                            <div class="d-flex justify-content-center h-100">
                                <div class="align-self-center">
                                    <Image src={magiskHatt} width='100%'
                                    height='100%'
                                    objectFit='contain'/>
                                </div>
                            </div>
                        </div>
                    </a>
                </form>
            </div>
        </nav>
    )
}

export default NavBar