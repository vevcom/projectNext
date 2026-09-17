'use client'
import Form from '@/components/Form/Form'
import { configureAction } from '@/services/configureAction'
import type { Image as ImageT } from '@/prisma-generated-pn-types'
import type { UpdateCmsImageAction } from '@/cms/images/types'

type PropTypes = {
    cmsImageId: number
    selectedImage: ImageT
    className?: string
    updateCmsImageAction: UpdateCmsImageAction
}

export default function ChangeImageForm({ cmsImageId, selectedImage, className, updateCmsImageAction }: PropTypes) {
    return (
        <Form
            className={className}
            closePopUpOnSuccess={`EditCmsImage${cmsImageId}`}
            action={
                configureAction(
                    updateCmsImageAction,
                    { params: { cmsImageId } }
                ).bind(null, { data: { imageId: selectedImage.id } })
            }
            submitText="change"
            refreshOnSuccess
        />
    )
}
