import styles from './page.module.scss'
import ShowAndEditName from './ShowAndEditName'
import CreateOrUpdateEventForm from '@/app/events/CreateOrUpdateEventForm'
import { readEventAction } from '@/actions/events/read'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'
import { displayDate } from '@/lib/dates/displayDate'
import Form from '@/components/Form/Form'
import EventTag from '@/components/Event/EventTag'
import { destroyEventAction } from '@/actions/events/destroy'
import { SettingsHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readEventTagsAction } from '@/actions/events/tags/read'
import { QueryParams } from '@/lib/query-params/queryParams'
import { bindParams } from '@/actions/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faExclamation, faUsers } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import RegistrationButton from './RegistrationButton'

type PropTypes = {
    params: Promise<{
        order: string,
        name: string
    }>
}

export default async function Event({ params }: PropTypes) {
    const eventRes = await readEventAction({
        name: decodeURIComponent((await params).name),
        order: parseInt((await params).order, 10)
    })
    const tagsRes = await readEventTagsAction()
    if (!eventRes.success || !tagsRes.success) {
        //TODO: Handle error in idiomatic way
        throw new Error('Failed to read event')
    }
    const event = eventRes.data
    const tags = tagsRes.data

    return (
        <div className={styles.wrapper}>
            <span className={styles.coverImage}>
                <CmsImage cmsImage={event.coverImage} width={900} />
                <div className={styles.infoInImage}>
                    <ShowAndEditName event={event} />
                    <ul className={styles.tags}>
                        {event.tags.map(tag => (
                            <li key={tag.id}>
                                <Link href={`/events?${QueryParams.eventTags.encodeUrl([tag.name])}`}>
                                    <EventTag eventTag={tag} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.settings}>
                    <SettingsHeaderItemPopUp scale={30} PopUpKey="EditEvent">
                        <CreateOrUpdateEventForm event={event} eventTags={tags} />
                        {/*TODO: Use auther to only display if it can be destroyd*/}
                        <Form
                            action={bindParams(destroyEventAction, { id: event.id })}
                            navigateOnSuccess="/events"
                            className={styles.destroyForm}
                            buttonClassName={styles.destroyButton}
                            submitText="Slett"
                            submitColor="red"
                            confirmation={{
                                confirm: true,
                                text: 'Er du sikker på at du vil slette dette arrangementet?'
                            }}
                        />
                    </SettingsHeaderItemPopUp>
                </div>
            </span>
            <aside>
                <p>
                    <FontAwesomeIcon icon={faCalendar} />
                    {displayDate(event.eventStart)} - {displayDate(event.eventEnd)}
                </p>
                {
                    event.takesRegistration ? (
                        <>
                            <p>
                                <FontAwesomeIcon icon={faUsers} />
                                {event.places}
                            </p>
                            <RegistrationButton event={event} />
                        </>
                    ) : (
                        <p>
                            <FontAwesomeIcon icon={faExclamation} />
                            Dette arrangementet tar ikke påmeldinger
                        </p>
                    )
                }

            </aside>
            <main>
                <CmsParagraph cmsParagraph={event.paragraph} />
            </main>
        </div>
    )
}
