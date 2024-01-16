import CmsImageEditor from './CmsImageEditor'
import styles from './CmsImage.module.scss'
import Image from '../../Image/Image'
import read from '@/actions/cms/images/read'
import React from 'react'
import type { PropTypes as ImagePropTypes } from '../../Image/Image'
import type { Image as ImageT } from '@prisma/client'

export type PropTypes = Omit<ImagePropTypes, 'image' | 'children'> & {
    name: string,
    children?: React.ReactNode
}

export default async function CmsImage({ name, children, ...props }: PropTypes) {
    let image : ImageT | null = null
    const res = await read(name)
    //The read inageLink action should always return a CmsImage (it creates it if it does not exist)
    if (!res.success) throw new Error(`An error with creating or loading image link: ${name}`)
    image = res.data.image ?? null
    if (!image) {
        const defaultres = await read('default_image')
        if (!defaultres.success) throw new Error('No default image found. To fix add a image called: default_image')
        image = defaultres.data?.image ?? null
    }
    if (!image) throw new Error('No default image found. To fix add a image called: default_image')
    return (
        <div className={styles.CmsImage}>
            <CmsImageEditor cmsImage={{ ...res.data, image }}/>
            <Image image={image} {...props}/>
            <div className={styles.children}>{children}</div>
        </div>
    )
}
