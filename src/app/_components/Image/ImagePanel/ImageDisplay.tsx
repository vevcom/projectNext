'use client'
import styles from './ImageDisplay.module.scss'
import { SelectString } from '@/components/UI/Select'
import Image from '@/components/Image/Image'
import useKeyPress from '@/hooks/useKeyPress'
import { faChevronRight, faChevronLeft, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import Link from 'next/link'
import type { ImageSizeOptions } from '@/components/Image/Image'
import type { Image as ImageT } from '@/prisma-generated-pn-types'

const mimeTypes: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    avif: 'image/avif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
}
const getCurrentType = (image: ImageT, size: ImageSizeOptions) => {
    let src = image.fsLocationOriginal
    switch (size) {
        case 'SMALL':
            src = image.fsLocationSmallSize
            break
        case 'MEDIUM':
            src = image.fsLocationMediumSize
            break
        case 'LARGE':
            src = image.fsLocationLargeSize
            break
        case 'ORIGINAL':
            src = image.fsLocationOriginal
            break
        default:
            return 'unknown'
    }
    const ext = src.split('.').pop()
    if (!ext) return 'unknown'
    return mimeTypes[ext]
}

type PropTypes = {
    image: ImageT,
    loading: boolean,
    onClose: () => void,
    onNavigateLeft: () => void,
    onNavigateRight: () => void,
}

/**
 * The large view of the image an ImagePanel is currently displaying. A pure viewer - navigation,
 * closing and what image to show are the panel's responsibility, and administration of the image
 * lives outside the panel system entirely.
 * @param image - the image to display
 * @param loading - whether the panel is fetching (navigating right into a not-yet-loaded page)
 * @param onClose - called when the display is closed (close button or Escape)
 * @param onNavigateLeft - called on the left arrow (button or key)
 * @param onNavigateRight - called on the right arrow (button or key)
 */
export default function ImageDisplay({ image, loading, onClose, onNavigateLeft, onNavigateRight }: PropTypes) {
    const [imageSize, setImageSize] = useState<ImageSizeOptions>('LARGE')

    useKeyPress('ArrowRight', onNavigateRight)
    useKeyPress('ArrowLeft', onNavigateLeft)
    useKeyPress('Escape', onClose)

    const handleSizeChange = (size: string) => {
        if (size === 'SMALL' || size === 'MEDIUM' || size === 'LARGE' || size === 'ORIGINAL') {
            setImageSize(size)
        }
    }

    return (
        <div className={styles.ImageDisplay}>
            <div className={styles.selectImageSize}>
                <SelectString
                    defaultValue={imageSize}
                    value={imageSize}
                    onChange={handleSizeChange}
                    name="imageSize"
                    label="Oppløsning"
                    options={[
                        {
                            label: 'Liten',
                            value: 'SMALL'
                        },
                        {
                            label: 'Middels',
                            value: 'MEDIUM'
                        },
                        {
                            label: 'Stor',
                            value: 'LARGE'
                        },
                        {
                            label: 'Original',
                            value: 'ORIGINAL'
                        }
                    ]}/>
            </div>
            <button onClick={onClose} className={styles.close}>
                <FontAwesomeIcon icon={faX}/>
            </button>
            <div className={styles.currentImage}>
                <h1>{image.name}</h1>
                <i>Alt-tekst: {image.alt}</i>
                <i>Type: {getCurrentType(image, imageSize)}</i>
                <i>Kreditert: {image.credit ?? 'ingen'}</i>
                <i>Lisens: {
                    image.licenseLink ?
                        <Link
                            href={image.licenseLink}
                            target="_blank"
                            referrerPolicy="no-referrer"
                        >
                            {image.licenseName}
                        </Link>
                        : 'ingen'
                }
                </i>
                {
                    loading ? (
                        <div className={styles.loading}></div>
                    ) : (
                        <Image
                            hideCredit
                            hideCopyRight
                            width={200}
                            imageSize={imageSize}
                            image={image}
                        />
                    )
                }
            </div>

            <div className={styles.controls}>
                <button onClick={onNavigateLeft}>
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </button>
                <button onClick={onNavigateRight}>
                    <FontAwesomeIcon icon={faChevronRight}/>
                </button>
            </div>
        </div>
    )
}
