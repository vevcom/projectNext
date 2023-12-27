import create from '@/actions/images/create'
import Form from '@/app/components/Form/Form'
import FileInput from '@/app/components/UI/FileInput'
import TextInput from '@/app/components/UI/TextInput'
import styles from './CollectionAdmin.module.scss'

type PropTypes = {
    collectionId: number
}   

export default function CollectionAdmin({collectionId}: PropTypes) {
    return (
        <div className={styles.CollectionAdmin}>
            <Form title='Upload image' createText='upload' action={create.bind(null, collectionId)}>
                <TextInput color="black" label="name" name="name" />
                <TextInput color="black" label="alt" name="alt" />
                <FileInput label="file" name="file" color="primary" />
            </Form>
            <Form title='Edit collection' createText='update' action={create.bind(null, collectionId)}>
                <TextInput color="black" label="collection name" name="name" />
                <TextInput color="black" label="description" name="name" />
            </Form>
        </div>
        
    )
}
