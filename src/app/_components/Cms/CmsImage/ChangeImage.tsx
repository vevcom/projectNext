'use client'
import styles from './ChangeImage.module.scss'
import ChangeImageForm from './ChangeImageForm'
import Image from '@/components/Image/Image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTurnUp } from '@fortawesome/free-solid-svg-icons'
import type { Image as ImageT } from '@/prisma-generated-pn-types'
import type { UpdateCmsImageAction } from '@/cms/images/types'

type PropTypes = {
    currentImage: ImageT | null,
    selectedImage: ImageT | null,
    cmsImageId: number,
    updateCmsImageAction: UpdateCmsImageAction
}

export default function ChangeImage({
    currentImage,
    selectedImage,
    cmsImageId,
    updateCmsImageAction,
}: PropTypes) {
    // A selection only counts as "new" if it differs from the current image - or there is no
    // current image yet, in which case this is the user's first choice for this slot.
    const hasNewSelection = selectedImage !== null && selectedImage.id !== currentImage?.id
    const displayImage = selectedImage ?? currentImage

    const renderSubmitControls = () => {
        if (hasNewSelection && selectedImage) {
            return (
                <ChangeImageForm
                    cmsImageId={cmsImageId}
                    selectedImage={selectedImage}
                    updateCmsImageAction={updateCmsImageAction}
                />
            )
        }
        if (!currentImage) {
            return <p>Velg et bilde for å legge det til</p>
        }
        return null
    }

    return (
        <div className={styles.ChangeImage}>
            {
                currentImage && selectedImage && hasNewSelection ? (
                    <div className={styles.currentAndSelected}>
                        <div className={styles.imageClip}>
                            <Image width={200} image={currentImage} />
                        </div>
                        <div className={styles.imageClip}>
                            <Image width={200} image={selectedImage} />
                        </div>
                        <FontAwesomeIcon className={styles.arrow1} icon={faTurnUp} />
                        <FontAwesomeIcon className={styles.arrow2} icon={faTurnUp} />
                    </div>
                ) : (
                    <div className={`${styles.onlyCurrent} ${styles.imageClip}`}>
                        {displayImage ? <Image width={200} image={displayImage} /> : <p>Ingen bilde valgt enda</p>}
                    </div>
                )
            }
            <i>{displayImage ? `image name: ${displayImage.name}` : 'ingen bilde valgt enda'}</i>
            {renderSubmitControls()}
        </div>
    )
}

