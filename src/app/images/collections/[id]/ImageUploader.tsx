import create from '@/actions/images/create'
import Form from '@/app/components/Form/Form'
import FileInput from '@/app/components/UI/FileInput'
import TextInput from '@/app/components/UI/TextInput'

type PropTypes = {
    collectionId: number
}   

export default function ImageUploader({collectionId}: PropTypes) {
    return (
        <Form action={create.bind(null, collectionId)}>
            <FileInput label="file" name="file" color='secondary' />
            <TextInput label="name" name="name" />
            <TextInput label="alt" name="alt" />
        </Form>
    )
}
