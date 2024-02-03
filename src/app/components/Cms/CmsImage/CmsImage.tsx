import CmsImageEditor from './CmsImageEditor'
import styles from './CmsImage.module.scss'
import Image from '@/components/Image/Image'
import read from '@/cms/images/read'
import readImage from '@/actions/images/read'
import React from 'react'
import type { PropTypes as ImagePropTypes } from '@/components/Image/Image'
import type { Image as ImageT } from '@prisma/client'

export type PropTypes = Omit<ImagePropTypes, 'imageSize' | 'smallSize' | 'largeSize' | 'image' | 'children'> & {
    name: string,
    children?: React.ReactNode
}

export default async function CmsImage({ name, children, ...props }: PropTypes) {
    let image : ImageT | null = null
    const res = await read(name)

    //The read icmsImage action should always return a CmsImage (it creates it if it does not exist)
    if (!res.success) throw new Error(`An error with creating or loading cms image: ${name}`)

    image = res.data.image ?? null

    if (!image) {
        const defaultImageRes = await readImage('default_image')

        if (!defaultImageRes.success) {
            throw new Error('No default image found. To fix add a image called: default_image')
        }

        image = defaultImageRes.data ?? null
    }

    if (!image) throw new Error('No default image found. To fix add a image called: default_image')

    return (
        <div className={styles.CmsImage}>
            <CmsImageEditor cmsImage={{ ...res.data, image }}/>
            <Image imageSize={res.data.imageSize} image={image} {...props}/>
            <div className={styles.children}>{children}</div>
        </div>
    )
}
