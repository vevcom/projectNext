import { readEvent } from '@/actions/events/read'
import styles from './page.module.scss'
import CmsImage from '@/app/_components/Cms/CmsImage/CmsImage'
import CmsParagraph from '@/app/_components/Cms/CmsParagraph/CmsParagraph'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faExclamation } from '@fortawesome/free-solid-svg-icons'
import ShowAndEditName from './ShowAndEditName'

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
            </span>
            <aside>
                <p>
                    <FontAwesomeIcon icon={faCalendar} />
                    {event.eventStart.toDateString()} - {event.eventEnd.toDateString()}
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