import styles from './ImageListImage.module.scss'
import ImageSelectionButton from './ImageSelectionButton'
import SelectImageDisplay from './SelectImageDisplay'
import { default as ImageComponent } from '@/components/Image/Image'
import type { Image } from '@/prisma-generated-pn-types'

type PropTypes = {
    image: Image
}

export default function ImageListImage({ image }: PropTypes) {
    return (
        <div className={styles.ImageListImage}>
            <ImageComponent hideCopyRight smallSize width={200} image={image} />
            <SelectImageDisplay image={image} />
            <ImageSelectionButton image={image} />
        </div>
    )
}
