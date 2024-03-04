'use client'

import Form from '@/app/components/Form/Form'
import styles from './OmbulAdmin.module.scss'
import type { ExpandedCmsImage } from '@/actions/cms/images/Types'
import CmsImageClient from '@/app/components/Cms/CmsImage/CmsImageClient'
import { updateOmbul, updateOmbulFile } from '@/actions/ombul/update'
import { EditModeContext } from '@/context/EditMode'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { ExpandedOmbul } from '@/actions/ombul/Types'
import DateInput from '@/app/components/UI/DateInput'
import NumberInput from '@/app/components/UI/NumberInput'
import FileInput from '@/app/components/UI/FileInput'
import CmsImage, { CmsImageNew } from '@/app/components/Cms/CmsImage/CmsImage'

type PropTypes = {
    canUpdate: boolean
    canDestroy: boolean
    ombul: ExpandedOmbul
}

/**
 * The admin panel for the ombul to change cover image (using cms image) anf update year, number and file.
 * The component is only shown if editmode is enabled.
 * @param canUpdate - does the user have permission to update the ombul
 * @param canDestroy - does the user have permission to destroy the ombul
 * @param coverImage - the cover image of the ombul (cmsImage)
 * @param ombul - The obul (expanded) to be edited
 * @returns 
 */
export default function OmbulAdmin({ 
    canUpdate, 
    canDestroy, 
    ombul,
}: PropTypes) {
    const { push, refresh } = useRouter()
    const editCtx = useContext(EditModeContext)
    if (!editCtx?.editMode) return null

    const updateOmbulAction = updateOmbul.bind(null, ombul.id)
    const updateOmbulFileAction = updateOmbulFile.bind(null, ombul.id)

    const handleChange = async (ombul : ExpandedOmbul | undefined) => {
        if (!ombul) return
        push(`/ombul/${ombul?.year}/${ombul?.name}`)
        refresh()
    }

    const handleDestroy = async () => {
        push('/ombul')
        refresh()
    }
    
    return (
        <div className={styles.OmbulAdmin}>
            <div className={styles.left}>
            {
                canUpdate && (
                <>
                    <Form
                        action={updateOmbulAction}
                        successCallback={handleChange}
                        submitText='Oppdater'
                    >
                        <NumberInput 
                            name='year' 
                            label='År' 
                            defaultValue={ombul.year} 
                        />
                        <NumberInput 
                            name='issueNumber' 
                            label='Nummer'
                            defaultValue={ombul.issueNumber} 
                        />
                    </Form>
                    <Form
                        action={updateOmbulFileAction}
                        successCallback={handleChange}
                        submitText='Oppdater fil'
                    >
                        <FileInput name="ombulFile" label="ombul fil" color="primary" />
                    </Form>
                </>
                )
            }  
            {
                canDestroy && (
                    <></>
                )
            }
            </div>
            <div className={styles.right}>
            {
                canUpdate && (
                    <div className={styles.coverImage}>
                        <CmsImageNew cmsImage={ombul.coverImage} width={250} />
                    </div>
                )
            }
            </div>
        </div>
    )
}