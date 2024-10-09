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
import Link from 'next/link'
import { QueryParams } from '@/lib/query-params/queryParams'

type PropTypes = {
    eventTags: EventTagT[]
    canUpdate?: boolean
    canCreate?: boolean
    selectedTags: EventTagT[]
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
    selectedTags,
    canUpdate = false,
    canCreate = false,
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
                            <Link 
                                className={selectedTags.map(tag => tag.name).includes(tag.name) ? styles.selected : ''}
                                href={
                                    selectedTags.map(tag => tag.name).includes(tag.name) ? 
                                    '/events' + QueryParams.eventTags.encodeUrl(
                                        selectedTags.filter(t => t.name !== tag.name).map(t => t.name)
                                    ) :
                                    '/events' + QueryParams.eventTags.encodeUrl(
                                        [...selectedTags.map(tag => tag.name), tag.name]
                                    )
                                }
                            >
                                <EventTag eventTag={tag} />
                            </Link>
                            {
                                canUpdate && (
                                    <SettingsHeaderItemPopUp scale={25} PopUpKey={`EventTagPopUp${tag.id}`}>
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
                                                    defaultValueRGB={{
                                                        r: tag.colorR,
                                                        g: tag.colorG,
                                                        b: tag.colorB
                                                    }}
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
