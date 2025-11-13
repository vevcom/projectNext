import getCommitee from './getCommittee'
import Nav from './Nav'
import styles from './layout.module.scss'
import { readSpecialImageAction } from '@/services/images/actions'
import BackdropImage from '@/components/BackdropImage/BackdropImage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import CommitteeImage from '@/components/CommitteeImage/CommitteeImage'
import type { ReactNode } from 'react'

export type PropTypes = {
    params: Promise<{
        shortName: string
    }>,
    children: ReactNode
}

export default async function Committee({ params, children }: PropTypes) {
    const committee = await getCommitee(params)

    let committeeLogo = committee.logoImage.image
    if (!committeeLogo) {
        const res = await readSpecialImageAction.bind(
            null, { params: { special: 'DAFAULT_COMMITTEE_LOGO' } }
        )()
        if (!res.success) throw new Error('Kunne ikke finne standard komitelogo')
        committeeLogo = res.data
    }

    return (
        <BackdropImage image={committeeLogo}>
            <CommitteeImage shortName={committee.shortName} logoImage={committeeLogo} coverImage={committee.coverImage} />
            <PageWrapper title={committee.name}>
                <div className={styles.layout}>
                    <div className={styles.content}>
                        { children }
                    </div>
                    <aside className={styles.navContainer}>
                        <Nav shortName={(await params).shortName} />
                    </aside>
                </div>
            </PageWrapper>
        </BackdropImage>
    )
}
