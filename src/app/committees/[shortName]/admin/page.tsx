import styles from './page.module.scss'
import getCommittee from '@/app/committees/[shortName]/getCommittee'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import { configureAction } from '@/services/configureAction'
import { updateCommitteeLogoAction } from '@/services/groups/committees/actions'
import type { PropTypes } from '@/app/committees/[shortName]/page'

export default async function ComitteeAdmin({ params }: PropTypes) {
    const committee = await getCommittee(params)
    return (
        <div className={styles.wrapper}>
            <h2>Admin</h2>
            <CmsImage
                cmsImage={committee.logoImage}
                width={300}
                updateCmsImageAction={
                    configureAction(
                        updateCommitteeLogoAction,
                        { implementationParams: { shortName: committee.shortName } }
                    )
                }
            />
        </div>
    )
}
