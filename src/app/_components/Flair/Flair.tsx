import CmsImage from '@/cms/CmsImage/CmsImage'
import { flairAuth } from '@/services/flairs/auth'
import { updateFlairCmsImageAction } from '@/services/flairs/actions'
import { configureAction } from '@/services/configureAction'
import CmsImageClient from '@/cms/CmsImage/CmsImageClient'
import { Session, type SessionMaybeUser } from '@/auth/session/Session'
import type { FlairWithImage } from '@/services/flairs/types'

type PropTypes = {
    flair: FlairWithImage,
    width?: number,
    asClient: boolean,
} & (
        {
            session: SessionMaybeUser,
            disableEditor?: false
        } | {
            session?: SessionMaybeUser,
            disableEditor: true,
        }
    )

/**
 * WARNING: May only be used server-side as it uses <CmsImage /> which is server-only.
 */
export default function Flair({ flair, width = 50, session, asClient, disableEditor }: PropTypes) {
    const maybeSession = session ? session : Session.empty()
    if (asClient) {
        return <CmsImageClient
            disableEditor={disableEditor}
            cmsImage={flair.cmsImage}
            width={width}
            canEdit={flairAuth.updateCmsImage.dynamicFields({}).auth(maybeSession).toJsObject()}
            updateCmsImageAction={
                configureAction(
                    updateFlairCmsImageAction,
                    { implementationParams: { flairId: flair.id } }
                )
            }
        />
    }
    return (
        <CmsImage
            disableEditor={disableEditor}
            cmsImage={flair.cmsImage}
            width={width}
            canEdit={flairAuth.updateCmsImage.dynamicFields({}).auth(maybeSession).toJsObject()}
            updateCmsImageAction={
                configureAction(
                    updateFlairCmsImageAction,
                    { implementationParams: { flairId: flair.id } }
                )
            }
        />
    )
}
