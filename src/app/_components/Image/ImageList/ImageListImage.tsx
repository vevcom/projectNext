import styles from './ImageListImage.module.scss'
import ImageSelectionButton from './ImageSelectionButton'
import { default as ImageComponent } from '@/components/Image/Image'
import type { Image } from '@prisma/client'
import SelectImageDisplay from './SelectImageDisplay'

type PropTypes = {
    image: Image
    disableEditing?: boolean
}

export default function ImageListImage({ image, disableEditing }: PropTypes) {
    return (
        <div className={styles.ImageListImage}>
            <ImageComponent smallSize width={200} image={image} />
            <SelectImageDisplay image={image} />
            <ImageSelectionButton image={image} />
        </div>
    )
}
