import styles from './page.module.scss'
import ShowAndEditName from './ShowAndEditName'
import RegistrationUI from './RegistrationUI'
import RegistrationsList from './RegistrationsList'
import ManualRegistrationForm from './ManualRegistrationForm'
import Date from '@/components/Date/Date'
import CreateOrUpdateEventForm from '@/app/events/CreateOrUpdateEventForm'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'
import Form from '@/components/Form/Form'
import EventTag from '@/components/Event/EventTag'
import { SettingsHeaderItemPopUp, UsersHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { QueryParams } from '@/lib/queryParams/queryParams'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readEventTagsAction } from '@/services/events/tags/actions'
import {
    destroyEventAction,
    readEventAction,
    updateEventCmsCoverImageAction,
    updateEventParagraphContentAction
} from '@/services/events/actions'
import { configureAction } from '@/services/configureAction'
import { decodeVevenUriHandleError } from '@/lib/urlEncoding'
import { ServerSession } from '@/auth/session/ServerSession'
import { eventAuth } from '@/services/events/auth'
import Link from 'next/link'
import { faCalendar, faExclamation, faLocationDot, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type PropTypes = {
    params: Promise<{
        nameAndId: string
    }>
}

export default async function Event({ params }: PropTypes) {
    const event = unwrapActionReturn(await readEventAction({
        params: {
            id: decodeVevenUriHandleError((await params).nameAndId)
        }
    }))

    const tags = unwrapActionReturn(await readEventTagsAction())

    const ownRegistration = event.eventRegistrations.length ? event.eventRegistrations[0] : undefined

    const canEditCmsCoverImage = eventAuth.updateCmsCoverImage.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).toJsObject()
    const canEditCmsParagraph = eventAuth.updateParagraphContent.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).toJsObject()
    const canDestroy = eventAuth.destroy.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).toJsObject()

    return (
        <div className={styles.wrapper}>
            <span className={styles.coverImage}>
                <CmsImage
                    canEdit={canEditCmsCoverImage}
                    cmsImage={event.coverImage}
                    width={900}
                    updateCmsImageAction={
                        configureAction(
                            updateEventCmsCoverImageAction,
                            { implementationParams: { eventId: event.id } }
                        )}
                />
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
                    {event.takesRegistration && <UsersHeaderItemPopUp scale={30} popUpKey="Users">
                        <ManualRegistrationForm eventId={event.id} />
                    </UsersHeaderItemPopUp>}
                    <SettingsHeaderItemPopUp scale={30} popUpKey="EditEvent">
                        <CreateOrUpdateEventForm event={event} eventTags={tags} />
                        { canDestroy.authorized &&
                            <Form
                                action={configureAction(destroyEventAction, { params: { id: event.id } })}
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
                        }
                    </SettingsHeaderItemPopUp>
                </div>
            </span>
            <aside>
                <p>
                    <FontAwesomeIcon icon={faCalendar} />
                    <Date date={event.eventStart} includeTime /> - <Date date={event.eventEnd} includeTime />
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
                        Påmelding start: <Date date={event.registrationStart} includeTime />
                    </p>
                    <p>
                        Påmelding slutt: <Date date={event.registrationEnd} includeTime />
                    </p>
                    {event.waitingList && <p>
                        På venteliste: {event.numOnWaitingList}
                    </p>}
                    <RegistrationUI event={event} registration={ownRegistration} onWaitingList={event.onWaitingList} />
                </> : <p>
                    <FontAwesomeIcon icon={faExclamation} />
                    Dette arrangementet tar ikke påmeldinger
                </p>}

            </aside>
            <main>
                <CmsParagraph
                    canEdit={canEditCmsParagraph}
                    cmsParagraph={event.paragraph}
                    updateCmsParagraphAction={
                        configureAction(
                            updateEventParagraphContentAction,
                            { implementationParams: { eventId: event.id } }
                        )
                    }
                />
            </main>

            {event.takesRegistration && (
                <div className={styles.registrationList}>
                    <RegistrationsList event={event} />
                </div>
            )}
        </div>
    )
}
