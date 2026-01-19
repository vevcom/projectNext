import CmsImage from '@/cms/CmsImage/CmsImage'
import { flairAuth } from '@/services/flairs/auth'
import { updateFlairCmsImageAction } from '@/services/flairs/actions'
import { configureAction } from '@/services/configureAction'
import type { FlairWithImage } from '@/services/flairs/types'
import type { SessionMaybeUser } from '@/auth/session/Session'

type PropTypes = {
    flair: FlairWithImage,
    width?: number,
    session: SessionMaybeUser,
}

/**
 * WARNING: May only be used server-side as it uses <CmsImage /> which is server-only.
 */
export default function Flair({ flair, width = 50, session }: PropTypes) {
    return (
        <CmsImage
            cmsImage={flair.cmsImage}
            width={width}
            canEdit={flairAuth.updateCmsImage.dynamicFields({ }).auth(session)}
            updateCmsImageAction={
                configureAction(
                    updateFlairCmsImageAction,
                    { implementationParams: { flairId: flair.id } }
                )
            }
        />
    )
}
