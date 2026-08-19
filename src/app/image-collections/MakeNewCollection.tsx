'use client'
import styles from './MakeNewCollection.module.scss'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { createDynamicImageCollectionAction } from '@/services/images/dynamic/actions'

export default function MakeNewCollection() {
    const popUpKey = 'MakeNewCollection'

    return (
        <AddHeaderItemPopUp popUpKey={popUpKey}>
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
        </AddHeaderItemPopUp>
    )
}
