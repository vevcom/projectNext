import 'server-only'
import { readSpecial, validateAndCollapseCmsLink } from './read'
import { create } from './create'
import { destroy } from './destroy'
import { update } from './update'
import { ServiceMethod } from '@/services/ServiceMethod'

export const CmsLinks = {
    readSpacial: ServiceMethod({
        withData: false,
        hasAuther: false,
        serviceMethodHandler: readSpecial
    }),
    validateAndCollapseCmsLink: ServiceMethod({
        withData: false,
        hasAuther: false,
        serviceMethodHandler: validateAndCollapseCmsLink
    }),
    create: ServiceMethod({
        withData: true,
        hasAuther: false, //TODO: Auth
        serviceMethodHandler: create
    }),
    update: ServiceMethod({
        withData: true,
        hasAuther: false, //TODO: Auth
        serviceMethodHandler: update
    }),
    destroy: ServiceMethod({
        withData: false,
        hasAuther: false, //TODO: Auth
        serviceMethodHandler: destroy
    })
} as const
