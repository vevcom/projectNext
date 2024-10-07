'use client'
import styles from './CollectionAdmin.module.scss'
import CollectionAdminUpload from './CollectionAdminUpload'
import { updateImageCollectionAction } from '@/actions/images/collections/update'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { destroyImageCollectionAction } from '@/actions/images/collections/destroy'
import { ImageSelectionContext } from '@/contexts/ImageSelection'
import { ImagePagingContext } from '@/contexts/paging/ImagePaging'
import Image from '@/components/Image/Image'
import ImageUploader from '@/components/Image/ImageUploader'
import useEditing from '@/hooks/useEditing'
import VisibilityAdmin from '@/components/VisiblityAdmin/VisibilityAdmin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faEye, faImage, faQuestion, faTrash, faUpDown, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import type { VisibilityCollapsed } from '@/services/visibility/Types'
import type { ExpandedImageCollection } from '@/services/images/collections/Types'
import PopUp from '@/app/_components/PopUp/PopUp'
import Button from '@/app/_components/UI/Button'
import ImageList from '@/app/_components/Image/ImageList/ImageList'

type PropTypes = {
    collection: ExpandedImageCollection
    visibility: VisibilityCollapsed
}

export default function CollectionAdmin({ collection, visibility }: PropTypes) {
    const { id: collectionId } = collection
    const router = useRouter()
    const pagingContext = useContext(ImagePagingContext)
    const canEdit = useEditing({
        requiredVisibility: visibility,
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
                                    color='secondary'
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
                                    color='secondary'
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
                        <VisibilityAdmin visibilityId={visibility.id} />
                    </div>
                </PopUp>
            </div>
        </>
    )
}
