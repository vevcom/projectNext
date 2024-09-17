import { Event, EventCanView } from '@prisma/client'
import { createSelection } from '../createSelection'

export const CanBeViewdByConfig = {
    ALL: { label: 'Alle' },
    CAN_REGISTER: { label: 'Alle som kan melde seg på' },
} satisfies Record<EventCanView, { label: string }>

export const CanBeViewdByOptions = Object.values(EventCanView).map(opt => ({
    value: opt,
    label: CanBeViewdByConfig[opt].label
}))

export const eventFieldsToExpose = [
    'id',
    'name',
    'order',
    'eventStart',
    'eventEnd',
    'places',
    'registrationStart',
    'registrationEnd',
    'canBeViewdBy',
    'takesRegistration'
] as const satisfies (keyof Event)[]

export const eventFilterSeletion = createSelection(eventFieldsToExpose)