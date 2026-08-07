'use client'
import styles from './ChangeImage.module.scss'
import ChangeImageForm from './ChangeImageForm'
import Image from '@/components/Image/Image'
import Form from '@/components/Form/Form'
import { configureAction } from '@/services/configureAction'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTurnUp } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useEffectEvent, useState } from 'react'
import type { ImageSize, Image as ImageT } from '@/prisma-generated-pn-types'
import type { UpdateCmsImageAction } from '@/cms/images/types'

type PropTypes = {
    currentImage: ImageT | null,
    selectedImage: ImageT | null,
    cmsImageId: number,
    currentImageSize: ImageSize,
    updateCmsImageAction: UpdateCmsImageAction
}

export default function ChangeImage({
    currentImage,
    selectedImage,
    cmsImageId,
    currentImageSize,
    updateCmsImageAction,
}: PropTypes) {
    //What is the next option in quality. The image always cycles up.
    const [changeToSize, setChangeToSize] = useState<ImageSize>(currentImageSize)

    const handleChangeSize = useEffectEvent(() => {
        switch (currentImageSize) {
            case 'SMALL':
                setChangeToSize('MEDIUM')
                break
            case 'MEDIUM':
                setChangeToSize('LARGE')
                break
            case 'LARGE':
                setChangeToSize('SMALL')
                break
            default:
                setChangeToSize('MEDIUM')
                break
        }
    })

    useEffect(() => {
        handleChangeSize()
    }, [currentImageSize])

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
        return (
            <div className={styles.resolution}>
                <p>Resolution: {currentImageSize.toLowerCase()}</p>
                <Form
                    action={
                        configureAction(
                            updateCmsImageAction,
                            { params: { cmsImageId } }
                        ).bind(null, { data: { imageSize: changeToSize } })
                    }
                    submitText={`change to ${changeToSize.toLocaleLowerCase()}`}
                    refreshOnSuccess
                    submitColor="primary"
                />
            </div>
        )
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

