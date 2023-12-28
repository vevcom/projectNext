import { default as NextImage, ImageProps } from 'next/image'
import type { Image as ImageT } from '@prisma/client'
import styles from './Image.module.scss'

type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    image: ImageT,
    width: number,
    alt?: string
}

export default async function Image({ alt, image, width, ...props } : PropTypes) {
    return (
        <div className={styles.Image}>
            <NextImage {...props} src={`/store/images/${image.fsLocation}`} alt={alt || image.alt} width={width} height={width}/>
        </div>
    )
}
