'use client'

import Form from '@/app/components/Form/Form'
import styles from './OmbulAdmin.module.scss'
import CmsImage from '@/app/components/Cms/CmsImage/CmsImage'
import type { ExpandedCmsImage } from '@/actions/cms/images/Types'

type PropTypes = {
    canUpdate: boolean
    canDestroy: boolean
    coverImage: ExpandedCmsImage
}

export default function OmbulAdmin({ canUpdate, canDestroy, coverImage }: PropTypes) {
    return (
        <div className={styles.OmbulAdmin}>
            {
                canUpdate && (
                    <>

                    
                    <div className={styles.coverImage}>
                        <CmsImage name={coverImage.name} width={250} />
                    </div>
                    </>
                )
            }
            
            {
                canDestroy && (
                    <></>
                )
            }
        </div>
    )
}