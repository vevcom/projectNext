import styles from './Image.module.scss'
import { resolutionForWidth } from '@/lib/images/resolutionForWidth'
import { imageSourceForResolution } from '@/lib/images/imageSource'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import type { ImageResolution } from '@/lib/images/resolutionForWidth'
import type { ExpandedImage } from '@/services/images/subservice/types'
import type { ImageProps } from 'next/image'
import type { CSSProperties } from 'react'

export type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    image: ExpandedImage,
    width: number,
    resolution?: ImageResolution,
    alt?: string,
    imageContainerClassName?: string,
    creditPlacement?: 'top' | 'bottom',
    hideCredit?: boolean,
    hideCopyRight?: boolean,
    disableLinkingToLicense?: boolean,
}

/**
 * A component to display a Image from the database
 * @param alt - (optional) the alt text of the image (will be set to image.alt if not provided)
 * @param image - the image to display
 * @param width - the width of the image - this also determines the resolution of the image to display
 * @param resolution - (optional) The resolution inferred from the width may be overrided using
 * this prop, but only do so if strictly necessary. The resolution is used to determine which image file to display.
 * @param imageContainerClassName - (optional) the class name of the
 * @param creditPlacement - (optional) the placement of the credit
 * @param hideCredit - (optional) if true, the credit will be hidden
 * @param hideCopyRight - (optional) if true, the copy right will be hidden
 * @param disableLinkingToLicense - (optional) if true, the license will not be linked rather
 * the name will be disblayed alone
 * @param props - the rest of the props to pass to the img tag
 */
export default function Image({
    alt,
    image,
    width,
    resolution = resolutionForWidth(width),
    imageContainerClassName,
    creditPlacement = 'bottom',
    hideCredit = false,
    hideCopyRight = false,
    disableLinkingToLicense = false,
    ...props
}: PropTypes) {
    const url = imageSourceForResolution(image, resolution)
    const imageWidthStyle = { '--image-width': `${width}px` } as CSSProperties

    return (
        <div style={imageWidthStyle} className={`${styles.Image} ${imageContainerClassName}`}>
            <img {...props}
                width={width}
                alt={alt || image.alt}
                src={url}
            />
            {image.credit && !hideCredit && <p className={`${styles.credit} ${styles[creditPlacement]}`}>{image.credit}</p>}
            {!hideCopyRight && image.licenseLink && (
                <div className={styles.license}>
                    {disableLinkingToLicense ? <p>{image.licenseName}</p> : (
                        <Link href={image.licenseLink} target="_blank" referrerPolicy="no-referrer">
                            {image.licenseName}
                        </Link>
                    )}
                    <FontAwesomeIcon icon={faCopyright}/>
                </div>
            )}
        </div>
    )
}

type SrcImageProps = Omit<PropTypes, 'image' | 'resolution'> & {
    src: string
}

/**
 * A component  meant to look like Image but with a src instead of an image. Only used in
 * worst case scenario, probably to render things in /public
 * @param src - the source of the image
 * @param width - the width of the image
 * @returns
 */
export function SrcImage({ src, width, ...props }: SrcImageProps) {
    const imageWidthStyle = { '--image-width': `${width}px` } as CSSProperties

    return (
        <div style={imageWidthStyle} className={styles.Image}>
            <img {...props} width={width} src={src} />
        </div>
    )
}
