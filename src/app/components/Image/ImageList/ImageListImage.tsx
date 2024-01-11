import styles from './ImageListImage.module.scss'
import { default as ImageComponent } from '@/components/Image/Image'
import ImageSelectionButton from './ImageSelectionButton'
import type { Image } from '@prisma/client'
import PopUp from '@/app/components/PopUp/PopUp'
import ImageDisplay from './ImageDisplay'

type PropTypes = {
    image: Image
    disableEditing?: boolean
}

export default function ImageListImage({ image, disableEditing }: PropTypes) {
    return (
        <div className={styles.ImageListImage}>
            <ImageComponent width={200} image={image} />
            <PopUp PopUpKey={image.id} showButtonContent={<></>}>
                <ImageDisplay startImageName={image.name} disableEditing={disableEditing} />
            </PopUp>
            <ImageSelectionButton image={image} />
        </div>
    )
}
