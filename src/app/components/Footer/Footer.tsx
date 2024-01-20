import styles from './Footer.module.scss'
import SocialIcons from '../SocialIcons/SocialIcons'
import CmsImage from '@/app/components/Cms/CmsImage/CmsImage'
import Link from 'next/link'

function Footer() {
    return (
        <footer className={styles.Footer}>
            <div>
                <CmsImage name="footer_logo" width={350} />
                <p>
                Linjeforeningen for Elektronisk Systemdesign
                og Innovasjon (MTELSYS) og Kybernetikk og
                Robotikk (MTTK) ved Norges Tekniske-Naturvitenskapelige Universitet (NTNU)
                </p>
                <div>
                    <CmsImage name="footer_1" width={200} >
                        <Link className={styles.pwa} href="/infopages/pwa" />
                    </CmsImage>
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
            <div className={styles.sponsors}>
                <CmsImage name="footer_2" width={170}>
                    <Link href="http://www.nordicsemi.com" target="_blank" />
                </CmsImage>
                <CmsImage name="footer_3" width={100}>
                    <Link href="http://www.kongsberg.com" target="_blank" />
                </CmsImage>
            </div>
        </footer>
    )
}

export default Footer
