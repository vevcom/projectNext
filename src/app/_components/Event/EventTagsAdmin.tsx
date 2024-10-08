import type { EventTag as EventTagT } from '@prisma/client'
import EventTag from './EventTag'
import styles from './EventTagsAdmin.module.scss'
import Form from '../Form/Form'
import { createEventTagAction } from '@/actions/events/tags/create'
import TextInput from '@/UI/TextInput'
import Textarea from '@/UI/Textarea'
import ColorInput from '@/UI/ColorInput'

type PropTypes = {
    eventTags: EventTagT[]
}

/**
 * Component that displays tags.
 * @param eventTags - the tags to display
 * @returns 
 */
export default function EventTagsAdmin({ eventTags }: PropTypes) {
    return (
        <div className={styles.EventTagsAdmin}>
            <span className={styles.create}>
                <Form action={createEventTagAction} submitText='Lag'>
                    <TextInput name="name" label="Navn" />
                    <Textarea name="description" label="Beskrivelse" />
                    <ColorInput name="color" label="Farge"/>
                </Form>
            </span>
            <ul>
            {
                eventTags.map((tag, index) => (
                    <li key={index} >
                        <EventTag eventTag={tag} />
                    </li>
                ))
            }
            </ul>
        </div>   
    )
}
