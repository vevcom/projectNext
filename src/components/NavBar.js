import Image from "next/image"
import magiskHatt from "../images/magisk_hatt.png"

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
                    <>
                        <li class="nav-item">
                            <a class="nav-link pl-0" href="/events"><div class="link-animation">Hvad der hender</div></a>
                        </li>
                    </>   
                    }
                    <li class="nav-item">
                        <a class="nav-link" href="/news"><div class="link-animation">Artikler</div></a>
                    </li>
                    {!isLoggedIn && 
                    <>
                        <li class="nav-item">
                            <a class="nav-link pl-0" href="/ombul"><div class="link-animation">OmBul</div></a>
                        </li>
                    </>
                    }
                    <li class="nav-item">
                        <a class="nav-link" href="/infopages/about"><div class="link-animation">Om Omega</div></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/infopages/interessegrupper"><div class="link-animation">Interessegrupper</div></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/infopages/committees"><div class="link-animation">Komitéer</div></a>
                    </li>
                    {!isLoggedIn && 
                    <>
                        <li class="nav-item">
                            <a class="nav-link" href="/infopages/contactor"><div class="link-animation">For bedrifter</div></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/infopages/nystudent"><div class="link-animation">Ny Student?</div></a>
                        </li>
                    </>  
                    }
                    {isLoggedIn && 
                    <>
                        <li class="nav-item">
                            <a class="nav-link" href="/infopages/jobbannonser"><div class="link-animation">Jobbannonser</div></a>
                        </li>
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