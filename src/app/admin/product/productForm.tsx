import { createProduct } from '@/actions/shop'
import Form from '@/app/_components/Form/Form'
import TextInput from '@/app/_components/UI/TextInput'


export default function ProductForm() {
    return <Form
        action={createProduct.bind(null, {})}
        submitText="Lag nytt produkt"
        refreshOnSuccess
    >
        <TextInput name="name" label="Navn" />
        <TextInput name="description" label="Beskrivelse"/>
        <TextInput name="barcode" label="Strekkode"/>
    </Form>
}
