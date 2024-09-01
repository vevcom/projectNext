import styles from './CmsLink.module.scss'
import CmsLinkEditor from './CmsLinkEditor'
import Link from 'next/link'
import type { CmsLink as CmsLinkT } from '@prisma/client'

type PropTypes = {
    cmsLink: CmsLinkT
}

export default function CmsLink({ cmsLink }: PropTypes) {
    return (
        <div className={styles.CmsLink}>
            <Link href={cmsLink.url} className={styles.CmsLink}>{cmsLink.text}</Link>
            <CmsLinkEditor cmsLink={cmsLink} />
        </div>
    )
}
