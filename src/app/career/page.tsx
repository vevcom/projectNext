import { Session } from '@/auth/Session'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import SpecialCmsParagraph from '@/components/Cms/CmsParagraph/SpecialCmsParagraph'
import styles from './page.module.scss'
import Link from 'next/link'
import Image from '@/components/Image/Image'
import { readSpecialImageAction } from '@/actions/images/read'

export default async function CareerLandingPage() {
    const session = await Session.fromNextAuth()
    const jobAdImageRes = await readSpecialImageAction('HOVEDBYGGNINGEN')
    const eventImageRes = await readSpecialImageAction('HOVEDBYGGNINGEN')
    const comanyImageRes = await readSpecialImageAction('HOVEDBYGGNINGEN')
    const jobAdImage = jobAdImageRes.success ? jobAdImageRes.data : null
    const eventImage = eventImageRes.success ? eventImageRes.data : null
    const companyImage = comanyImageRes.success ? comanyImageRes.data : null

    return (
        <PageWrapper title={session.user ? 'Karriere' : 'For bedrifter'}>
            <div className={styles.wrapper}>
                <SpecialCmsParagraph className={styles.info} special="CAREER_INFO" />
                <span className={styles.links}>
                    <Link href="/career/jobads">
                        { jobAdImage ? <Image 
                            imageContainerClassName={styles.linkImage} 
                            width={300} image={jobAdImage} /> : <></> }
                        <h2>Jobbanonser</h2>
                    </Link>
                    <Link href="/career/events">
                        { eventImage ? <Image 
                            imageContainerClassName={styles.linkImage} 
                            width={300} image={eventImage} /> : <></> }
                        <h2>Bedriftpresentasjoner</h2>
                    </Link>
                    <Link href="/career/companies">
                        { companyImage ? <Image 
                            imageContainerClassName={styles.linkImage} 
                            width={300} image={companyImage} /> : <></> }
                        <h2>Bedrifter</h2>
                    </Link>
                </span>
            </div>
        </PageWrapper>
    )
}
