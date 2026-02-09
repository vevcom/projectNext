import styles from './not-found.module.scss'
import { readSpecialCmsImageFrontpage, updateSpecialCmsImageFrontpage } from '@/services/frontpage/actions'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import { ServerSession } from '@/auth/session/ServerSession'
import { frontpageAuth } from '@/services/frontpage/auth'

export default async function Error404() {
    const session = await ServerSession.fromNextAuth()

    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <SpecialCmsImage
                        canEdit={
                            frontpageAuth.updateSpecialCmsImage.dynamicFields({}).auth(
                                session
                            ).toJsObject()
                        }
                        special="NOT_FOUND"
                        width={60}
                        //TODO: Probably call through other service see comments in frontpage operations
                        readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                        updateCmsImageAction={updateSpecialCmsImageFrontpage}
                    />
                </div>
                <h3>404 - Page not found</h3>
            </div>
        </div>
    )
}
