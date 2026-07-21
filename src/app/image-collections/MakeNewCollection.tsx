'use client'
import styles from './MakeNewCollection.module.scss'
import Form from '@/components/Form/Form'
import PopUp from '@/components/PopUp/PopUp'
import TextInput from '@/components/UI/TextInput'
import { createDynamicImageCollectionAction } from '@/services/images/dynamic/actions'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function MakeNewCollection() {
    const popUpKey = 'MakeNewCollection'

    return (
        <PopUp popUpKey={popUpKey} showButtonContent={<FontAwesomeIcon icon={faPlus} />}>
            <div className={styles.MakeNewCollection}>
                <Form
                    closePopUpOnSuccess={popUpKey}
                    refreshOnSuccess
                    navigateOnSuccess={
                        collection =>
                            (collection ? `/image-collections/${collection.id}` : '/image-collections')
                    }
                    title="Lag et album"
                    submitText="Lag album"
                    action={createDynamicImageCollectionAction}
                >
                    <TextInput label="navn" name="collectionName" />
                    <TextInput label="beskrivelse" name="collectionDescription" />
                </Form>
            </div>
        </PopUp>
    )
}
