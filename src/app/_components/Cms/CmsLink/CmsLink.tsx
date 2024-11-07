import styles from './CmsLink.module.scss'
import CmsLinkEditor from './CmsLinkEditor'
import Link from 'next/link'
import type { CmsLinkInfered } from '@/services/cms/links/Types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLink } from '@fortawesome/free-solid-svg-icons'

type PropTypes = {
    cmsLink: CmsLinkInfered
    className?: string
    color?: 'primary' | 'secondary'
}

export default function CmsLink({ cmsLink, className, color = 'secondary' }: PropTypes) {
    const isExternal = cmsLink.rawUrl && cmsLink.rawUrl.startsWith('http')

    return (
        <div className={`${styles.CmsLink} ${className}`}>
            <Link href={cmsLink.url} className={`${styles.CmsLink} ${styles[color]}`} target={isExternal ? "_blank" : undefined}>
                { 
                    isExternal && (
                        <FontAwesomeIcon className={styles.extenalLinkIcon} icon={faExternalLink} />
                    ) 
                }
                {cmsLink.text}
            </Link>
            <CmsLinkEditor cmsLink={cmsLink} />
        </div>
    )
}
