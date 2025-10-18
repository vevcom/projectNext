import { createSelection } from '@/services/createSelection'
import { EventCanView } from '@prisma/client'
import type { Event } from '@prisma/client'

export const eventCanBeViewdBy = {
    ALL: { label: 'Alle' },
    CAN_REGISTER: { label: 'Alle som kan melde seg på' }
} satisfies Record<EventCanView, { label: string }>

export const eventCanBeViewdByOptions = Object.values(EventCanView).map(opt => ({
    value: opt,
    label: eventCanBeViewdBy[opt].label
}))

export const eventFieldsToExpose = [
    'id',
    'name',
    'location',
    'eventStart',
    'eventEnd',
    'places',
    'waitingList',
    'registrationStart',
    'registrationEnd',
    'canBeViewdBy',
    'takesRegistration'
] as const satisfies (keyof Event)[]

export const eventFilterSelection = {
    ...createSelection(eventFieldsToExpose),
    _count: {
        select: {
            eventRegistrations: true,
        },
    },
} as const
