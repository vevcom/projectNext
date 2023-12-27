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
            <Form title='upload image' createText='upload' action={create.bind(null, collectionId)}>
                <FileInput label="file" name="file" color="primary" />
                <TextInput color="red" label="name" name="name" />
                <TextInput color="red" label="alt" name="alt" />
            </Form>
            <Form title='Edit collection' createText='update' action={create.bind(null, collectionId)}>
                hei
            </Form>
        </div>
        
    )
}
