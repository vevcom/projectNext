import styles from './CmsLink.module.scss'
import CmsLinkEditor from './CmsLinkEditor'
import Link from 'next/link'
import { CmsLinkCollapsed } from '@/services/cms/links/Types'

type PropTypes = {
    cmsLink: CmsLinkCollapsed
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
