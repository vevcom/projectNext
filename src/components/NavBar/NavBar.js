import Image from "next/image"
import magiskHatt from "../../images/magisk_hatt.png"
import Item from "./Item"

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
                    {isLoggedIn && 
                        <Item href="/events" name="hvad der hender" pl0/> 
                    }
                    <Item href="/news" name="Artikler"/> 
                    {!isLoggedIn && 
                        <Item href="/ombul" name="OmBul" pl0/> 
                    }
                    <Item href="/infopages/about" name="Om Omega"/> 
                    <Item href="/infopages/interessegrupper" name="Interessegrupper"/> 
                    <Item href="/infopages/committees" name="Komitéer"/> 
                    {!isLoggedIn && 
                    <>
                        <Item href="/infopages/contactor" name="For bedrifter"/> 
                        <Item href="/infopages/nystudent" name="Ny Student?"/> 
                    </>
                    }
                    {isLoggedIn && 
                    <>
                        <Item href="/infopages/jobbannonser" name="Jobbannonser"/> 

                        <li class="nav-item dropdown">
                            <a class="nav-link" href="#" data-bypass="1" id="nav-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div>OmBul<i class="fas fa-caret-down ml-2"></i></div>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="nav-dropdown">
                                <div class="row no-gutters">
                                    <div class="col">
                                        <a class="dropdown-item dropdown-icon d-flex justify-content-center" href="/ombul">
                                            <div class="align-self-center text-center">
                                                <i class="fas fa-newspaper fa-2x"></i>
                                                <h2 class="mt-1">Utgivelser</h2>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col">
                                        <a class="dropdown-item dropdown-icon d-flex justify-content-center" href="/bulshit">
                                            <div class="align-self-center text-center">
                                                <i class="fas fa-poo fa-2x"></i>
                                                <h2 class="mt-1">Bulshit</h2>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" href="#" data-bypass="1" id="nav-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div>Omegating<i class="fas fa-caret-down ml-2"></i></div>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="nav-dropdown">
                                <div class="row no-gutters">
                                    <div class="col">
                                        <a class="dropdown-item dropdown-icon d-flex justify-content-center" href="/money/shop">
                                            <div class="align-self-center text-center">
                                                <i class="fas fa-shopping-cart fa-2x"></i>
                                                <h2 class="mt-1">Omegashop</h2>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col">
                                        <a class="dropdown-item dropdown-icon d-flex justify-content-center" href="/omegaquotes">
                                            <div class="align-self-center text-center">
                                                <i class="fas fa-comment fa-2x"></i>
                                                <h2 class="mt-1">Omegaquotes</h2>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col">
                                        <a class="dropdown-item dropdown-icon d-flex justify-content-center" href="infopages/guides">
                                            <div class="align-self-center text-center">
                                                <i class="fas fa-question-circle fa-2x"></i>
                                                <h2 class="mt-1">Guider</h2>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div class="row no-gutters">
                                    <div class="col">
                                        <a class="dropdown-item dropdown-icon d-flex justify-content-center" href="/images">
                                            <div class="align-self-center text-center">
                                                <i class="fas fa-camera fa-2x"></i>
                                                <h2 class="mt-1">Bilder</h2>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col">
                                        <div class="dropdown-item dropdown-icon d-flex justify-content-center">
                                            <div class="align-self-center text-center c-gray-600">
                                                <i class="fas fa-chart-bar c-gray-600 fa-2x"></i>
                                                <h2 class="mt-1">Polls</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <a class="dropdown-item dropdown-icon d-flex justify-content-center" href="/userlist">
                                            <div class="align-self-center text-center">
                                                <i class="fas fa-list fa-2x"></i>
                                                <h2 class="mt-1">Klasselister</h2>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col">
                                        <a class="dropdown-item dropdown-icon d-flex justify-content-center" href="/committees">
                                            <div class="align-self-center text-center">
                                                <i class="fas fa-users fa-2x"></i>
                                                <h2 class="mt-1 mb-0">Komité-<br />medlemmer</h2>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        {applicationPeriod && 
                        <>
                            <li class="nav-item">
                                <a class="nav-link" href="/applications"><div class="link-animation">Søknader</div></a>
                            </li>
                        </>    
                        }
                    </> 
                    }
                </ul>
                <form class="form-inline ml-auto">
                    <a href={isLoggedIn ? "/user/profile/{{username}}{{order}}" : "/user/login"} className="p-0 border-0">
                        <div class=" btn-nav-profile">
                            <div class="d-flex justify-content-center h-100">
                                <div class="align-self-center">
                                    <Image
                                        src={magiskHatt}
                                        width={500}
                                        height={500}
                                    />
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