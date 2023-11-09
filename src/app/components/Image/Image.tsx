import prisma from '@/prisma'
import { default as NextImage, ImageProps } from 'next/image'
import styles from './Image.module.scss'
import PopUp from '../Popup/Popup'
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
    try {
        if (!image) throw `no image found with name: ${name}`
        const imagesrc = await import(`./../../../../store/images/${image?.fsLocation}`)
        return (
        <div className={styles.Image}>
            <NextImage alt={alt ?? image.alt} src={imagesrc} {...props} />
            { showEditOption && (
                <PopUp showButtonIcon={faEdit}>
                    <ImageEditor name={name}/>
                </PopUp>
            )
            }
        </div>
        )
    } catch (err) {
        const imagesrc = await import('./../../../../store/images/default_image.jpeg')
        return (
            <div>
                <div>Could not find image {name}</div>
                <NextImage alt="default image" src={imagesrc} {...props} />
            </div>
        )
    }
}
