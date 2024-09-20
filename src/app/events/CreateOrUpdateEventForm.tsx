'use client'
import { SelectString } from '@/components/UI/Select'
import DateInput from '@/components/UI/DateInput'
import Slider from '@/components/UI/Slider'
import NumberInput from '@/components/UI/NumberInput'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { CanBeViewdByOptions } from '@/services/events/ConfigVars'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Event } from '@prisma/client'
import { updateEventAction } from '@/actions/events/update'
import { createEventAction } from '@/actions/events/create'

type PropTypes = {
    event?: Event
}

/**
 * If an event is provided, the form will update the event.
 * If no event is provided, the form will create a new event.
 * @param event - The event to update
 * @returns 
 */
export default function CreateOrUpdateEventForm({ event }: PropTypes) {
    const [showRegistrationOptions, setShowRegistrationOptions] = useState(false)
    const action = event ? updateEventAction.bind(null, { id: event.id }) : createEventAction

    const handleShowRegistration = (event: ChangeEvent<HTMLInputElement>) => {
        setShowRegistrationOptions(event.target.checked)
    }

    return (
        <Form
            closePopUpOnSuccess="EditEvent"
            action={action}
            submitText={event ? 'Oppdater' : 'Opprett'}
            navigateOnSuccess={
                data => data?.name ? `/events/${data.order}/${encodeURIComponent(data.name)}` : '/events'
            }
        >
            <TextInput label="Navn" name="name" defaultValue={event?.name} />
            <SelectString
                label="Hvem kan se"
                name="canBeViewdBy"
                options={CanBeViewdByOptions}
                defaultValue={event?.canBeViewdBy}
            />
            <DateInput label="Start" name="eventStart" includeTime defaultValue={event?.eventStart}/>
            <DateInput label="Slutt" name="eventEnd" includeTime defaultValue={event?.eventEnd}/>

            <Slider 
                label="Med registrering" 
                name="takesRegistration" 
                onChange={handleShowRegistration} 
                defaultChecked={event?.takesRegistration}
            />
            {
                showRegistrationOptions ? (
                    <>
                        <NumberInput 
                            label="plasser" 
                            name="places" 
                            defaultValue={event?.places} 
                        />
                        <DateInput 
                            label="Registrering Start" 
                            name="registrationStart" 
                            defaultValue={event?.registrationStart}
                            includeTime
                        />
                        <DateInput 
                            label="Registrering Slutt" 
                            name="registrationEnd" 
                            defaultValue={event?.registrationEnd}
                            includeTime
                        />
                    </>
                ) : <></>
            }
        </Form>
    )
}