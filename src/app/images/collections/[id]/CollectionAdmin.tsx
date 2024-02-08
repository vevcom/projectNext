'use client'
import styles from './CollectionAdmin.module.scss'
import { createImage, createImages } from '@/actions/images/create'
import { updateImageCollection } from '@/actions/images/collections/update'
import Form from '@/app/components/Form/Form'
import FileInput from '@/app/components/UI/FileInput'
import TextInput from '@/app/components/UI/TextInput'
import Dropzone from '@/app/components/UI/Dropzone'
import PopUp from '@/app/components/PopUp/PopUp'
import { destroyImageCollection } from '@/actions/images/collections/destroy'
import { ImageSelectionContext } from '@/context/ImageSelection'
import { ImagePagingContext } from '@/context/paging/ImagePaging'
import Image from '@/components/Image/Image'
import { EditModeContext } from '@/context/EditMode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import type { Image as ImageT } from '@prisma/client'

type PropTypes = {
    collectionId: number,
    coverImage: ImageT | null,
}

export default function CollectionAdmin({ collectionId, coverImage }: PropTypes) {
    const router = useRouter()
    const selection = useContext(ImageSelectionContext)
    const pagingContext = useContext(ImagePagingContext)
    if (!selection) throw new Error('No context')

    const editMode = useContext(EditModeContext)
    const shouldRender = editMode?.editMode ?? true
    if (!shouldRender) return null

    const refreshImages = () => {
        pagingContext?.refetch()
        router.refresh()
    }

    return (
        <div className={styles.CollectionAdmin}>
            <div className={styles.upload}>
                <Form
                    successCallback={refreshImages}
                    title="last opp bilde"
                    submitText="last opp"
                    action={createImage.bind(null, collectionId)}
                >
                    <TextInput color="black" label="navn" name="name" />
                    <TextInput color="black" label="alternativ tekst" name="alt" />
                    <FileInput label="fil" name="file" color="primary" />
                </Form>
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
                        action={createImages.bind(null, collectionId)}
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
                action={updateImageCollection.bind(null, collectionId).bind(null, selection.selectedImage?.id)}
            >
                <TextInput color="black" label="navn" name="name" />
                <TextInput color="black" label="beskrivelse" name="description" />
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
                action={destroyImageCollection.bind(null, collectionId)}
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: 'Er du sikker på at du vil slette samlingen. Dette vil også slette alle bilder i salingen.'
                }}
            />
        </div>
    )
}
