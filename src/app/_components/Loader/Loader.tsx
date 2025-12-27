import styles from './Loader.module.scss'
import { readSpecialCmsImageFrontpage, updateSpecialCmsImageFrontpage } from '@/services/frontpage/actions'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import { SessionMaybeUser } from '@/auth/session/Session'
import { frontpageAuth } from '@/services/frontpage/auth'

type PropTypes = {
    session: SessionMaybeUser
}

function Loader({ session }: PropTypes) {
    return (
        <div className={styles.Loader}>
            <SpecialCmsImage
                canEdit={
                    frontpageAuth.updateSpecialCmsImage.dynamicFields({}).auth(
                        session
                    ).toJsObject()
                }
                special="LOADER_IMAGE"
                width={100}
                //TODO: Probably call through other service see comments in frontpage operations
                readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                updateCmsImageAction={updateSpecialCmsImageFrontpage}
            />
        </div>
    )
}

export default Loader
