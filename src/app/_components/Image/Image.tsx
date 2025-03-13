import styles from './Image.module.scss'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import type { Image, ImageSize, Image as ImageT } from '@prisma/client'
import type { ImageProps } from 'next/image'

export type ImageSizeOptions = ImageSize | 'ORIGINAL'

export type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    image: ImageT,
    width: number,
    alt?: string,
    smallSize?: boolean,
    imageContainerClassName?: string,
    creditPlacement?: 'top' | 'bottom',
    hideCredit?: boolean,
    hideCopyRight?: boolean,
    disableLinkingToLicense?: boolean,
} & (
    | { imageSize?: never, smallSize?: never, largeSize?: boolean }
    | { imageSize?: never, smallSize?: boolean, largeSize?: never }
    | { imageSize?: ImageSizeOptions, smallSize?: never, largeSize?: never }
);

/**
 * A component to display a Image from the database
 * @param alt - (optional) the alt text of the image (will be set to image.alt if not provided)
 * @param image - the image to display
 * @param width - the width of the image
 * @param smallSize - (optional) if true, the image will be the small size
 * @param largeSize - (optional) if true, the image will be the large size
 * @param imageSize - (optional) the size of the image
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
    smallSize,
    largeSize,
    imageSize,
    imageContainerClassName,
    creditPlacement = 'bottom',
    hideCredit = false,
    hideCopyRight = false,
    disableLinkingToLicense = false,
    ...props
}: PropTypes) {
    let url = `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/store/images/${image.fsLocationMediumSize}`
    if (imageSize) {
        switch (imageSize) {
            case 'SMALL':
                url = `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/store/images/${image.fsLocationSmallSize}`
                break
            case 'MEDIUM':
                url = `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/store/images/${image.fsLocationMediumSize}`
                break
            case 'LARGE':
                url = `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/store/images/${image.fsLocationLargeSize}`
                break
            case 'ORIGINAL':
                url = `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/store/images/${image.fsLocationOriginal}`
                break
            default:
                break
        }
    } else {
        if (smallSize) url = `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/store/images/${image.fsLocationSmallSize}`
        if (largeSize) url = `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/store/images/${image.fsLocationLargeSize}`
    }
    return (
        <div style={{ width: `${width}px` }} className={`${styles.Image} ${imageContainerClassName}`}>
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

type SrcImageProps = Omit<PropTypes, 'image' | 'imageSize' | 'smallSize' | 'largeSize'> & {
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
    return (
        <div style={{ width: `${width}px` }} className={styles.Image}>
            <img {...props} width={width} src={src} />
        </div>
    )
}
