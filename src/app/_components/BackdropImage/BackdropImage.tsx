import styles from './BackdropImage.module.scss'
import Image from '@/components/Image/Image'
import type { ReactNode } from 'react'
import type { Image as ImageT } from '@prisma/client'

type PropTypes = {
    children: ReactNode
    image: ImageT
    grayScale?: boolean
    imageSize?: number
}
/**
 * A component that renders a backdrop image with a content div on top of it
 * @param children - The content to render on top of the image
 * @param image - The image to render as a backdrop
 * @param grayScale - Whether the image should be rendered in grayscale (true by default)
 * */
export default function BackdropImage({ children, image, grayScale = true, imageSize }: PropTypes) {
    return (
        <div className={styles.BackdropImage}>
            <div className={styles.content}>
                {children}
            </div>
            <div className={styles.image}>
                <Image
                    className={grayScale ? styles.gray : ''}
                    image={image}
                    width={imageSize ?? 400}
                />
            </div>
        </div>
    )
}
