import React from 'react'
import { TagHeasderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PopUpProvider from '@/contexts/PopUp'
import EventTagsAdmin from '@/components/Event/EventTagsAdmin'
import { EventTag } from '@prisma/client'

type PropTypes = {
    eventTags: EventTag[],
    currentTags: EventTag[]
    canCreate: boolean
    canUpdate: boolean
    page: 'EVENT' | 'EVENT_ARCHIVE'
}

export default function TagHeaderItem({
    eventTags,
    currentTags,
    canCreate,
    canUpdate,
    page
}: PropTypes) {
    return (
        <TagHeasderItemPopUp scale={35} PopUpKey="TagEventPopUp">
            <PopUpProvider>
                <EventTagsAdmin
                    canCreate={canCreate}
                    canUpdate={canUpdate}
                    eventTags={eventTags}
                    selectedTags={currentTags}
                    page={page}
                />
            </PopUpProvider>
        </TagHeasderItemPopUp>
    )
}
