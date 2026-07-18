'use client'
import styles from './ImageUploader.module.scss'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import FileInput from '@/components/UI/FileInput'
import LicenseChooser from '@/components/LicenseChooser/LicenseChooser'
import EditOverlay from '@/cms/EditOverlay'
import PopUp from '@/components/PopUp/PopUp'
import useEditMode from '@/hooks/useEditMode'
import type { UploadSpecialCollectionImageAction } from '@/services/images/subservice/types'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'
import type { PopUpKeyType } from '@/contexts/PopUp'

type PropTypes = {
    popUpKey: PopUpKeyType,
    uploadImageAction: UploadSpecialCollectionImageAction,
    canEdit: AuthResultTypeAny,
}

/**
 * A generic image upload form: which collection an upload lands in, and what happens to any image
 * it replaces (if any), is entirely up to the injected action. This covers both special collections
 * (see implementSpecialCollection) - one image per owning entity (a flair, a committee logo, a
 * profile image, an ombul cover), where uploading destroys the previous image - and ordinary
 * dynamic collections, which just grow with each upload. Any action whose data schema is
 * imageSchemas.uploadImage can be used here, pre-bound via configureAction to whatever params
 * identify the target (a collectionId, an owning entity's id, etc.).
 */
export default function ImageUploader({
    popUpKey,
    uploadImageAction,
    canEdit,
}: PropTypes) {
    const editable = useEditMode({ authResult: canEdit })

    if (!editable) return null
    return (
        <PopUp
            popUpKey={popUpKey}
            showButtonContent={<EditOverlay />}
            showButtonClass={styles.showBtn}
        >
            <Form
                title="Last opp bilde"
                submitText="last opp"
                action={uploadImageAction}
                closePopUpOnSuccess={popUpKey}
                refreshOnSuccess
            >
                <TextInput color="black" label="navn" name="imageName" />
                <TextInput color="black" label="alternativ tekst" name="imageAlt" />
                <TextInput color="black" label="kreditert" name="imageCredit" />
                <LicenseChooser name="imageLicenseId" />
                <FileInput label="fil" name="imageFile" color="primary" />
            </Form>
        </PopUp>
    )
}
