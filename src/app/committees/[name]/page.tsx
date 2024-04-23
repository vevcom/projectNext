import styles from './page.module.scss'
import getCommitee from './getCommittee'
import { readSpecialImage } from '@/actions/images/read'
import BackdropImage from '@/app/components/BackdropImage/BackdropImage'
import Link from 'next/link'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'

export type PropTypes = {
    params: {
        name: string
    }
}

export default async function Committee({ params }: PropTypes) {
    const committee = await getCommitee(params)

    let committeeLogo = committee.logoImage.image
    if (!committeeLogo) {
        const res = await readSpecialImage('DAFAULT_COMMITTEE_LOGO')
        if (!res.success) throw new Error('Kunne ikke finne standard komitelogo')
        committeeLogo = res.data
    }

    return (
        <BackdropImage image={committeeLogo}>
            <PageWrapper title={committee.name}>
            <div className={styles.wrapper}>
                <h1></h1>
                <Link href={`/committees/${committee.name}/admin`}> Admin </Link>
            </div>
            </PageWrapper>
        </BackdropImage>
    )
}
