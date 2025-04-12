'use client'
import { createCabinProductPriceAction } from '@/actions/cabin'
import Form from '@/app/_components/Form/Form'
import NumberInput from '@/app/_components/UI/NumberInput'
import TextInput from '@/app/_components/UI/TextInput'
import type { BookingType } from '@prisma/client'


export function UpdateCabinProductPriceForm({
    productId,
    productType,
}: {
    productId: number
    productType: BookingType,
}) {
    return <Form
        action={createCabinProductPriceAction.bind(null, { cabinProductId: productId })}
        submitText="Legg til pris"
    >
        <TextInput name="description" label="Beskrivelse" />
        <NumberInput name="price" label="Pris" defaultValue={100} min={0} />
        <TextInput name="cronInterval" label="Cron intervall for gyldighet" defaultValue="* * *" />
        {productType === 'CABIN' &&
            <NumberInput name="memberShare" label="Medlemsandel" defaultValue={0} />
        }
        {productType !== 'CABIN' &&
            <input type="hidden" name="memberShare" value={0} />
        }
    </Form>
}
