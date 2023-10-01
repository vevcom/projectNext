import Image from 'next/image'
import Link from 'next/link'
import SocialIcons from '@/components/SocialIcons/SocialIcons'
import Section from './Section'
import styles from './page.module.scss'

import logo from '@/images/logo_white.png'
import kappemann from '@/images/kappemann.jpeg'
import ohma from '@/images/ohma.jpeg'
import ov from '@/images/ov.jpeg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import InfoBubbles from './InfoBubbles'
import PopInFacts from './PopInFacts'

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.part} ${styles.frontImg}`}>
        <div className={styles.frontInfo}>
            <div>
              <Image alt="omega logo" priority={true} src={logo} width={300}/>
              <Link href="user/login">Logg inn</Link>
              <Link href="infopages/nystudent">Ny student</Link>
              <div className={styles.socials}>
                <SocialIcons />
              </div>
              <Link className={styles.scrollDown} href="#firstSection">
                <FontAwesomeIcon icon={faAngleDown} />
              </Link>
            </div>
        </div>
        <Section img={kappemann} name="Om Omega" lesMer="infopages/about" imgWidth={450} id="firstSection">
          Sct. Omega Broderskab ble offisielt stiftet 21. november 1919 av et kull elektrostudenter 
          som må ha hatt et svært godt kameratskap og sosialt miljø. Til å begynne med var det en 
          eksklusiv klubb forbeholdt 3. og 4. årskurs, og for å bli tatt opp måtte man sende inn 
          en fyldig søknad. Dette har endret seg gjennom årene, og i dag blir medlemmene tatt 
          opp automatisk fra 1. klasse.
        </Section>
        <Section img={ohma} name="Ohma Electra" lesMer="infopages/loccom" right imgWidth={750}>
          Ohma Electra er Omega sin stolthet, og hennes historie strekker seg helt tilbake til 1908.
          Ohma er verdens første(!) fungerende vekselstrøm-lokomotiv, og har en lang historie fra både 
          gruvedrift, sabotasje under 2. verdenskrig, og som glamourmodell på utsiden av elektrobygget. 
          Det er ingen hemmelighet at Ohma er det fineste lokomotivet i hele Norge, og hvis du er 
          heldig får du kanskje bli med på en kjøretur.
        </Section>
        <Section img={ov} name="Omega Verksted" lesMer="infopages/omegaverksted" imgWidth={550}>
          Omega Verksted er en forening for elektronikk- og hobbyinteresserte studenter ved 
          Norges Teknisk-Naturvitenskapelige Universitet (NTNU) stiftet i 1971. Omega Verksted holder 
          til i kjelleren i det gamle elektrobygget på Gløshaugen (G 016 A). Verkstedet inneholder 
          det meste av verktøy for små og store prosjekter, i tillegg til et knippe 
          datamaskiner samt et solid utvalg av brus og sjokolade.
        </Section>
      </div>
      <div className={`${styles.part} ${styles.omegamai}`}>
        <div className={styles.frontInfo}>
          <PopInFacts />
        </div>
        <InfoBubbles />
      </div>
    </div>
  )
}
