import styles from './Image.module.scss'
import type { ImageProps } from 'next/image'
import type { ImageSize, Image as ImageT } from '@prisma/client'

export type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    image: ImageT,
    width: number,
    alt?: string
    smallSize?: boolean
} & (
    | { imageSize?: never, smallSize?: never, largeSize?: boolean }
    | { imageSize?: never, smallSize?: boolean, largeSize?: never }
    | { imageSize?: ImageSize, smallSize?: never, largeSize?: never }
);

export default function Image({ alt, image, width, smallSize, largeSize, imageSize, ...props }: PropTypes) {
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
                url = `/store/images/${image.fsLocation}`
                break
            default:
                break
        }
    } else {
        if (smallSize) url = `/store/images/${image.fsLocationSmallSize}`
        if (largeSize) url = `/store/images/${image.fsLocation}`
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
