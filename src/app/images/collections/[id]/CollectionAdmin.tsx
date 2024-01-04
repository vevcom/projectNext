'use client'
import create, { createMany } from '@/actions/images/create'
import update from '@/actions/images/collections/update'
import Form from '@/app/components/Form/Form'
import FileInput from '@/app/components/UI/FileInput'
import TextInput from '@/app/components/UI/TextInput'
import styles from './CollectionAdmin.module.scss'
import Dropzone from '@/app/components/UI/Dropzone'
import PopUp from '@/app/components/PopUp/PopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import destroy from '@/actions/images/collections/destroy'
import { useContext } from 'react'
import { ImageCollectionSelectImageContext } from '@/context/ImageCollectionSelectImage'
import { ImagePagingContext } from '@/context/paging/ImagePaging'
import type { Image as ImageT } from '@prisma/client'
import Image from '@/components/Image/Image'

type PropTypes = {
    collectionId: number,
    coverImage: ImageT | null,
}

export default function CollectionAdmin({ collectionId, coverImage }: PropTypes) {
    const router = useRouter()
    const selection = useContext(ImageCollectionSelectImageContext)
    const pagingContext = useContext(ImagePagingContext)
    if (!selection) throw new Error('No context')

    const refreshImages = () => {
        pagingContext?.refetch()
    }

    return (
        <div className={styles.CollectionAdmin}>
            <div className={styles.upload}>
                <Form
                    successCallback={refreshImages}
                    title="last opp bilde"
                    submitText="last opp"
                    action={create.bind(null, collectionId)}
                >
                    <TextInput color="black" label="navn" name="name" />
                    <TextInput color="black" label="alt" name="alt" />
                    <FileInput label="fil" name="file" color="primary" />
                </Form>
                <PopUp showButtonContent={
                    <>
                        Last opp mange
                        <FontAwesomeIcon icon={faUpload} />
                    </>
                }>
                    <Form
                        successCallback={refreshImages}
                        title="last opp bilder"
                        submitText="last opp"
                        action={createMany.bind(null, collectionId)}
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
                action={update.bind(null, collectionId).bind(null, selection.selectedImage?.id)}
            >
                <TextInput color="black" label="navn" name="name" />
                <TextInput color="black" label="beskrivelse" name="description" />
                <div className={styles.coverImage}>
                    <div>
                        <h5>coverbilde</h5>
                        <div className={styles.showCurrentCover}>
                            <FontAwesomeIcon icon={faQuestion} />
                            <div className={styles.currentCover}>
                            {
                                coverImage ? (
                                    <>
                                        <i>nåværende coverbilde</i>
                                        <Image image={coverImage} width={120}/>
                                    </>
                                ) : (
                                    <i>ingen coverbilde</i>
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
                                    <button type='button' onClick={() => selection.setSelectedImage(null)}>
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
                        <button type='button' onClick={() => selection.setSelectionMode(!selection.selectionMode)}>
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
                action={destroy.bind(null, collectionId)}
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: 'Er du sikker på at du vil slette samlingen. Dette vil også slette alle bilder i salingen.'
                }}
            />
        </div>
    )
}
