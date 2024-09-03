import styles from './page.module.scss'
import getCommitee from './getCommittee'
import { readSpecialImageAction } from '@/actions/images/read'
import BackdropImage from '@/components/BackdropImage/BackdropImage'
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
            <div className={styles.wrapper}>
                <h1>{committee.name}</h1>
                <Link href={`/committees/${committee.shortName}/admin`}> Admin </Link>
            </div>
        </BackdropImage>
    )
}
