import styles from './page.module.scss'
import getCommitee from './getCommittee'
import { readSpecialImageAction } from '@/actions/images/read'
import BackdropImage from '@/app/components/BackdropImage/BackdropImage'
import Link from 'next/link'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import Image from '@/app/components/Image/Image'
import CommitteeImage from '@/app/components/CommitteeImage/CommitteeImage'
import ComitteeAdmin from './admin/page'

export type PropTypes = {
    params: {
        name: string
    }
}

export default async function Committee({ params }: PropTypes) {
    const committee = await getCommitee(params)

    let committeeLogo = committee.logoImage.image
    if (!committeeLogo) {
        const res = await readSpecialImageAction('DAFAULT_COMMITTEE_LOGO')
        if (!res.success) throw new Error('Kunne ikke finne standard komitelogo')
        committeeLogo = res.data
    }

    return (
            <BackdropImage image={committeeLogo}>
                <CommitteeImage image={committeeLogo}>
                    <div></div>
                </CommitteeImage>
                    <PageWrapper title={committee.name}>
                    <div className={styles.wrapper}>
                        <p>{committee.name}</p>
                        <p>{committee.description}</p>
                        <Link href={`/committees/${committee.shortName}/admin`}> Admin </Link>
                    </div>
                    </PageWrapper>
            </BackdropImage>
    )
}
