import type { CmsLink } from '@prisma/client';
import styles from './CmsLink.module.scss'
import Link from 'next/link'

type PropTypes = {
    cmsLink: CmsLink
}

export default function CmsLink({ cmsLink }: PropTypes) { 
    return (
        <Link href={cmsLink.url} className={styles.CmsLink}>{cmsLink.name}</Link>
    )
}