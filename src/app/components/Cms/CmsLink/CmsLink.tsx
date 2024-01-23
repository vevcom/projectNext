import type { CmsLink } from '@prisma/client';
import styles from './CmsLink.module.scss'

type PropTypes = {
    cmsLink: CmsLink
}

export default function CmsLink({ cmsLink }: PropTypes) { 
    return (
        <div className={styles.cmsLink}>
            <h1>CmsLink</h1>
        </div>
    );
}