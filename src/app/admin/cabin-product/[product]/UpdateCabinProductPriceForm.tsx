'use client'
import { createCabinProductpriceAction } from '@/actions/cabin'
import Form from '@/app/_components/Form/Form'
import DateInput from '@/app/_components/UI/DateInput'
import NumberInput from '@/app/_components/UI/NumberInput'
import TextInput from '@/app/_components/UI/TextInput'


export function UpdateCabinProductPriceForm({
    productId,
}: {
    productId: number
}) {
    return <Form
        action={createCabinProductpriceAction.bind(null, { cabinProductId: productId })}
        submitText="Legg til pris"
    >
        <TextInput name="description" label="Beskrivelse" />
        <NumberInput name="price" label="Pris" defaultValue={100} />
        <DateInput name="validFrom" label="Når blir prisen gyldig" />
        <TextInput name="cronInterval" label="Cron intervall for gyldighet" />
    </Form>
}
