import styles from './ImageListImage.module.scss'
import { default as ImageComponent } from '@/components/Image/Image'
import ImageSelectionButton from './ImageSelectionButton'
import type { Image } from '@prisma/client'
import PopUp from '@/app/components/PopUp/PopUp'
import ImageDisplay from './ImageDisplay'

type PropTypes = {
    image: Image
}

export default function ImageListImage({ image }: PropTypes) {
    return (
        <div className={styles.ImageListImage}>
            <ImageComponent width={200} image={image} />
            <PopUp showButtonContent={<></>}>
                <ImageDisplay startImageName={image.name} />
            </PopUp>
            <ImageSelectionButton image={image} />
        </div>
    )
}