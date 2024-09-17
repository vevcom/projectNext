'use client'
import { SelectString } from '@/components/UI/Select'
import DateInput from '@/components/UI/DateInput'
import Slider from '@/components/UI/Slider'
import NumberInput from '@/components/UI/NumberInput'
import Form from '@/components/Form/Form'
import { createEventAction } from '@/actions/events/create'
import TextInput from '@/components/UI/TextInput'
import { CanBeViewdByOptions } from '@/services/events/ConfigVars'
import { useState } from 'react'
import type { ChangeEvent } from 'react'

export default function CreateEventForm() {
    const [showRegistrationOptions, setShowRegistrationOptions] = useState(false)

    const handleShowRegistration = (event: ChangeEvent<HTMLInputElement>) => {
        setShowRegistrationOptions(event.target.checked)
    }

    return (
        <Form
            action={createEventAction}
        >
            <TextInput label="Navn" name="name" />
            <SelectString
                label="Hvem kan se"
                name="canBeViewdBy"
                options={CanBeViewdByOptions}
            />
            <DateInput label="Start" name="eventStart" />
            <DateInput label="Slutt" name="eventEnd" />

            <Slider label="Med registrering" name="takesRegistration" onChange={handleShowRegistration}/>
            {
                showRegistrationOptions ? (
                    <>
                        <NumberInput label="plasser" name="places" />
                        <DateInput label="Registrering Start" name="registrationStart" />
                        <DateInput label="Registrering Slutt" name="registrationEnd" />
                    </>
                ) : <></>
            }
        </Form>
    )
}
