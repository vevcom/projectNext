import Section from './Section'
import styles from './page.module.scss'
import InfoBubbles from './InfoBubbles'
import MazeMap from '@/components/MazeMap/MazeMap'
import SocialIcons from '@/components/SocialIcons/SocialIcons'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import YouTube from '@/components/YouTube/YouTube'
import { readSpecialCmsImageFrontpage, updateSpecialCmsImageFrontpage } from '@/services/frontpage/actions'
import { ServerSession } from '@/auth/session/ServerSession'
import { frontpageAuth } from '@/services/frontpage/auth'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default async function LoggedOutLandingPage() {
    const session = await ServerSession.fromNextAuth()
    const canEditSpecialCmsImage = frontpageAuth.updateSpecialCmsImage.dynamicFields({}).auth(
        session
    ).toJsObject()
    const canEditSpecialCmsParagraph = frontpageAuth.updateSpecialCmsParagraphContentSection.dynamicFields({}).auth(
        session
    ).toJsObject()

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.part} ${styles.frontImg}`}>
                <div className={styles.frontInfo}>
                    <div>
                        <SpecialCmsImage
                            canEdit={canEditSpecialCmsImage}
                            special="FRONTPAGE_LOGO"
                            width={300}
                            readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                            updateCmsImageAction={updateSpecialCmsImageFrontpage}
                        />

                        <Link href="login">Logg inn</Link>
                        <Link href="infopages/nystudent">Ny student</Link>
                        <Link href="/career">For bedrifter</Link>

                        <div className={styles.socials}>
                            <SocialIcons />
                        </div>
                        <Link className={styles.scrollDown} href="#firstSection">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </Link>
                    </div>
                </div>
                <Section
                    canEditSpecialCmsImage={canEditSpecialCmsImage}
                    canEditSpecialCmsParagraph={canEditSpecialCmsParagraph}
                    position="left"
                    specialCmsImage="FRONTPAGE_1"
                    specialCmsParagraph="FRONTPAGE_1"
                    readMore="/articles"
                    imgWidth={450}
                    id="firstSection"
                />

                <InfoBubbles />
                <Section
                    canEditSpecialCmsImage={canEditSpecialCmsImage}
                    canEditSpecialCmsParagraph={canEditSpecialCmsParagraph}
                    position="right"
                    specialCmsImage="FRONTPAGE_2"
                    specialCmsParagraph="FRONTPAGE_2"
                    readMore="/articles"
                    imgWidth={700}
                />

            </div>
            <div className={`${styles.part} ${styles.omegamai}`}>
                <div className={styles.emptyPart} />
                <YouTube src="https://www.youtube.com/watch?v=I-zNLW4ILu4" />
                <div className={styles.emptyPart} />
                <Section
                    canEditSpecialCmsImage={canEditSpecialCmsImage}
                    canEditSpecialCmsParagraph={canEditSpecialCmsParagraph}
                    position="left"
                    specialCmsImage="FRONTPAGE_3"
                    specialCmsParagraph="FRONTPAGE_3"
                    readMore="/career"
                    imgWidth={550}
                />
                <Section
                    canEditSpecialCmsImage={canEditSpecialCmsImage}
                    canEditSpecialCmsParagraph={canEditSpecialCmsParagraph}
                    position="right"
                    specialCmsImage="FRONTPAGE_4"
                    specialCmsParagraph="FRONTPAGE_4"
                    readMore="infopages/loccom"
                    imgWidth={750}
                />

            </div>
            <div className={`${styles.part} ${styles.taktlause}`}>
                <div className={styles.emptyPart} />
                <MazeMap height={'80vh'}/>
                <div className={styles.emptyPart} />
            </div>
        </div>
    )
}
