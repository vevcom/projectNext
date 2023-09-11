import Image from 'next/image'

import styles from './Footer.module.scss'

function Footer() {
  return (
    <footer class="footer">
      <div class="row no-gutters">
          <div class="col-lg-4 col-md-6 pr-md-5 px-3" id="footer-hr-vertical">
              <div class="d-block w-100 text-left mb-2">
                <img src="@STATIC(/images/omega_logo_white.png)" id="footer-omega-logo" />
              </div>
              <h3 class="text-center small text-md-left d-block">Linjeforeningen for Elektronisk Systemdesign og Innovasjon (MTELSYS) og Kybernetikk og Robotikk (MTTK) ved Norges Tekniske-Naturvitenskapelige Universitet (NTNU)</h3>
              <div class="footer-icons">
                  <div class="text-center text-md-left">
                      <a href="/infopages/pwa" class="pwa-link">
                        <img src="@STATIC(/images/add_to_home_screen.png)" />
                      </a>
                      <div>
                        <a href="https://twitter.com/OmegaVevcom" target="_blank">
                            <i class="fab fa-x-twitter fa-2x"></i>
                        </a>
                        <a href="https://www.facebook.com/SctOmegaBroderskab/" target="_blank" class="ml-1">
                            <i class="fab fa-facebook fa-2x"></i>
                        </a>
                        <a href="https://www.instagram.com/sctomega/" target="_blank" class="ml-1">
                            <i class="fab fa-instagram fa-2x"></i>
                        </a>
                      </div>
                  </div>
              </div>
          </div>
          <div class="col-lg-3 col-md-3 text-md-left text-center px-3" id="footer-hr-vertical">
              <h2 class="text-primary">Kontakt:</h2>
              <p class="mb-0">Bedrift: <a href="mailto:post@contactor.no">post@contactor.no</a></p>
              <p class="mb-0">Teknisk: <a href="mailto:vevcom@omega.ntnu.no">vevcom@omega.ntnu.no</a></p>
              <p class="mb-0">PR: <a href="mailto:blaest@omega.ntnu.no">blaest@omega.ntnu.no</a></p>
              <p class="mb-0">Annet: <a href="mailto:hs@omega.ntnu.no">hs@omega.ntnu.no</a></p>
              <p class="mb-0">Tlf: 73 59 42 11</p>
          </div>
          <div class="col-lg-3 col-md-3 text-md-left text-center px-3">
              <h2 class="text-primary">Adresse:</h2>
              <p class="mb-0">Sct.Omega Broderskab</p>
              <p class="mb-0">NTNU Gløshaugen</p>
              <p class="mb-0">Elektro-bygget</p>
              <p class="mb-0">7491 Trondheim</p>
          </div>
          <div class="col-lg-2">
              <div class="d-flex justify-content-center mt-lg-0 mt-4">
                  <a href="http://www.nordicsemi.com" target="_blank"><img src="@STATIC(/images/nordic.png)" id="img-main-sponsor"/></a>
              </div>
          </div>
      </div>
      <div id="gnome-trigger"></div>
  </footer>
  )
}

export default Footer