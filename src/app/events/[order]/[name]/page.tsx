import { readEvent } from '@/actions/events/read'
import styles from './page.module.scss'
import CmsImage from '@/app/_components/Cms/CmsImage/CmsImage'
import CmsParagraph from '@/app/_components/Cms/CmsParagraph/CmsParagraph'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faExclamation } from '@fortawesome/free-solid-svg-icons'
import ShowAndEditName from './ShowAndEditName'
import { displayDate } from '@/dates/displayDate'
import Form from '@/app/_components/Form/Form'
import { destroyEvent } from '@/actions/events/destroy'
import { SettingsHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import CreateOrUpdateEventForm from '../../CreateOrUpdateEventForm'

type PropTypes = {
    params: {
        order: string,
        name: string
    }
}

export default async function Event({ params }: PropTypes) {
    const res = await readEvent({
        name: decodeURIComponent(params.name),
        order: parseInt(params.order)
    })
    if (!res.success) {
        throw new Error('Failed to read event')
    }
    const event = res.data

    return (
        <div className={styles.wrapper}>
            <span className={styles.coverImage}>
                <CmsImage cmsImage={event.coverImage} width={900} />
                <div className={styles.infoInImage}>
                    <ShowAndEditName event={event} />
                </div>
                <div className={styles.settings}>
                    <SettingsHeaderItemPopUp PopUpKey="EditEvent">
                        <CreateOrUpdateEventForm event={event} />
                        {/*TODO: Use auther to only display if it can be destroyd*/}
                        <Form 
                            action={destroyEvent.bind(null, { id: event.id })}
                            navigateOnSuccess="/events"
                            className={styles.destroyForm}
                            buttonClassName={styles.destroyButton}
                            submitText='Slett'
                            submitColor='red'
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
                    <p>
                        {event.places}
                    </p>
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