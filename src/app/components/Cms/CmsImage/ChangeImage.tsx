'use client'
import styles from './ChangeImage.module.scss'
import Image from '../../Image/Image'
import { ImageSelectionContext } from '@/context/ImageSelection'
import Form from '@/components/Form/Form'
import update, { updateConfig } from '@/actions/cms/images/update'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTurnUp } from '@fortawesome/free-solid-svg-icons'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ImageSize, Image as ImageT } from '@prisma/client'

type PropTypes = {
    currentImage: ImageT,
    cmsImageId: number,
    currentImageSize: ImageSize,
}

export default function ChangeImage({ currentImage, cmsImageId, currentImageSize } : PropTypes) {
    const selectedContext = useContext(ImageSelectionContext)
    if (!selectedContext) throw new Error('ImageSelectionContext required to use ChangeImage')
    const { refresh } = useRouter()
    
    //What is the next option in quality. The image always cycles up.
    const [changeToSize, setChangeToSize] = useState<ImageSize>(currentImageSize)
    useEffect(() => {
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
                    <Form
                        action={update.bind(null, cmsImageId).bind(null, selectedContext.selectedImage.id)}
                        submitText="change"
                        successCallback={refresh}
                    />
                ) : (
                    <div className={styles.resolution}>
                        <p>Resolution: {currentImageSize}</p>
                        <Form 
                            action={updateConfig.bind(null, cmsImageId).bind(null, {imageSize: changeToSize})}
                            submitText={`change to ${changeToSize}`}
                            successCallback={refresh}
                            submitColor='secondary'
                        />
                    </div> 
                )
            }
        </div>
    )
}


