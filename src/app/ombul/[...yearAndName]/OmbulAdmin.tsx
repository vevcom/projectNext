'use client'

import Form from '@/app/components/Form/Form'
import styles from './OmbulAdmin.module.scss'
import type { ExpandedCmsImage } from '@/actions/cms/images/Types'
import CmsImageClient from '@/app/components/Cms/CmsImage/CmsImageClient'
import { updateOmbul, updateOmbulFile } from '@/actions/ombul/update'

type PropTypes = {
    canUpdate: boolean
    canDestroy: boolean
    coverImage: ExpandedCmsImage
    ombulId: number
}

/**
 * The admin panel for the ombul to change cover image (using cms image) anf update year, number and file.
 * @param canUpdate - does the user have permission to update the ombul
 * @param canDestroy - does the user have permission to destroy the ombul
 * @param coverImage - the cover image of the ombul (cmsImage)
 * @param ombulId - the id of the ombul
 * @returns 
 */
export default function OmbulAdmin({ 
    canUpdate, 
    canDestroy, 
    coverImage, 
    ombulId 
}: PropTypes) {
    const updateOmbulAction = updateOmbul.bind(null, ombulId)
    return (
        <div className={styles.OmbulAdmin}>
            <div>
            {
                canUpdate && (
                    <Form
                        action={updateOmbulAction}
                    ></Form>
                )
            }  
            {
                canDestroy && (
                    <></>
                )
            }
            </div>
            {
                canUpdate && (
                    <div className={styles.coverImage}>
                        <CmsImageClient name={coverImage.name} width={250} />
                    </div>
                    
                )
            }
        </div>
    )
}