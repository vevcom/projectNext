'use client'
import ImageUploader from '@/components/Image/ImageUploader'
import useEditMode from '@/hooks/useEditMode'
import type { UploadSpecialCollectionImageAction } from '@/services/images/subservice/types'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'

type PropTypes = {
    canEdit: AuthResultTypeAny,
    uploadImageAction: UploadSpecialCollectionImageAction,
}

/**
 * Gates the profile image upload form behind edit mode - kept out of the (server-rendered)
 * settings page since useEditMode needs a client component. Rendered right next to the current
 * profile image, no popup needed.
 */
export default function ProfileImageUploader({ canEdit, uploadImageAction }: PropTypes) {
    const editable = useEditMode({ authResult: canEdit })

    if (!editable) return null
    return <ImageUploader title="Endre profilbilde" uploadImageAction={uploadImageAction} refreshOnSuccess />
}
