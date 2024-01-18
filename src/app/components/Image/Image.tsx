import styles from './Image.module.scss'
import { ImageProps } from 'next/image'
import type { Image as ImageT } from '@prisma/client'

export type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    image: ImageT,
    width: number,
    alt?: string
    smallSize?: boolean
}

export default function Image({ alt, image, width,  smallSize = false, ...props} : PropTypes) {
    console.log(image)
    return (
        <div style={{ width: `${width}px` }} className={styles.Image}>
            <img {...props} 
                width={width} 
                alt={alt || image.alt} 
                src={smallSize && image.fsLocationSmallSize ? `/store/images/${image.fsLocationSmallSize}` : `/store/images/${image.fsLocation}`} 
            />
        </div>
    )
}
