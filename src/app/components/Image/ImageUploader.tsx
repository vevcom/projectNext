import Form from '@/components/Form/Form'
import { createImageAction } from '@/actions/images/create'
import TextInput from '@/components/UI/TextInput'
import FileInput from '@/components/UI/FileInput'
import type { PropTypes as FormPropTypes } from '@/components/Form/Form'

type ResponseType = Awaited<ReturnType<typeof createImage>>;
type T = Pick<ResponseType & { success: true }, 'data'>['data']

type PropTypes = Omit<FormPropTypes<T, true>, 'action' | 'submitText' | 'title'> & {
    collectionId: number,
}

/**
 * A component to upload one image to a collection
 * @param collectionId - The id of the collection to upload the image to
 * @param formProps - The props to pass to the form
 * @returns
 */
export default function ImageUploader({ collectionId, ...formProps }: PropTypes) {
    return (
        <Form
            title="last opp bilde"
            submitText="last opp"
            action={createImageAction.bind(null, collectionId)}
            {...formProps}
        >
            <TextInput color="black" label="navn" name="name" />
            <TextInput color="black" label="alternativ tekst" name="alt" />
            <FileInput label="fil" name="file" color="primary" />
        </Form>
    )
}
