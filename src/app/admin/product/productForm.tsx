import { createProduct, updateProduct } from '@/actions/shop'
import Form from '@/app/_components/Form/Form'
import TextInput from '@/app/_components/UI/TextInput'
import type { Product } from '@prisma/client'


export default function ProductForm({
    product
}: {
    product?: Product
}) {
    const submitForm = product
        ? updateProduct.bind(null, {})
        : createProduct.bind(null, {})
    return <Form
        action={submitForm}
        submitText={product ? 'Oppdater produkt' : 'Lag nytt produkt'}
        refreshOnSuccess
    >
        <TextInput name="name" label="Navn" defaultValue={product?.name} />
        <TextInput name="description" label="Beskrivelse" defaultValue={product?.description} />
        <TextInput name="barcode" label="Strekkode" defaultValue={product?.barcode ? product.barcode : ''} />
        {product && <input type="hidden" name="productId" value={product.id} /> }
    </Form>
}
