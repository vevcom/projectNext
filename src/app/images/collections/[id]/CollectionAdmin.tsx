import create from '@/actions/images/create'
import update from '@/actions/images/collections/update'
import Form from '@/app/components/Form/Form'
import FileInput from '@/app/components/UI/FileInput'
import TextInput from '@/app/components/UI/TextInput'
import styles from './CollectionAdmin.module.scss'
import Dropzone from '@/app/components/UI/Dropzone'
import PopUp from '@/app/components/PopUp/PopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

type PropTypes = {
    collectionId: number
}

export default function CollectionAdmin({ collectionId }: PropTypes) {
    return (
        <div className={styles.CollectionAdmin}>
            <div className={styles.upload}>
                <Form title="Upload image" createText="upload" action={create.bind(null, collectionId)}>
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
                    <Form title="Upload multiple" createText="upload" action={create.bind(null, collectionId)}>
                        <Dropzone label="upload images" name="images"/>
                    </Form>
                </PopUp>
            </div>
            <Form title="Edit collection" createText="update" action={update.bind(null, collectionId)}>
                <TextInput color="black" label="collection name" name="name" />
                <TextInput color="black" label="description" name="description" />
            </Form>
        </div>
    )
}
