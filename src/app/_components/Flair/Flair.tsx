import styles from './Flair.module.scss'
import Image from '@/components/Image/Image'
import ImageUploader from '@/components/Image/ImageUploader'
import { flairAuth } from '@/services/flairs/auth'
import { updateFlairImageAction } from '@/services/flairs/actions'
import { configureAction } from '@/services/configureAction'
import { Session, type SessionMaybeUser } from '@/auth/session/Session'
import type { FlairWithImage } from '@/services/flairs/types'

type PropTypes = {
    flair: FlairWithImage,
    width?: number,
    session: SessionMaybeUser,
    disableEditor?: boolean
}

export default function Flair({ flair, width = 50, session, disableEditor = false }: PropTypes) {
    const canEdit = flairAuth.updateImage.dynamicFields({}).auth(
        session ? session : Session.empty()
    ).toJsObject()

    return (
        <div className={styles.Flair}>
            {!disableEditor && <ImageUploader
                popUpKey={`EditFlairImage${flair.id}`}
                canEdit={canEdit}
                uploadImageAction={configureAction(updateFlairImageAction, { params: { flairId: flair.id } })}
            />}
            <Image image={flair.image} width={width} />
        </div>
    )
}
