import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { create } from './create'
import { CreateEventRegistrationAuther } from './Authers'

export const EventRegistrations = {
    create: ServiceMethod({
        hasAuther: false, //TODO: Auth
        withData: true,
        serviceMethodHandler: create,
    })
} as const