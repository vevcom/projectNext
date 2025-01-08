'use client'
import styles from './CreateOrUpdateEventForm.module.scss'
import Checkbox from '@/components/UI/Checkbox'
import { SelectString } from '@/components/UI/Select'
import DateInput from '@/components/UI/DateInput'
import Slider from '@/components/UI/Slider'
import NumberInput from '@/components/UI/NumberInput'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { CanBeViewdByOptions } from '@/services/events/ConfigVars'
import { updateEventAction } from '@/actions/events/update'
import { createEventAction } from '@/actions/events/create'
import EventTag from '@/components/Event/EventTag'
import { bindParams } from '@/actions/bindParams'
import { useState } from 'react'
import type { Event, EventTag as EventTagT } from '@prisma/client'
import type { ChangeEvent } from 'react'

type PropTypes = {
    event?: Event & { tags: EventTagT[] }
    eventTags: EventTagT[]
}

/**
 * If an event is provided, the form will update the event.
 * If no event is provided, the form will create a new event.
 * @param event - The event to update
 * @param eventTags - The tags to choose from
 * @returns
 */
export default function CreateOrUpdateEventForm({ event, eventTags }: PropTypes) {
    const [showRegistrationOptions, setShowRegistrationOptions] = useState(event?.takesRegistration ?? false)
    const action = event ? bindParams(updateEventAction, { id: event.id }) : bindParams(createEventAction, {})

    const handleShowRegistration = (changeEvent: ChangeEvent<HTMLInputElement>) => {
        setShowRegistrationOptions(changeEvent.target.checked)
    }

    return (
        <div className={styles.CreateOrUpdateEventForm}>
            <h1>Oppdater Hendelse</h1>
            <Form
                closePopUpOnSuccess="EditEvent"
                action={action}
                submitText={event ? 'Oppdater' : 'Opprett'}
                refreshOnSuccess
                navigateOnSuccess={
                    data => (data?.name ? `/events/${data.order}/${encodeURIComponent(data.name)}` : '/events')
                }
            >
                <TextInput label="Navn" name="name" defaultValue={event?.name} />
                <SelectString
                    className={styles.canBeViewdBy}
                    label="Hvem kan se"
                    name="canBeViewdBy"
                    options={CanBeViewdByOptions}
                    defaultValue={event?.canBeViewdBy}
                />
                <DateInput label="Start" name="eventStart" includeTime defaultValue={event?.eventStart}/>
                <DateInput label="Slutt" name="eventEnd" includeTime defaultValue={event?.eventEnd}/>
                <ul className={styles.tags}>
                    <h2>Tags</h2>
                    {
                        eventTags.map(tag => (
                            <li key={tag.id}>
                                <Checkbox
                                    name="tagIds"
                                    value={tag.id}
                                    defaultChecked={event ? event.tags.map(t => t.name).includes(tag.name) : false}
                                >
                                    <EventTag eventTag={tag} />
                                </Checkbox>
                            </li>
                        ))
                    }
                </ul>
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
        </div>
    )
}
