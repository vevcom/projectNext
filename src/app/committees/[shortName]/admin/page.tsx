import styles from './page.module.scss'
import getCommittee from '@/app/committees/[shortName]/getCommittee'
import Image from '@/components/Image/Image'
import ImageUploader from '@/components/Image/ImageUploader'
import { configureAction } from '@/services/configureAction'
import { updateCommitteeLogoAction } from '@/services/groups/committees/actions'
import { committeeAuth } from '@/services/groups/committees/auth'
import { ServerSession } from '@/auth/session/ServerSession'
import type { PropTypes } from '@/app/committees/[shortName]/page'

export default async function ComitteeAdmin({ params }: PropTypes) {
    const committee = await getCommittee(params)

    const canEditLogo = committeeAuth.updateLogo.dynamicFields({ groupId: committee.groupId }).auth(
        await ServerSession.fromNextAuth()
    )

    return (
        <div className={styles.wrapper}>
            <h2>Admin</h2>
            <div className={styles.logo}>
                <Image image={committee.logoImage} width={300} />
                {
                    canEditLogo.authorized && (
                        <ImageUploader
                            title="Endre komitelogo"
                            refreshOnSuccess
                            uploadImageAction={configureAction(
                                updateCommitteeLogoAction,
                                { params: { shortName: committee.shortName } }
                            )}
                        />
                    )
                }
            </div>
        </div>
    )
}
