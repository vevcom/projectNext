import type { CmsLink } from '@prisma/client';
import styles from './CmsLink.module.scss'
import Link from 'next/link'
import CmsLinkEditor from './CmsLinkEditor';

type PropTypes = {
    cmsLink: CmsLink
}

export default function CmsLink({ cmsLink }: PropTypes) { 
    return (
        <div className={styles.CmsLink}>
            <Link href={cmsLink.url} className={styles.CmsLink}>{cmsLink.text}</Link>
            <CmsLinkEditor cmsLink={cmsLink} />
        </div>
    )
}