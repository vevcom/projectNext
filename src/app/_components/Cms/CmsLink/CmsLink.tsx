import styles from './CmsLink.module.scss'
import CmsLinkEditor from './CmsLinkEditor'
import Link from 'next/link'
import type { CmsLink as CmsLinkT } from '@prisma/client'

type PropTypes = {
    cmsLink: CmsLinkT
    className?: string
    color?: 'primary' | 'secondary'
}

export default function CmsLink({ cmsLink, className, color = 'secondary' }: PropTypes) {
    return (
        <div className={`${styles.CmsLink} ${className}`}>
            <Link href={cmsLink.url} className={`${styles.CmsLink} ${styles[color]}`}>{cmsLink.text}</Link>
            <CmsLinkEditor cmsLink={cmsLink} />
        </div>
    )
}
