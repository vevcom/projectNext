'use client'
import styles from './MakeNewCollection.module.scss'
import Form from '@/components/Form/Form'
import PopUp from '@/components/PopUp/PopUp'
import TextInput from '@/components/UI/TextInput'
import { createImageCollectionAction } from '@/services/images/collections/actions'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { v4 as uuid } from 'uuid'
import type { ImageCollection } from '@prisma/client'

export default function MakeNewCollection() {
    const router = useRouter()
    const collectionCreatedCallback = (collection?: ImageCollection) => {
        if (collection) router.push(`/images/collections/${collection.id}`)
        router.refresh()
    }
    return (
        <PopUp PopUpKey={uuid()} showButtonContent={<FontAwesomeIcon icon={faPlus} />}>
            <div className={styles.MakeNewCollection}>
                <Form successCallback={collectionCreatedCallback}
                    title="Lag et album" submitText="Lag album" action={createImageCollectionAction}>
                    <TextInput label="navn" name="name" />
                    <TextInput label="beskrivelse" name="description" />
                </Form>
            </div>
        </PopUp>
    )
}
