import Image from 'next/image'
import Link from 'next/link'
import SocialIcons from '../SocialIcons/SocialIcons'

import styles from './Footer.module.scss'

import addToHomeScreen from '@/images/add_to_home_screen.png'
import logo from '@/images/omega_logo_white.png'
import nordic from '@/images/nordic.png'

function Footer() {
    return (
        <footer className={styles.Footer}>
            <div>
                <Image src={logo} width={350} alt="sct. omega broderskab" />
                <p>
                Linjeforeningen for Elektronisk Systemdesign og Innovasjon (MTELSYS) og Kybernetikk og 
                Robotikk (MTTK) ved Norges Tekniske-Naturvitenskapelige Universitet (NTNU)
                </p>
                <div>
                    <Link className={styles.pwa} href="/infopages/pwa">
                        <Image src={addToHomeScreen} width={200} alt="add to homescreen" />
                    </Link>
                    <div className={styles.icons}>
                        <SocialIcons />
                    </div>
                </div>
            </div>
            <div className={styles.info}>
                <p>Kontakt:</p>
                <p>Bedrift: <a href="mailto:post@contactor.no">post@contactor.no</a></p>
                <p>Teknisk: <a href="mailto:vevcom@omega.ntnu.no">vevcom@omega.ntnu.no</a></p>
                <p>PR: <a href="mailto:blaest@omega.ntnu.no">blaest@omega.ntnu.no</a></p>
                <p>Annet: <a href="mailto:hs@omega.ntnu.no">hs@omega.ntnu.no</a></p>
                <p>Tlf: <a href="tel:73594211">73 59 42 11</a></p>
            </div>
            <div className={styles.info}>
                <p>Adresse:</p>
                <p>Sct.Omega Broderskab</p>
                <p>NTNU Gløshaugen</p>
                <p>Elektro-bygget</p>
                <p>7491 Trondheim</p>
            </div>
            <div className={styles.nordic}>
                <Link href="http://www.nordicsemi.com" target="_blank">
                    <Image src={nordic} width={170} alt="nordic logo"/>
                </Link>
            </div>
        </footer>
    )
}

export default Footer