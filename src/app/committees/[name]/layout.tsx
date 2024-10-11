import getCommitee from './getCommittee'
import { readSpecialImageAction } from '@/actions/images/read'
import BackdropImage from '@/components/BackdropImage/BackdropImage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import CommitteeImage from '@/components/CommitteeImage/CommitteeImage'
import { ReactNode } from 'react'

export type PropTypes = {
    params: {
        name: string
    },
    children: ReactNode
}

export default async function Committee({ params, children }: PropTypes) {
    const committee = await getCommitee(params)

    let committeeLogo = committee.logoImage.image
    if (!committeeLogo) {
        const res = await readSpecialImageAction('DAFAULT_COMMITTEE_LOGO')
        if (!res.success) throw new Error('Kunne ikke finne standard komitelogo')
        committeeLogo = res.data
    }

    return (
        <BackdropImage image={committeeLogo}>
            <CommitteeImage logoImage={committeeLogo} coverImage={committee.coverImage} />
            <PageWrapper title={committee.name}>
                { children }
            </PageWrapper>
        </BackdropImage>
    )
}
