function BurgerMenu() {
    return (
        <div class="collapse" id="navbar-mobile-open">
        <div class="nav-hamburger">
            {{#if isLoggedIn}}
                <div class="row no-gutters">
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/money/shop" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-shopping-cart fa-2x"></i>
                                <h2 class="mt-1">Omegashop</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/omegaquotes" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-comment fa-2x"></i>
                                <h2 class="mt-1">Omegaquotes</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/bulshit" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-poo fa-2x"></i>
                                <h2 class="mt-1">Bulshit</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/ombul" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-newspaper fa-2x"></i>
                                <h2 class="mt-1 ">OmBul</h2>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="row no-gutters">
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/images" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-camera fa-2x"></i>
                                <h2 class="mt-1">Bilder</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/infopages/jobbannonser" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-briefcase fa-2x"></i>
                                <h2 class="mt-1">Jobbannonser</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <div class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-chart-bar fa-2x c-gray-600"></i>
                                <h2 class="mt-1 c-gray-600">Polls</h2>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/userlist" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-list fa-2x"></i>
                                <h2 class="mt-1">Klasselister</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/committees" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-users fa-2x"></i>
                                <h2 class="mt-1">Komitémedlemmer</h2>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="row no-gutters">
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/infopages/about" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-info-circle fa-2x"></i>
                                <h2 class="mt-1">Om Omega</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/infopages/interessegrupper" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-info-circle fa-2x"></i>
                                <h2 class="mt-1">Interessegrupper</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/infopages/committees" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-beer fa-2x"></i>
                                <h2 class="mt-1">Komitéer</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/infopages/guides" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-question-circle fa-2x"></i>
                                <h2 class="mt-1">Guider</h2>
                            </div>
                        </a>
                    </div>
                    {{#if applicationPeriod}}
                        <div class="col">
                            <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/applications" data-toggle="collapse" data-target="#navbar-mobile-open">
                                <div class="align-self-center text-center">
                                    <i class="fas fa-address-card fa-2x"></i>
                                    <h2 class="mt-1">Søknad</h2>
                                </div>
                            </a>
                        </div>
                    {{else}}
                        <div class="col">
                            <div class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" data-toggle="collapse" data-target="#navbar-mobile-open">
                                <div class="align-self-center text-center">

                                </div>
                            </div>
                        </div>
                    {{/if}}

                </div>
            {{else}}
                <div class="row no-gutters">
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/infopages/about" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-info-circle fa-2x"></i>
                                <h2 class="mt-1">Om Omega</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/infopages/committees" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-beer fa-2x"></i>
                                <h2 class="mt-1">Komitéer</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/infopages/guides" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-question-circle fa-2x"></i>
                                <h2 class="mt-1">Guider</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/ombul" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-newspaper fa-2x"></i>
                                <h2 class="mt-1">OmBul</h2>
                            </div>
                        </a>
                    </div>
                    <div class="col">
                        <a class="dropdown-item dropdown-icon d-flex justify-content-center navbar-toggler" href="/infopages/nystudent" data-toggle="collapse" data-target="#navbar-mobile-open">
                            <div class="align-self-center text-center">
                                <i class="fas fa-graduation-cap fa-2x"></i>
                                <h2 class="mt-1">Ny Student?</h2>
                            </div>
                        </a>
                    </div>
                </div>
            {{/if}}
        </div>
    </div>
    )
}

export default BurgerMenu