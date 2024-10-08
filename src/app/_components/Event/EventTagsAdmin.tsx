import EventTag from './EventTag'
import styles from './EventTagsAdmin.module.scss'
import Form from '@/components/Form/Form'
import { SettingsHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { createEventTagAction } from '@/actions/events/tags/create'
import TextInput from '@/UI/TextInput'
import Textarea from '@/UI/Textarea'
import ColorInput from '@/UI/ColorInput'
import { updateEventTagAction } from '@/actions/events/tags/update'
import type { EventTag as EventTagT } from '@prisma/client'

type PropTypes = {
    eventTags: EventTagT[]
    canUpdate?: boolean
    canCreate?: boolean
}

/**
 * Component that displays tags and admin for admins.
 * @param eventTags - the tags to display
 * @param canUpdate - if the user can update the tags
 * @param canCreate - if the user can create new tags
 * @returns
 */
export default function EventTagsAdmin({
    eventTags,
    canUpdate = false,
    canCreate = false
}: PropTypes) {
    return (
        <div className={styles.EventTagsAdmin}>
            <h1>Tagger</h1>
            {
                canCreate && (
                    <span className={styles.create}>
                        <Form refreshOnSuccess action={createEventTagAction.bind(null, {})} submitText="Lag">
                            <TextInput name="name" label="Navn" />
                            <Textarea name="description" label="Beskrivelse" />
                            <ColorInput name="color" label="Farge"/>
                        </Form>
                    </span>
                )
            }
            <ul>
                {
                    eventTags.map((tag, index) => (
                        <li key={index} >
                            <EventTag eventTag={tag} />
                            {
                                canUpdate && (
                                    <SettingsHeaderItemPopUp PopUpKey={`EventTagPopUp${tag.id}`}>
                                        <span className={styles.update}>
                                            <Form
                                                refreshOnSuccess
                                                action={updateEventTagAction.bind(null, { id: tag.id })}
                                                submitText="Oppdater"
                                            >
                                                <TextInput
                                                    name="name"
                                                    label="Navn"
                                                    defaultValue={tag.name}
                                                />
                                                <Textarea
                                                    name="description"
                                                    label="Beskrivelse"
                                                    defaultValue={tag.description}
                                                />
                                                <ColorInput
                                                    name="color"
                                                    label="Farge"
                                                />
                                            </Form>
                                        </span>
                                    </SettingsHeaderItemPopUp>
                                )
                            }
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
