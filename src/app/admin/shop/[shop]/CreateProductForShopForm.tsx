import { createProductForShop } from '@/actions/shop'
import Form from '@/app/_components/Form/Form'
import NumberInput from '@/app/_components/UI/NumberInput'
import TextInput from '@/app/_components/UI/TextInput'


export function CreateProductForShopForm({
    shopId
}: {
    shopId: number
}) {
    return <Form
        action={createProductForShop.bind(null, { shopId })}
        submitText="Legg til produkt"
    >
        <TextInput name="name" label="Navn" />
        <TextInput name="description" label="Beskrivelse" />
        <TextInput name="barcode" label="Strekkode" />
        <NumberInput name="price" label="Pris" />
    </Form>
}
