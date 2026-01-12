import getCommitee from './getCommittee'
import Nav from './Nav'
import styles from './layout.module.scss'
import { readSpecialImageAction } from '@/services/images/actions'
import BackdropImage from '@/components/BackdropImage/BackdropImage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import CommitteeImage from '@/components/CommitteeImage/CommitteeImage'
import { committeeAuth } from '@/services/groups/committees/auth'
import { ServerSession } from '@/auth/session/ServerSession'
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

    const canEditCoverImage = committeeAuth.updateArticle.dynamicFields({ groupId: committee.groupId }).auth(
        await ServerSession.fromNextAuth()
    ).toJsObject()

    return (
        <BackdropImage image={committeeLogo}>
            <CommitteeImage
                canEditCoverImage={canEditCoverImage}
                shortName={committee.shortName}
                logoImage={committeeLogo}
                coverImage={committee.coverImage}
            />
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
