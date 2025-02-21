import { createSelection } from '@/services/createSelection'
import { EventCanView } from '@prisma/client'
import type { Event } from '@prisma/client'

export namespace EventConfig {
    export const canBeViewdBy = {
        ALL: { label: 'Alle' },
        CAN_REGISTER: { label: 'Alle som kan melde seg på' }
    } satisfies Record<EventCanView, { label: string }>
    
    export const canBeViewdByOptions = Object.values(EventCanView).map(opt => ({
        value: opt,
        label: canBeViewdBy[opt].label
    }))
    
    export const fieldsToExpose = [
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
    
    export const filterSeletion = createSelection(fieldsToExpose)
}

