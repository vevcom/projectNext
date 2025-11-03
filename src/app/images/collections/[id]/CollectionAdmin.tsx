'use client'
import styles from './CollectionAdmin.module.scss'
import CollectionAdminUpload from './CollectionAdminUpload'
import { updateImageCollectionAction, destroyImageCollectionAction } from '@/services/images/collections/actions'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { ImagePagingContext } from '@/contexts/paging/ImagePaging'
import ImageUploader from '@/components/Image/ImageUploader'
import PopUp from '@/components/PopUp/PopUp'
import useEditMode from '@/hooks/useEditmode'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import Button from '@/components/UI/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import type { VisibilityMatrix } from '@/services/visibility/types'
import type { ExpandedImageCollection } from '@/services/images/collections/types'

type PropTypes = {
    collection: ExpandedImageCollection
    visibilityAdmin: VisibilityMatrix
    visibilityRead: VisibilityMatrix
}

export default function CollectionAdmin({ collection, visibilityAdmin, visibilityRead }: PropTypes) {
    console.log(visibilityAdmin, visibilityRead)
    const { id: collectionId } = collection
    const router = useRouter()
    const pagingContext = useContext(ImagePagingContext)
    //TODO: Use correct auther.
    const canEdit = useEditMode({
        auther: RequireNothing.staticFields({}).dynamicFields({})
    })
    const [uploadOption, setUploadOption] = useState<'MANY' | 'ONE'>('MANY')
    if (!canEdit) return null

    const refreshImages = () => {
        if (pagingContext && pagingContext?.startPage.pageSize > pagingContext.state.data.length) {
            pagingContext?.refetch()
        } else {
            router.refresh()
        }
    }

    return (
        <>
            <div className={styles.CollectionAdmin}>
                <PopUp PopUpKey="UploadImages" showButtonClass={styles.adminOption} showButtonContent={
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
                                    <ImageUploader collectionId={collectionId} successCallback={refreshImages} />
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
                <PopUp PopUpKey="Edit" showButtonClass={styles.adminOption} showButtonContent={
                    <FontAwesomeIcon icon={faCog} />
                }>
                    <Form
                        refreshOnSuccess
                        title="Rediger samling"
                        submitText="oppdater"
                        closePopUpOnSuccess="Edit"
                        action={updateImageCollectionAction.bind(null, collectionId).bind(null, undefined)}
                    >
                        <TextInput
                            defaultValue={collection.name}
                            color="black"
                            label="navn"
                            name="name"
                        />
                        <TextInput
                            defaultValue={collection.description || ''}
                            color="black"
                            label="beskrivelse"
                            name="description"
                        />
                    </Form>
                    <Form
                        submitText="slett samling"
                        successCallback={() => router.push('/images')}
                        action={destroyImageCollectionAction.bind(null, collectionId)}
                        submitColor="red"
                        confirmation={{
                            confirm: true,
                            text: 'Er du sikker på at du vil slette samlingen. Dette vil også slette alle bilder i salingen.'
                        }}
                    />
                </PopUp>
                <PopUp PopUpKey="Visibility" showButtonClass={styles.adminOption} showButtonContent={
                    <FontAwesomeIcon icon={faEye} />
                }>
                    <div className={styles.visibility}>
                        {/* VisibilityAdmin... */}
                    </div>
                </PopUp>
            </div>
        </>
    )
}
