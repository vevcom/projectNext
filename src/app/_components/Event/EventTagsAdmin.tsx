import type { EventTag as EventTagT } from '@prisma/client'
import EventTag from './EventTag'

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
        <ul>
            {
                eventTags.map((tag, index) => (
                    <li key={index} >
                        <EventTag eventTag={tag} />
                    </li>
                ))
            }
        </ul>
    )
}
