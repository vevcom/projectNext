'use client'
import styles from './CreateOrUpdateEventForm.module.scss'
import Checkbox from '@/components/UI/Checkbox'
import { SelectString } from '@/components/UI/Select'
import DateInput from '@/components/UI/DateInput'
import Slider from '@/components/UI/Slider'
import NumberInput from '@/components/UI/NumberInput'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import EventTag from '@/components/Event/EventTag'
import { createEventAction, updateEventAction } from '@/services/events/actions'
import { eventCanBeViewdByOptions } from '@/services/events/constants'
import { FIELD_IS_PRESENT_VALUE } from '@/lib/fields/constants'
import { configureAction } from '@/services/configureAction'
import { formatVevenUri } from '@/lib/urlEncoding'
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
    const action = event ? configureAction(updateEventAction, { params: { id: event.id } }) : createEventAction

    const handleShowRegistration = (changeEvent: ChangeEvent<HTMLInputElement>) => {
        setShowRegistrationOptions(changeEvent.target.checked)
    }

    return (
        <div className={styles.CreateOrUpdateEventForm}>
            <h1>{event ? 'Endre' : 'Opprett'} arrangement</h1>
            <Form
                closePopUpOnSuccess="EditEvent"
                action={action}
                submitText={event ? 'Oppdater' : 'Opprett'}
                refreshOnSuccess
                navigateOnSuccess={
                    data => (data?.name ? `/events/${formatVevenUri(data.name, data.id)}` : '/events')
                }
            >
                <TextInput label="Navn" name="name" defaultValue={event?.name} />
                <TextInput label="Sted" name="location" defaultValue={event?.location ?? ''} />
                <SelectString
                    className={styles.canBeViewdBy}
                    label="Hvem kan se"
                    name="canBeViewdBy"
                    options={eventCanBeViewdByOptions}
                    defaultValue={event?.canBeViewdBy}
                />
                <DateInput label="Start" name="eventStart" includeTime defaultValue={event?.eventStart} />
                <DateInput label="Slutt" name="eventEnd" includeTime defaultValue={event?.eventEnd} />
                <ul className={styles.tags}>
                    <h2>Tags</h2>
                    {
                        eventTags.map(tag => (
                            <li key={tag.id}>
                                <Checkbox
                                    name="tagIds"
                                    value={tag.id}
                                    defaultChecked={
                                        event
                                            ? event.tags.map(tagItem => tagItem.name).includes(tag.name)
                                            : false
                                    }
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

                {showRegistrationOptions ? <>
                    <Slider
                        label="Venteliste"
                        name="waitingList"
                        defaultChecked={event?.waitingList}
                    />
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
                </> : <>
                    <input type="hidden" name="waitingList" value={FIELD_IS_PRESENT_VALUE} />
                </>}
            </Form>
        </div>
    )
}
