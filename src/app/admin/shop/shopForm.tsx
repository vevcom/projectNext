import { createShop } from '@/actions/shop'
import Form from '@/app/_components/Form/Form'
import TextInput from '@/app/_components/UI/TextInput'


export default function ShopForm() {
    return <Form
        action={createShop.bind(null, {})}
        submitText="Lag ny butikk"
        refreshOnSuccess
    >
        <TextInput name="name" label="Butikk" />
        <TextInput name="description" label="Beskrivelse" />
    </Form>
}
