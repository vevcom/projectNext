import { createSelection } from '@/services/createSelection'
import { EventCanView } from '@prisma/client'
import type { Event } from '@prisma/client'

const canBeViewdBy = {
    ALL: { label: 'Alle' },
    CAN_REGISTER: { label: 'Alle som kan melde seg på' }
} satisfies Record<EventCanView, { label: string }>

const canBeViewdByOptions = Object.values(EventCanView).map(opt => ({
    value: opt,
    label: canBeViewdBy[opt].label
}))

const fieldsToExpose = [
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

const filterSeletion = createSelection(fieldsToExpose)

export const eventConfig = {
    canBeViewdBy,
    canBeViewdByOptions,
    filterSeletion,
    fieldsToExpose,
} as const

