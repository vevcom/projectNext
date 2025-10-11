'use client'
import { updateCmsImageAction } from '@/services/cms/images/actions'
import Form from '@/components/Form/Form'
import { ImageSelectionContext } from '@/contexts/ImageSelection'
import { useContext } from 'react'

type PropTypes = {
    cmsImageId: number
    className?: string
}

export default function ChangeImageForm({ cmsImageId, className }: PropTypes) {
    const selection = useContext(ImageSelectionContext)

    if (!selection?.selectedImage) throw new Error('ImageSelectionContext required to use ChangeImage')

    return (
        <Form
            className={className}
            closePopUpOnSuccess={`EditCmsImage${cmsImageId}`}
            action={updateCmsImageAction.bind(null, cmsImageId).bind(null, selection?.selectedImage?.id)}
            submitText="change"
            refreshOnSuccess
        />
    )
}
