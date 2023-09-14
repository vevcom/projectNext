import Image from 'next/image'
import Link from 'next/link'

import styles from './Footer.module.scss'

import addToHomeScreen from '@/images/add_to_home_screen.png'
import logo from '@/images/omega_logo_white.png'
import nordic from '@/images/nordic.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXTwitter,
  faFacebookSquare,
  faInstagram
} from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <footer className={styles.Footer}>
      <div className={styles.footerPart}>
        <Image src={logo} width={300} alt="sct. omega broderskab" />
        <p>
          Linjeforeningen for Elektronisk Systemdesign og Innovasjon (MTELSYS) og Kybernetikk og 
          Robotikk (MTTK) ved Norges Tekniske-Naturvitenskapelige Universitet (NTNU)
        </p>
        <div>
            <Link className={styles.pwa} href="/infopages/pwa">
              <Image src={addToHomeScreen} width={200} />
            </Link>
            <div className={styles.icons}>
              <Link href="https://twitter.com/OmegaVevcom" target="_blank">
                <FontAwesomeIcon icon={faXTwitter} />
              </Link>
              <Link href="https://www.facebook.com/SctOmegaBroderskab/" target="_blank">
                <FontAwesomeIcon icon={faFacebookSquare} />
              </Link>
              <Link href="https://www.instagram.com/sctomega/" target="_blank">
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
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
      <div className={styles.footerPart}>
          <Link href="http://www.nordicsemi.com" target="_blank">
            <Image src={nordic}/>
          </Link>
      </div>
  </footer>
  )
}

export default Footer