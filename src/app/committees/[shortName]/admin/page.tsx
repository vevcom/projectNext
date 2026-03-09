import styles from './page.module.scss'
import getCommittee from '@/app/committees/[shortName]/getCommittee'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import { configureAction } from '@/services/configureAction'
import { updateCommitteeLogoAction } from '@/services/groups/committees/actions'
import { committeeAuth } from '@/services/groups/committees/auth'
import { ServerSession } from '@/auth/session/ServerSession'
import type { PropTypes } from '@/app/committees/[shortName]/page'

export default async function ComitteeAdmin({ params }: PropTypes) {
    const committee = await getCommittee(params)

    const canEditLogo = committeeAuth.updateLogo.dynamicFields({ groupId: committee.groupId }).auth(
        await ServerSession.fromNextAuth()
    ).toJsObject()

    return (
        <div className={styles.wrapper}>
            <h2>Admin</h2>
            <CmsImage
                canEdit={canEditLogo}
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
