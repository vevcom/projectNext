import styles from './ImageListImage.module.scss'
import ImageSelectionButton from './ImageSelectionButton'
import ImageDisplay from './ImageDisplay'
import { default as ImageComponent } from '@/components/Image/Image'
import PopUp from '@/app/components/PopUp/PopUp'
import type { Image } from '@prisma/client'

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
