import { default as NextImage, ImageProps } from 'next/image'
import type { Image as ImageT } from '@prisma/client'
import styles from './Image.module.scss'

export type PropTypes = Omit<ImageProps, 'src' | 'alt' | 'height'> & {
    image: ImageT,
    width: number,
    alt?: string, 
    height?: number
}

export default function Image({ alt, image, width, height, ...props } : PropTypes) {
    return (
        <div style={{ width: `${width}px` }} className={styles.Image}>
            <NextImage {...props} width={width} height={height ?? width} alt={alt || image.alt} src={`/store/images/${image.fsLocation}`} />
        </div>
    )
}
