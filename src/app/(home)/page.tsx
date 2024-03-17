import Section from './Section'
import styles from './page.module.scss'
import InfoBubbles from './InfoBubbles'
import SocialIcons from '@/components/SocialIcons/SocialIcons'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import GoogleMap from '@/components/GoogleMap/GoogleMap'
import YouTube from '@/components/YouTube/YouTube'
import { getUser } from '@/auth/user'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default async function Home() {
    const { user } = await getUser()

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.part} ${styles.frontImg}`}>
                <div className={styles.frontInfo}>
                    <div>
                        <SpecialCmsImage special="FRONTPAGE_LOGO" width={300}/>
                        {!user &&
                            <>
                                <Link href="login">Logg inn</Link>
                                <Link href="infopages/nystudent">Ny student</Link>
                            </>
                        }
                        <div className={styles.socials}>
                            <SocialIcons />
                        </div>
                        <Link className={styles.scrollDown} href="#firstSection">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </Link>
                    </div>
                </div>
                <Section
                    specialCmsImage="FRONTPAGE_1"
                    specialCmsParagraph="FRONTPAGE_1"
                    lesMer="/articles"
                    imgWidth={450}
                    id="firstSection"
                />

                <InfoBubbles />
                <Section
                    right
                    specialCmsImage="FRONTPAGE_2"
                    specialCmsParagraph="FRONTPAGE_2"
                    lesMer="/articles"
                    imgWidth={700}
                />

            </div>
            <div className={`${styles.part} ${styles.omegamai}`}>
                <div className={styles.emptyPart} />
                <YouTube src="https://www.youtube.com/watch?v=I-zNLW4ILu4" />
                <Section
                    specialCmsImage="FRONTPAGE_3"
                    specialCmsParagraph="FRONTPAGE_3"
                    lesMer="/jobads"
                    imgWidth={550}
                />
                <Section
                    right
                    specialCmsImage="FRONTPAGE_4"
                    specialCmsParagraph="FRONTPAGE_4"
                    lesMer="infopages/loccom"
                    imgWidth={750}
                />

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
