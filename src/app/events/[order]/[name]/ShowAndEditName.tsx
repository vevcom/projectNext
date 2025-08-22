'use client'
import styles from './ShowAndEditName.module.scss'
import EditableTextField from '@/components/EditableTextField/EditableTextField'
import { updateEventAction } from '@/services/events/actions'
import type { Event } from '@prisma/client'

type PropTypes = {
    event: Event
}

export default function ShowAndEditName({ event }: PropTypes) {
    const updateAction = updateEventAction.bind(null, ({ id: event.id }))

    return (
        <EditableTextField
            formProps={{
                action: updateAction,
                navigateOnSuccess: data => (data?.name
                    ? `/events/${event.order}/${encodeURIComponent(data.name)}`
                    : '/events'),
            }}
            editable={true} //TODO: auther
            inputName="name"
            submitButton={{
                text: 'Lagre',
                className: styles.submitButton
            }}
        >
            <h1>{event.name}</h1>
        </EditableTextField>
    )
}
