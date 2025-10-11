import EventTag from './EventTag'
import styles from './EventTagsAdmin.module.scss'
import Form from '@/components/Form/Form'
import { SettingsHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import TextInput from '@/UI/TextInput'
import Textarea from '@/UI/Textarea'
import ColorInput from '@/UI/ColorInput'
import { QueryParams } from '@/lib/queryParams/queryParams'
import { bindParams } from '@/services/actionBind'
import { destroyEventTagAction, updateEventTagAction, createEventTagAction } from '@/services/events/tags/actions'
import Link from 'next/link'
import type { EventTag as EventTagT } from '@prisma/client'

type PropTypes = {
    eventTags: EventTagT[]
    canUpdate?: boolean
    canCreate?: boolean
    canDestroy?: boolean
    selectedTags: EventTagT[]
    page: 'EVENT' | 'EVENT_ARCHIVE'
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
    canDestroy = false,
    page
}: PropTypes) {
    const baseUrl = page === 'EVENT' ? '/events' : '/events/archive'

    const removeFromUrl = (tag: string) => (selectedTags.length === 1 ?
        baseUrl :
        `${baseUrl}?${QueryParams.eventTags.encodeUrl(
            selectedTags.filter(tagItem => tagItem.name !== tag).map(tagItem => tagItem.name)
        )}`)
    const addToUrl = (tag: string) => `${baseUrl}?${QueryParams.eventTags.encodeUrl(
        [...selectedTags.map(tagItem => tagItem.name), tag]
    )}`
    return (
        <div className={styles.EventTagsAdmin}>
            <h1>Tagger</h1>
            {
                canCreate && (
                    <span className={styles.create}>
                        <Form refreshOnSuccess action={createEventTagAction} submitText="Lag">
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
                                className={
                                    selectedTags.map(tagItem => tagItem.name).includes(tag.name) ? styles.selected : ''
                                }
                                href={
                                    selectedTags.map(tagItem => tagItem.name).includes(tag.name) ?
                                        removeFromUrl(tag.name) : addToUrl(tag.name)
                                }
                            >
                                <EventTag eventTag={tag} />
                            </Link>
                            {
                                canUpdate || canDestroy ? (
                                    <SettingsHeaderItemPopUp scale={25} PopUpKey={`EventTagPopUp${tag.id}`}>
                                        {canUpdate && <span className={styles.update}>
                                            <Form
                                                refreshOnSuccess
                                                action={bindParams(updateEventTagAction, ({ id: tag.id }))}
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
                                                        red: tag.colorR,
                                                        green: tag.colorG,
                                                        blue: tag.colorB
                                                    }}
                                                />
                                            </Form>
                                        </span>
                                        }
                                        {canDestroy && <span className={styles.destroy}>
                                            <Form
                                                closePopUpOnSuccess={`EventTagPopUp${tag.id}`}
                                                refreshOnSuccess
                                                action={bindParams(destroyEventTagAction, ({ id: tag.id }))}
                                                submitColor="red"
                                                confirmation={{
                                                    confirm: true,
                                                    text: 'Er du sikker på at du vil slette denne taggen?'
                                                }}
                                                submitText="Slett"
                                            />
                                        </span>
                                        }
                                    </SettingsHeaderItemPopUp>
                                ) : <></>
                            }
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
