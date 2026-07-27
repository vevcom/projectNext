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
import useActionCall from '@/hooks/useActionCall'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import Button from '@/components/UI/Button'
import { configureAction } from '@/services/configureAction'
import {
    updateDynamicImageCollectionAction,
    destroyDynamicImageCollectionAction,
    uploadImageToDynamicCollectionAction,
    readDynamicImageCollectionDoubleLevelVisibilityAction,
    updateDynamicImageCollectionRegularLevelVisibilityAction,
    updateDynamicImageCollectionAdminLevelVisibilityAction,
} from '@/services/images/dynamic/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import type { ExpandedImageCollection } from '@/services/images/subservice/types'

type PropTypes = {
    collection: ExpandedImageCollection,
    refreshImages: () => void,
}

export default function CollectionAdmin({ collection, refreshImages }: PropTypes) {
    const { id: collectionId } = collection
    const router = useRouter()
    //TODO: Use correct authorizer.
    const canEdit = useEditMode({
        authorizer: RequireNothing.staticFields({}).dynamicFields({})
    })
    const [uploadOption, setUploadOption] = useState<'MANY' | 'ONE'>('MANY')

    const readDoubleLevelVisibility = useCallback(
        () => readDynamicImageCollectionDoubleLevelVisibilityAction({ params: { collectionId } }),
        [collectionId]
    )
    const { data: doubleLevelVisibility } = useActionCall(readDoubleLevelVisibility)

    if (!canEdit) return null

    return (
        <div className={styles.CollectionAdmin}>
            <PopUp popUpKey="UploadImages" showButtonClass={styles.adminOption} showButtonContent={
                <FontAwesomeIcon icon={faUpload} />
            }>
                <div className={styles.upload}>
                    {
                        uploadOption === 'MANY' ? (
                            <>
                                <CollectionAdminUpload collectionId={collectionId} refreshImages={refreshImages} />
                                <Button
                                    className={styles.toggleUploadStyle}
                                    onClick={() => setUploadOption('ONE')}
                                    color="secondary"
                                >
                                Last opp ett bilde
                                </Button>
                            </>
                        ) : (
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
                                <Button
                                    className={styles.toggleUploadStyle}
                                    onClick={() => setUploadOption('MANY')}
                                    color="secondary"
                                >
                                Last opp mange
                                </Button>
                            </>
                        )
                    }
                </div>
            </PopUp>
            <PopUp popUpKey="Edit" showButtonClass={styles.adminOption} showButtonContent={
                <FontAwesomeIcon icon={faCog} />
            }>
                <Form
                    refreshOnSuccess
                    title="Rediger samling"
                    submitText="oppdater"
                    closePopUpOnSuccess="Edit"
                    action={configureAction(updateDynamicImageCollectionAction, { params: { collectionId } })}
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
                <Form
                    submitText="slett samling"
                    successCallback={() => router.push('/image-collections')}
                    action={configureAction(destroyDynamicImageCollectionAction, { params: { collectionId } })}
                    submitColor="red"
                    confirmation={{
                        confirm: true,
                        text: 'Er du sikker på at du vil slette samlingen. Dette vil også slette alle bilder i salingen.'
                    }}
                />
            </PopUp>
            <PopUp popUpKey="Visibility" showButtonClass={styles.adminOption} showButtonContent={
                <FontAwesomeIcon icon={faEye} />
            }>
                <div className={styles.visibility}>
                    {
                        doubleLevelVisibility && (
                            <>
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
                            </>
                        )
                    }
                </div>
            </PopUp>
        </div>
    )
}
