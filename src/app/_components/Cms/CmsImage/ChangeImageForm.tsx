'use client'
import Form from '@/components/Form/Form'
import { ImageSelectionContext } from '@/contexts/ImageSelection'
import { configureAction } from '@/services/configureAction'
import { useContext } from 'react'
import type { UpdateCmsImageAction } from '@/cms/images/types'

type PropTypes = {
    cmsImageId: number
    className?: string
    updateCmsImageAction: UpdateCmsImageAction
}

export default function ChangeImageForm({ cmsImageId, className, updateCmsImageAction }: PropTypes) {
    const selection = useContext(ImageSelectionContext)

    if (!selection?.selectedImage) throw new Error('ImageSelectionContext required to use ChangeImage')

    return (
        <Form
            className={className}
            closePopUpOnSuccess={`EditCmsImage${cmsImageId}`}
            action={
                configureAction(
                    updateCmsImageAction,
                    { params: { cmsImageId } }
                ).bind(null, { data: { imageId: selection?.selectedImage?.id } })
            }
            submitText="change"
            refreshOnSuccess
        />
    )
}
