'use client'
import styles from './CollectionAdmin.module.scss'
import { createImagesAction } from '@/actions/images/create'
import { updateImageCollectionAction } from '@/actions/images/collections/update'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import Dropzone from '@/app/components/UI/Dropzone'
import PopUp from '@/app/components/PopUp/PopUp'
import { destroyImageCollectionAction } from '@/actions/images/collections/destroy'
import { ImageSelectionContext } from '@/context/ImageSelection'
import { ImagePagingContext } from '@/context/paging/ImagePaging'
import Image from '@/components/Image/Image'
import ImageUploader from '@/app/components/Image/ImageUploader'
import useEditing from '@/hooks/useEditing'
import VisibilityAdmin from '@/app/components/VisiblityAdmin/VisibilityAdmin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import type { ExpandedImageCollection } from '@/server/images/collections/Types'
import { VisibilityCollapsed } from '@/server/visibility/Types'

type PropTypes = {
    collection: ExpandedImageCollection
    visibility: VisibilityCollapsed
}

export default function CollectionAdmin({ collection, visibility }: PropTypes) {
    const { id: collectionId, coverImage } = collection
    const router = useRouter()
    const selection = useContext(ImageSelectionContext)
    const pagingContext = useContext(ImagePagingContext)
    const canEdit = useEditing({
        requiredVisibility: visibility,
    })
    if (!canEdit) return null
    if (!selection) throw new Error('No context')

    const refreshImages = () => {
        if (pagingContext && pagingContext?.startPage.pageSize > pagingContext.state.data.length) {
            pagingContext?.refetch()
        } else {
            router.refresh()
        }
    }

    return (
        <>
            <aside className={styles.CollectionAdmin}>
                <div className={styles.upload}>
                    <ImageUploader collectionId={collectionId} successCallback={refreshImages} />
                    <PopUp PopUpKey={uuid()} showButtonContent={
                        <>
                        Last opp mange
                            <FontAwesomeIcon icon={faUpload} />
                        </>
                    }>
                        <Form
                            className={styles.uploadMany}
                            successCallback={refreshImages}
                            title="last opp bilder"
                            submitText="last opp"
                            action={createImagesAction.bind(null, collectionId)}
                        >
                            <Dropzone label="last opp" name="files"/>
                        </Form>
                    </PopUp>
                </div>
                <Form
                    successCallback={() => {
                        router.refresh()
                        selection.setSelectionMode(false)
                    }}
                    title="Rediger samling"
                    submitText="oppdater"
                    action={updateImageCollectionAction.bind(null, collectionId).bind(null, selection.selectedImage?.id)}
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
                    <div className={styles.coverImage}>
                        <div>
                            <h5>forsidebilde</h5>
                            <div className={styles.showCurrentCover}>
                                <FontAwesomeIcon icon={faQuestion} />
                                <div className={styles.currentCover}>
                                    {
                                        coverImage ? (
                                            <>
                                                <i>nåværende forsidebilde</i>
                                                <Image image={coverImage} width={120}/>
                                            </>
                                        ) : (
                                            <i>ingen forsidebilde</i>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className={styles.chosenImage}>
                            <p>Valgt bilde:</p>
                            <span>
                                {
                                    selection.selectedImage ? (
                                        <>
                                            <Image image={selection.selectedImage} width={120}/>
                                            <button type="button" onClick={() => selection.setSelectedImage(null)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p>Intet bilde valgt</p>
                                        </>
                                    )
                                }
                            </span>
                            <button type="button" onClick={() => selection.setSelectionMode(!selection.selectionMode)}>
                                {
                                    selection.selectionMode ? 'Avslutt valg' : 'Velg bilde'
                                }
                            </button>
                        </div>

                    </div>
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
            </aside>
            <VisibilityAdmin visibilityId={visibility.id} />
        </>
    )
}
