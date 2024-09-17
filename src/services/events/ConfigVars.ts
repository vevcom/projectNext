import { EventCanView } from '@prisma/client'

export const CanBeViewdByConfig = {
    ALL: { label: 'Alle' },
    CAN_REGISTER: { label: 'Alle som kan melde seg på' },
} satisfies Record<EventCanView, { label: string }>

export const CanBeViewdByOptions = Object.values(EventCanView).map(opt => ({
    value: opt,
    label: CanBeViewdByConfig[opt].label
}))
