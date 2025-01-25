import Form from '@/components/Form/Form'
import { createImageAction } from '@/actions/images/create'
import TextInput from '@/components/UI/TextInput'
import FileInput from '@/components/UI/FileInput'
import LicenseChooser from '@/components/LicenseChooser/LicenseChooser'
import { bindParams } from '@/actions/bind'
import type { PropTypes as FormPropTypes } from '@/components/Form/Form'

type ResponseType = Awaited<ReturnType<typeof createImageAction>>;
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
            action={bindParams(createImageAction, { collectionId })}
            closePopUpOnSuccess="UploadImages"
            {...formProps}
        >
            <TextInput color="black" label="navn" name="name" />
            <TextInput color="black" label="alternativ tekst" name="alt" />
            <TextInput color="black" label="Kreditert" name="credit" />
            <LicenseChooser />
            <FileInput label="fil" name="file" color="primary" />
        </Form>
    )
}
