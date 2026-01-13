'use client'
import styles from './ChangeImage.module.scss'
import ChangeImageForm from './ChangeImageForm'
import Image from '@/components/Image/Image'
import { ImageSelectionContext } from '@/contexts/ImageSelection'
import Form from '@/components/Form/Form'
import { configureAction } from '@/services/configureAction'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTurnUp } from '@fortawesome/free-solid-svg-icons'
import React, { useContext, useEffect, useEffectEvent, useState } from 'react'
import type { ImageSize, Image as ImageT } from '@prisma/client'
import type { UpdateCmsImageAction } from '@/cms/images/types'

type PropTypes = {
    currentImage: ImageT,
    cmsImageId: number,
    currentImageSize: ImageSize,
    updateCmsImageAction: UpdateCmsImageAction
}

export default function ChangeImage({ currentImage, cmsImageId, currentImageSize, updateCmsImageAction }: PropTypes) {
    const selectedContext = useContext(ImageSelectionContext)
    if (!selectedContext) throw new Error('ImageSelectionContext required to use ChangeImage')

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

    return (
        <div className={styles.ChangeImage}>
            {
                selectedContext.selectedImage && selectedContext.selectedImage.id !== currentImage.id ? (
                    <div className={styles.currentAndSelected}>
                        <div className={styles.imageClip}>
                            <Image width={200} image={currentImage} />
                        </div>
                        <div className={styles.imageClip}>
                            <Image width={200} image={selectedContext.selectedImage} />
                        </div>
                        <FontAwesomeIcon className={styles.arrow1} icon={faTurnUp} />
                        <FontAwesomeIcon className={styles.arrow2} icon={faTurnUp} />
                    </div>
                ) : (
                    <div className={`${styles.onlyCurrent} ${styles.imageClip}`}>
                        <Image width={200} image={currentImage} />
                    </div>
                )
            }
            <i>image name: {currentImage.name}</i>
            {
                selectedContext.selectedImage && selectedContext.selectedImage.id !== currentImage.id ? (
                    <ChangeImageForm cmsImageId={cmsImageId} updateCmsImageAction={updateCmsImageAction} />
                ) : (
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
                            submitColor="secondary"
                        />
                    </div>
                )
            }
        </div>
    )
}

