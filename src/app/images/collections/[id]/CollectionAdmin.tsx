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

type PropTypes = {
    collectionId: number
}

export default function CollectionAdmin({ collectionId }: PropTypes) {
    const router = useRouter()
    const context = useContext(ImageCollectionSelectImageContext)

    return (
        <div className={styles.CollectionAdmin}>
            <div className={styles.upload}>
                <Form
                    successCallback={() => router.refresh()}
                    title="Upload image"
                    submitText="upload"
                    action={create.bind(null, collectionId)}
                >
                    <TextInput color="black" label="name" name="name" />
                    <TextInput color="black" label="alt" name="alt" />
                    <FileInput label="file" name="file" color="primary" />
                </Form>
                <PopUp showButtonContent={
                    <>
                        Upload many
                        <FontAwesomeIcon icon={faUpload} />
                    </>
                }>
                    <Form
                        successCallback={() => router.refresh()}
                        title="Upload images"
                        submitText="upload"
                        action={createMany.bind(null, collectionId)}
                    >
                        <Dropzone label="upload images" name="files"/>
                    </Form>
                </PopUp>
            </div>
            <Form
                successCallback={() => router.refresh()}
                title="Edit collection"
                submitText="update"
                action={update.bind(null, collectionId)}
            >
                <TextInput color="black" label="collection name" name="name" />
                <TextInput color="black" label="description" name="description" />
            </Form>
            <Form
                submitText="delete collection"
                successCallback={() => router.push('/images')}
                action={destroy.bind(null, collectionId)}
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: 'Are you sure you want to delete this collection? This will also delete all the images in this collection.'
                }}
            />
        </div>
    )
}
