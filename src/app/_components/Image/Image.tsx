import styles from './Image.module.scss'
import type { ImageProps } from 'next/image'
import type { Image, ImageSize, Image as ImageT } from '@prisma/client'

export type ImageSizeOptions = ImageSize | 'ORIGINAL'

export type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    image: ImageT,
    width: number,
    alt?: string,
    smallSize?: boolean,
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
 * @param props - the rest of the props to pass to the img tag
 */
export default function Image({
    alt,
    image,
    width,
    smallSize,
    largeSize,
    imageSize,
    ...props
}: PropTypes) {
    let url = `/store/images/${image.fsLocationMediumSize}`
    if (imageSize) {
        switch (imageSize) {
            case 'SMALL':
                url = `/store/images/${image.fsLocationSmallSize}`
                break
            case 'MEDIUM':
                url = `/store/images/${image.fsLocationMediumSize}`
                break
            case 'LARGE':
                url = `/store/images/${image.fsLocationLargeSize}`
                break
            case 'ORIGINAL':
                url = `/store/images/${image.fsLocationOriginal}`
                break
            default:
                break
        }
    } else {
        if (smallSize) url = `/store/images/${image.fsLocationSmallSize}`
        if (largeSize) url = `/store/images/${image.fsLocationLargeSize}`
    }
    return (
        <div style={{ width: `${width}px` }} className={styles.Image}>
            <img {...props}
                width={width}
                alt={alt || image.alt}
                src={url}
            />
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
