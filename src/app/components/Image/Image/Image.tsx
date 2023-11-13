import prisma from '@/prisma'
import { default as NextImage, ImageProps } from 'next/image'
import styles from './Image.module.scss'
import PopUp from '../../Popup/Popup'
import ImageEditor from '../ImageEditor/ImageEditor'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    name: string,
    width: number,
    alt?: string
    showEditOption?: boolean,
}

export default async function Image({ alt, name, showEditOption, ...props } : PropTypes) {
    showEditOption = showEditOption ?? true

    const image = await prisma.image.findUnique({
        where: { name }
    })

    const imagesrc = await import('./../../../../store/images/default_image.jpeg')
    if (image) {
        try {
            const imagesrc = await import(`./../../../../store/images/${image?.fsLocation}`)
        } catch (e) {
            return <div>Error</div>
        }
    }
    return (
        <div className={styles.Image}>
            <NextImage alt={alt ?? image.alt} src={imagesrc} {...props} />
            { showEditOption && (
                <PopUp showButtonIcon={faEdit}>
                    <ImageEditor image={image}/>
                </PopUp>
            )
            }
        </div>
    )
}
