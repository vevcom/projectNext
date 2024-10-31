import styles from './Badge.module.scss'
import type { Badge } from '@prisma/client'
import CmsImageClient from '@/cms/CmsImage/CmsImageClient'
import CmsImage from '@/cms/CmsImage/CmsImage'
import type { ExpandedBadge } from '@/services/users/badges/Types'



type PropTypes = {
    badge: ExpandedBadge,
    asClient : Boolean
}


export default function Badge({ badge, asClient = false}: PropTypes) {
    return (
        <div className={styles.Badge}>
            {
                asClient ? (
                    <CmsImageClient
                        className={styles.cmsImage}
                        classNameImage={styles.image}
                        cmsImage={badge.cmsImage}
                        width={200}
                    />
                ) : <CmsImage
                    className={styles.cmsImage}
                    classNameImage={styles.image}
                    cmsImage={badge.cmsImage}
                    width={200}
                />
            }
            <div className={styles.text}>
                <h2 className={styles.name}>
                    {badge.name}
                </h2>
                <p>
                    {badge.description}
                </p>
            </div>

        </div>
    )
}
