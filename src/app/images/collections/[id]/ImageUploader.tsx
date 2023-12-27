import create from '@/actions/images/create'
import Form from '@/app/components/Form/Form'

type PropTypes = {
    collection: number
}   

export default function ImageUploader({collection}: PropTypes) {
    return (
        <Form action={create.bind(null, collection)}>
            <input type="file" name="file" />
            <input type="text" placeholder="name" name="name" />
            <input type="text" placeholder="alt" name="alt" />
        </Form>
    )
}
