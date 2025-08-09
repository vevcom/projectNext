import styles from './page.module.scss'
import ShowAndEditName from './ShowAndEditName'
import RegistrationUI from './RegistrationUI'
import RegistrationsList from './RegistrationsList'
import ManualRegistrationForm from './ManualRegistrationForm'
import CreateOrUpdateEventForm from '@/app/events/CreateOrUpdateEventForm'
import { readEventAction } from '@/actions/events/read'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'
import { displayDate } from '@/lib/dates/displayDate'
import Form from '@/components/Form/Form'
import EventTag from '@/components/Event/EventTag'
import { destroyEventAction } from '@/actions/events/destroy'
import { SettingsHeaderItemPopUp, UsersHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readEventTagsAction } from '@/actions/events/tags/read'
import { QueryParams } from '@/lib/query-params/queryParams'
import { bindParams } from '@/actions/bind'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import Link from 'next/link'
import { faCalendar, faExclamation, faLocationDot, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type PropTypes = {
    params: Promise<{
        order: string,
        name: string
    }>
}

export default async function Event({ params }: PropTypes) {
    const event = unwrapActionReturn(await readEventAction({
        name: decodeURIComponent((await params).name),
        order: parseInt((await params).order, 10),
    }))

    const tags = unwrapActionReturn(await readEventTagsAction())

    const ownRegitration = event.eventRegistrations.length ? event.eventRegistrations[0] : undefined

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
                    {event.takesRegistration && <UsersHeaderItemPopUp scale={30} PopUpKey="Users">
                        <ManualRegistrationForm eventId={event.id} />
                    </UsersHeaderItemPopUp>}
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
                <p>
                    <FontAwesomeIcon icon={faLocationDot} />
                    {event.location}
                </p>
                {event.takesRegistration ? <>
                    <p>
                        <FontAwesomeIcon icon={faUsers} />
                        {event.numOfRegistrations} / {event.places}
                    </p>
                    <p>
                        Påmelding start: {displayDate(event.registrationStart)}
                    </p>
                    <p>
                        Påmelding slutt: {displayDate(event.registrationEnd)}
                    </p>
                    {event.waitingList && <p>
                        På venteliste: {event.numOnWaitingList}
                    </p>}
                    <RegistrationUI event={event} registration={ownRegitration} onWaitingList={event.onWaitingList} />
                </> : <p>
                    <FontAwesomeIcon icon={faExclamation} />
                    Dette arrangementet tar ikke påmeldinger
                </p>}

            </aside>
            <main>
                <CmsParagraph cmsParagraph={event.paragraph} />
            </main>

            {event.takesRegistration && (
                <div className={styles.registrationList}>
                    <RegistrationsList event={event} />
                </div>
            )}
        </div>
    )
}
