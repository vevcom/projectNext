'use client'

import { createBookingPeriodAction } from '@/actions/cabin'
import Form from '@/app/_components/Form/Form'
import DateInput from '@/app/_components/UI/DateInput'
import { SelectString } from '@/app/_components/UI/Select'
import TextInput from '@/app/_components/UI/TextInput'
import type { BookingPeriodType } from '@prisma/client'


export default function BookingPeriodForm() {
    const options: { value: BookingPeriodType, label: string }[] = [
        { value: 'ROOM', label: 'Rom' },
        { value: 'CABIN', label: 'Hele hytta' },
        { value: 'EVENT', label: 'Arrangement' },
        { value: 'RESERVED', label: 'Reservert' }
    ]
    return <Form
        action={createBookingPeriodAction.bind(null, {})}
        submitText="Opprett ny Booking periode"
    >
        <DateInput name="start" label="Startdato (Inkluderende)" />
        <DateInput name="end" label="Sluttdato (Ekskluderende)" />
        <SelectString name="type" label="Type" options={options} />
        <TextInput name="notes" label="Kommentarer" />
    </Form>
}
