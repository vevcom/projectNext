import Image from 'next/image'
import Link from 'next/link'
import SocialIcons from './components/SocialIcons/SocialIcons'
import styles from './page.module.scss'

import logo from '@/images/logo_white.png'
import kappemann from '@/images/kappemann.jpeg'

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.frontImage}>
        <div className={styles.front}>
          <div>
            <Image loading="eager" src={logo} width={300}/>
            <Link href="user/login">Logg inn</Link>
            <Link href="infopages/nystudent">Ny student</Link>
            <div className={styles.socials}>
              <SocialIcons />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <Image src={kappemann}/>
        <h3>Om Omega</h3>
        <p>
          Sct. Omega Broderskab ble offisielt stiftet 21. november 1919 av et kull elektrostudenter 
          som må ha hatt et svært godt kameratskap og sosialt miljø. Til å begynne med var det en 
          eksklusiv klubb forbeholdt 3. og 4. årskurs, og for å bli tatt opp måtte man sende inn 
          en fyldig søknad. Dette har endret seg gjennom årene, og i dag blir medlemmene tatt 
          opp automatisk fra 1. klasse.
        </p>
        <Link href="infopages/about">Les mer</Link>
      </div>
    </div>
  )
}
