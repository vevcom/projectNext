import styles from './Badge.module.scss'
import { Prisma } from '@prisma/client'
import type { Badge } from '@prisma/client'
import CmsImageClient from '@/cms/CmsImage/CmsImageClient'
import CmsImage from '@/cms/CmsImage/CmsImage'
import CmsParagraph from '@/cms/CmsParagraph/CmsParagraph'



type PropTypes = {
    badge: Prisma.BadgeGetPayload < {include : { cmsImage: {include: {image: true}}}}>,
    asClient : Boolean  
    title: string
}


export default function Badge({ badge, asClient = false, title}: PropTypes) {
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
                <div className={styles.name}>
                    <h2>{title || badge.name}</h2>
                </div>
            </div>
        </div>
    )
}
