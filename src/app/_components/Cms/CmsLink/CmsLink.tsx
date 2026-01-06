import styles from './CmsLink.module.scss'
import CmsLinkEditor from './CmsLinkEditor'
import Link from 'next/link'
import type { CmsLink as CmsLinkT } from '@prisma/client'
import type { UpdateCmsLinkAction } from '@/cms/links/types'

type PropTypes = {
    cmsLink: CmsLinkT
    className?: string
    color?: 'primary' | 'secondary'
    updateCmsLinkAction: UpdateCmsLinkAction
}

export default function CmsLink({ cmsLink, className, color = 'secondary', updateCmsLinkAction }: PropTypes) {
    return (
        <div className={`${styles.CmsLink} ${className}`}>
            <Link href={cmsLink.url} className={`${styles.CmsLink} ${styles[color]}`}>{cmsLink.text}</Link>
            <CmsLinkEditor cmsLink={cmsLink} updateCmsLinkAction={updateCmsLinkAction} />
        </div>
    )
}
