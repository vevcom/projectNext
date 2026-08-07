'use client'
import styles from './CollectionAdmin.module.scss'
import CollectionAdminUpload from './CollectionAdminUpload'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import ImageUploader from '@/components/Image/ImageUploader'
import PopUp from '@/components/PopUp/PopUp'
import VisibilityAdmin from '@/components/Visibility/VisibilityAdmin/VisibilityAdmin'
import useEditMode from '@/hooks/useEditMode'
import { dynamicImageAuth } from '@/services/images/dynamic/auth'
import Button from '@/components/UI/Button'
import { configureAction } from '@/services/configureAction'
import { EMPTY_VISIBILITY } from '@/auth/visibility/emptyVisibility'
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
    doubleLevelVisibility: DoubleLevelVisibilityMatrix | null,
    refreshImages: () => void,
}

export default function CollectionAdmin({ collection, doubleLevelVisibility, refreshImages }: PropTypes) {
    const { id: collectionId } = collection
    const router = useRouter()
    const doubleLevelMatrix = doubleLevelVisibility ?? EMPTY_VISIBILITY

    const canUploadOne = useEditMode({
        authorizer: dynamicImageAuth.uploadImage.dynamicFields({ doubleLevelMatrix })
    })
    const canUploadMany = useEditMode({
        authorizer: dynamicImageAuth.uploadManyImages.dynamicFields({ doubleLevelMatrix })
    })
    const canUpdateCollection = useEditMode({
        authorizer: dynamicImageAuth.updateCollection.dynamicFields({ doubleLevelMatrix })
    })
    const canDestroyCollection = useEditMode({
        authorizer: dynamicImageAuth.destroyCollection.dynamicFields({ doubleLevelMatrix })
    })
    const canUpdateRegularVisibility = useEditMode({
        authorizer: dynamicImageAuth.updateRegularLevel.dynamicFields({ doubleLevelMatrix })
    })
    const canUpdateAdminVisibility = useEditMode({
        authorizer: dynamicImageAuth.updateAdminLevel.dynamicFields({ doubleLevelMatrix })
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
                                        <ImageUploader
                                            title="Last opp bilde"
                                            successCallback={refreshImages}
                                            closePopUpOnSuccess="UploadImages"
                                            uploadImageAction={configureAction(
                                                uploadImageToDynamicCollectionAction,
                                                { params: { collectionId } }
                                            )}
                                        />
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
                doubleLevelVisibility && canOpenVisibilityPopUp && (
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
