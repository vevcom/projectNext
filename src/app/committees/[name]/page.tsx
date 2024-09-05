import styles from './page.module.scss'
import getCommitee from './getCommittee'
import { readSpecialImageAction } from '@/actions/images/read'
import BackdropImage from '@/components/BackdropImage/BackdropImage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import CommitteeImage from '@/components/CommitteeImage/CommitteeImage'
import Article from '@/components/Cms/Article/Article'
import Link from 'next/link'

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
            <CommitteeImage logoImage={committeeLogo} committeeImage={committee.committeeArticle.coverImage}>
                <div></div>
            </CommitteeImage>
            <PageWrapper title={committee.name}>
                <div className={styles.wrapper}>
                    <p>{committee.name}</p>
                    <Article article={committee.committeeArticle} hideCoverImage>
                    </Article>
                    <Link href={`/committees/${committee.shortName}/admin`}> Admin </Link>
                </div>
            </PageWrapper>
        </BackdropImage>
    )
}
