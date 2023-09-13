import Image from 'next/image'
import Link from 'next/link'

import styles from './Footer.module.scss'

import addToHomeScreen from '@/images/add_to_home_screen.png'
import logo from '@/images/omega_logo_white.png'

function Footer() {
  return (
    <footer className={styles.Footer}>
      <div className={styles.footerPart}>
        <Image alt="sct. omega broderskab" src={logo} width={500}/>
        <h3>Linjeforeningen for Elektronisk Systemdesign og Innovasjon (MTELSYS) og Kybernetikk og Robotikk (MTTK) ved Norges Tekniske-Naturvitenskapelige Universitet (NTNU)</h3>
        <div class={styles.icons}>
            <Link href="/infopages/pwa">
              <Image src={addToHomeScreen} />
            </Link>
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
      <div className={styles.footerPart}>
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
  </footer>
  )
}

export default Footer