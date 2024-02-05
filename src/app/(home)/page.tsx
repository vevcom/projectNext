import Section from './Section'
import styles from './page.module.scss'
import InfoBubbles from './InfoBubbles'
import SocialIcons from '@/components/SocialIcons/SocialIcons'
import CmsImage from '@/app/components/Cms/CmsImage/CmsImage'
import GoogleMap from '@/components/GoogleMap/GoogleMap'
import YouTube from '@/components/YouTube/YouTube'
import { getUser } from '@/auth'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default async function Home() {
    const user = await getUser()
    return (
        <div className={styles.wrapper}>
            <div className={`${styles.part} ${styles.frontImg}`}>
                <div className={styles.frontInfo}>
                    <div>
                        <CmsImage name="frontpage_logo" width={300}/>
                        {user === null && <>
                            <Link href="login">Logg inn</Link>
                            <Link href="infopages/nystudent">Ny student</Link>
                        </>}
                        <div className={styles.socials}>
                            <SocialIcons />
                        </div>
                        <Link className={styles.scrollDown} href="#firstSection">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </Link>
                    </div>
                </div>
                <Section imagename="frontpage_1" name="Om Omega" lesMer="infopages/about" imgWidth={450} id="firstSection">
                    Sct. Omega Broderskab ble offisielt stiftet 21. november 1919 av et kull elektrostudenter
                    som må ha hatt et svært godt kameratskap og sosialt miljø. Til å begynne med var det en
                    eksklusiv klubb forbeholdt 3. og 4. årskurs, og for å bli tatt opp måtte man sende inn
                    en fyldig søknad. Dette har endret seg gjennom årene, og i dag blir medlemmene tatt
                    opp automatisk fra 1. klasse.
                </Section>
                <InfoBubbles />
                <Section right imagename="frontpage_2" name="Omega Verksted" lesMer="infopages/omegaverksted" imgWidth={550}>
                    Omega Verksted er en forening for elektronikk- og hobbyinteresserte studenter ved Norges
                    Teknisk-Naturvitenskapelige Universitet (NTNU) stiftet i 1971. Omega Verksted holder til i kjelleren i
                    det gamle elektrobygget på Gløshaugen (G 016 A). Verkstedet inneholder det meste av verktøy for små og
                    store prosjekter, i tillegg til et knippe datamaskiner samt et solid utvalg av brus og sjokolade.
                </Section>
            </div>
            <div className={`${styles.part} ${styles.omegamai}`}>
                <div className={styles.emptyPart} />
                <YouTube src="https://www.youtube.com/watch?v=I-zNLW4ILu4" />
                <Section imagename="frontpage_3" name="For bedrifter" lesMer="infopages/contactor" imgWidth={550}>
                    Altså omega er helt fantastisk for bedrifter.... tro meg 100%. Bare å ta kontakt med contactor
                    ellerno... Lorem ipsium bla lofrgin fofkewivj irjvioer firegjoireg g jfirejgergo
                    rjgijgoieg jgirejgioe geroigjkoiegoekg kogkpeogkg rgierg
                </Section>
                <Section right imagename="frontpage_4" name="Ohma Electra" lesMer="infopages/loccom" imgWidth={750}>
                    Ohma Electra er Omega sin stolthet, og hennes historie strekker seg helt tilbake til 1908.
                    Ohma er verdens første(!) fungerende vekselstrøm-lokomotiv, og har en lang historie fra både
                    gruvedrift, sabotasje under 2. verdenskrig, og som glamourmodell på utsiden av elektrobygget.
                    Det er ingen hemmelighet at Ohma er det fineste lokomotivet i hele Norge, og hvis du er heldig
                    får du kanskje bli med på en kjøretur.
                </Section>
            </div>
            <div className={`${styles.part} ${styles.taktlause}`}>
                <div className={styles.emptyPart} />
                <GoogleMap height={500} location = {{
                    lat: 37.42216,
                    lng: -122.08427,
                }}/>
            </div>
        </div>
    )
}
