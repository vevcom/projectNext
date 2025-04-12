'use client'

import { createPricePeriodAction } from '@/actions/cabin'
import Form from '@/app/_components/Form/Form'
import DateInput from '@/app/_components/UI/DateInput'


export default function PricePeriodForm() {
    return <Form
        action={createPricePeriodAction}
        submitText="Lag ny pris periode"
    >
        <DateInput name="validFrom" label="Start dato" />
    </Form>
}
