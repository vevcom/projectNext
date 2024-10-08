import { EventTag } from '@prisma/client'

type PropTypes = {
    eventTags: EventTag[]
}

/**
 * Component that displays tags.
 * @param eventTags - the tags to display
 * @returns 
 */
export default function EventTagsAdmin({ eventTags }: PropTypes) {
    return (
        <div>
            {
                eventTags.map((tag, index) => (
                    <div key={index}>
                        {tag.name}
                    </div>
                ))
            }
        </div>
    )
}
