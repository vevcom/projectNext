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
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import destroy from '@/actions/images/collections/destroy'
import { useContext } from 'react'
import { ImageCollectionSelectImageContext } from '@/context/ImageCollectionSelectImage'
import { ImagePagingContext } from '@/context/paging/ImagePaging'

type PropTypes = {
    collectionId: number
}

export default function CollectionAdmin({ collectionId }: PropTypes) {
    const router = useRouter()
    const selection = useContext(ImageCollectionSelectImageContext)
    const pagingContext = useContext(ImagePagingContext)
    if (!selection) throw new Error('No context')

    const refreshImages = () => {
        pagingContext?.refetch({id: collectionId})
        router.refresh()
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
                successCallback={() => router.refresh()}
                title="Rediger samling"
                submitText="oppdater"
                action={update.bind(null, collectionId)}
            >
                <TextInput color="black" label="navn" name="name" />
                <TextInput color="black" label="beskrivelse" name="description" />
                <div className={styles.selectedImage}>
                {
                    selection.selectedImage ? (
                        <>
                            <p>Valgt bilde: {selection.selectedImage.name}</p>
                            <button type='button' onClick={() => selection.setSelectedImage(null)}>Fjern bilde</button>
                        </>
                    ) : (
                        <>
                            <p>Intet bilde valgt</p>
                        </>
                    )
                }
                    <button type='button' onClick={() => selection.setSelectionMode(!selection.selectionMode)}>
                        {
                            selection.selectionMode ? 'Avslutt valg' : 'Velg bilde'
                        }
                    </button>
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
