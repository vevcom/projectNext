'use client'
import styles from './CollectionAdmin.module.scss'
import CollectionAdminUpload from './CollectionAdminUpload'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import FileInput from '@/components/UI/FileInput'
import LicenseChooser from '@/components/LicenseChooser/LicenseChooser'
import PopUp from '@/components/PopUp/PopUp'
import VisibilityAdmin from '@/components/VisibilityAdmin/VisibilityAdmin'
import useEditMode from '@/hooks/useEditMode'
import { dynamicImageAuth } from '@/services/images/dynamic/auth'
import Button from '@/components/UI/Button'
import { configureAction } from '@/services/configureAction'
import {
    updateDynamicImageCollectionAction,
    destroyDynamicImageCollectionAction,
    uploadImageToDynamicCollectionAction,
    updateDynamicImageCollectionRegularLevelVisibilityAction,
    updateDynamicImageCollectionAdminLevelVisibilityAction,
} from '@/services/images/dynamic/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ExpandedImageCollection } from '@/services/images/subservice/types'
import type { DoubleLevelVisibilityMatrix } from '@/services/visibility/types'

type PropTypes = {
    collection: ExpandedImageCollection,
    doubleLevelVisibility: DoubleLevelVisibilityMatrix,
    refreshImages: () => void,
}

export default function CollectionAdmin({ collection, doubleLevelVisibility, refreshImages }: PropTypes) {
    const { id: collectionId } = collection
    const router = useRouter()

    // One authorizer check per action - each button/form below is gated by the exact same
    // authorizer its own action uses server-side, not a single blanket "can edit collection" check.
    const canUploadOne = useEditMode({
        authorizer: dynamicImageAuth.uploadImage.dynamicFields({ doubleLevelMatrix: doubleLevelVisibility })
    })
    const canUploadMany = useEditMode({
        authorizer: dynamicImageAuth.uploadManyImages.dynamicFields({ doubleLevelMatrix: doubleLevelVisibility })
    })
    const canUpdateCollection = useEditMode({
        authorizer: dynamicImageAuth.updateCollection.dynamicFields({ doubleLevelMatrix: doubleLevelVisibility })
    })
    const canDestroyCollection = useEditMode({
        authorizer: dynamicImageAuth.destroyCollection.dynamicFields({ doubleLevelMatrix: doubleLevelVisibility })
    })
    const canUpdateRegularVisibility = useEditMode({
        authorizer: dynamicImageAuth.updateRegularLevel.dynamicFields({ doubleLevelMatrix: doubleLevelVisibility })
    })
    const canUpdateAdminVisibility = useEditMode({
        authorizer: dynamicImageAuth.updateAdminLevel.dynamicFields({ doubleLevelMatrix: doubleLevelVisibility })
    })

    const [uploadOption, setUploadOption] = useState<'MANY' | 'ONE'>(canUploadMany ? 'MANY' : 'ONE')

    const canUpload = canUploadOne || canUploadMany
    const canOpenEditPopUp = canUpdateCollection || canDestroyCollection
    const canOpenVisibilityPopUp = canUpdateRegularVisibility || canUpdateAdminVisibility

    if (!canUpload && !canOpenEditPopUp && !canOpenVisibilityPopUp) return null

    return (
        <div className={styles.CollectionAdmin}>
            {
                canUpload && (
                    <PopUp popUpKey="UploadImages" showButtonClass={styles.adminOption} showButtonContent={
                        <FontAwesomeIcon icon={faUpload} />
                    }>
                        <div className={styles.upload}>
                            {
                                uploadOption === 'MANY' ? canUploadMany && (
                                    <>
                                        <CollectionAdminUpload collectionId={collectionId} refreshImages={refreshImages} />
                                        {
                                            canUploadOne && (
                                                <Button
                                                    className={styles.toggleUploadStyle}
                                                    onClick={() => setUploadOption('ONE')}
                                                    color="secondary"
                                                >
                                                Last opp ett bilde
                                                </Button>
                                            )
                                        }
                                    </>
                                ) : canUploadOne && (
                                    <>
                                        <Form
                                            title="Last opp bilde"
                                            submitText="last opp"
                                            successCallback={refreshImages}
                                            closePopUpOnSuccess="UploadImages"
                                            action={configureAction(
                                                uploadImageToDynamicCollectionAction,
                                                { params: { collectionId } }
                                            )}
                                        >
                                            <TextInput color="black" label="navn" name="imageName" />
                                            <TextInput color="black" label="alternativ tekst" name="imageAlt" />
                                            <TextInput color="black" label="kreditert" name="imageCredit" />
                                            <LicenseChooser name="imageLicenseId" />
                                            <FileInput label="fil" name="imageFile" color="primary" />
                                        </Form>
                                        {
                                            canUploadMany && (
                                                <Button
                                                    className={styles.toggleUploadStyle}
                                                    onClick={() => setUploadOption('MANY')}
                                                    color="secondary"
                                                >
                                                Last opp mange
                                                </Button>
                                            )
                                        }
                                    </>
                                )
                            }
                        </div>
                    </PopUp>
                )
            }
            {
                canOpenEditPopUp && (
                    <PopUp popUpKey="Edit" showButtonClass={styles.adminOption} showButtonContent={
                        <FontAwesomeIcon icon={faCog} />
                    }>
                        {
                            canUpdateCollection && (
                                <Form
                                    refreshOnSuccess
                                    title="Rediger samling"
                                    submitText="oppdater"
                                    closePopUpOnSuccess="Edit"
                                    action={configureAction(
                                        updateDynamicImageCollectionAction,
                                        { params: { collectionId } }
                                    )}
                                >
                                    <TextInput
                                        defaultValue={collection.name}
                                        color="black"
                                        label="navn"
                                        name="collectionName"
                                    />
                                    <TextInput
                                        defaultValue={collection.description || ''}
                                        color="black"
                                        label="beskrivelse"
                                        name="collectionDescription"
                                    />
                                </Form>
                            )
                        }
                        {
                            canDestroyCollection && (
                                <Form
                                    submitText="slett samling"
                                    successCallback={() => router.push('/image-collections')}
                                    action={configureAction(
                                        destroyDynamicImageCollectionAction,
                                        { params: { collectionId } }
                                    )}
                                    submitColor="red"
                                    confirmation={{
                                        confirm: true,
                                        text:
                                            'Er du sikker på at du vil slette samlingen. ' +
                                            'Dette vil også slette alle bilder i salingen.'
                                    }}
                                />
                            )
                        }
                    </PopUp>
                )
            }
            {
                canOpenVisibilityPopUp && (
                    <PopUp popUpKey="Visibility" showButtonClass={styles.adminOption} showButtonContent={
                        <FontAwesomeIcon icon={faEye} />
                    }>
                        <div className={styles.visibility}>
                            {
                                canUpdateRegularVisibility && (
                                    <div>
                                        <h3>Vanlig visning</h3>
                                        <VisibilityAdmin
                                            visibility={doubleLevelVisibility.regularLevel}
                                            visibilityId={collection.visibilityRegularId}
                                            updateVisibilityAction={configureAction(
                                                updateDynamicImageCollectionRegularLevelVisibilityAction,
                                                { implementationParams: { collectionId } }
                                            )}
                                        />
                                    </div>
                                )
                            }
                            {
                                canUpdateAdminVisibility && (
                                    <div>
                                        <h3>Adminvisning</h3>
                                        <VisibilityAdmin
                                            visibility={doubleLevelVisibility.adminLevel}
                                            visibilityId={collection.visibilityAdminId}
                                            updateVisibilityAction={configureAction(
                                                updateDynamicImageCollectionAdminLevelVisibilityAction,
                                                { implementationParams: { collectionId } }
                                            )}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </PopUp>
                )
            }
        </div>
    )
}
