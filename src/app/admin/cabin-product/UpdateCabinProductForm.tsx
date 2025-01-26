'use client'
import { createCabinProductAction } from '@/actions/cabin'
import Form from '@/app/_components/Form/Form'
import NumberInput from '@/app/_components/UI/NumberInput'
import RadioLarge from '@/app/_components/UI/RadioLarge'
import TextInput from '@/app/_components/UI/TextInput'


export function UpdateCabinProductForm() {
    return <Form
        action={createCabinProductAction}
        submitText="Opprett nytt produkt"
    >
        <TextInput name="name" label="Produkt navn" />
        <RadioLarge name="type" options={[
            {
                value: 'CABIN',
                label: 'Hele Hytta'
            },
            {
                value: 'BED',
                label: 'Seng'
            }
        ]} />
        <NumberInput name="amount" label="Antall på hytta" defaultValue={1} />
    </Form>
}
