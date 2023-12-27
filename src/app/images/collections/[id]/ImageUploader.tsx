import create from '@/actions/images/create'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'

type PropTypes = {
    collectionId: number
}   

export default function ImageUploader({collectionId}: PropTypes) {
    return (
        <Form action={create.bind(null, collectionId)}>
            <input type="file" name="file" />
            <TextInput label="name" name="name" />
            <TextInput label="alt" name="alt" />
        </Form>
    )
}
