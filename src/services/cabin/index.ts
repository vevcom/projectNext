import 'server-only'
import {
    CreateReleasePeriodAuther,
    DeleteReleasePeriodAuther,
    ReadReleasePeriodAuther,
    UpdateReleasePeriodAuther
} from './Authers'
import { readReleasePeriods } from './releasePeriod/read'
import { updateReleaseGroup } from './releasePeriod/update'
import { deleteReleasePeriod } from './releasePeriod/delete'
import { createReleasePeriod } from './releasePeriod/create'
import { ServiceMethod } from '@/services/ServiceMethod'

export const Cabin = {
    createReleasePeriod: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateReleasePeriodAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: createReleasePeriod,
    }),
    readReleasePeriod: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadReleasePeriodAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: readReleasePeriods,
    }),
    updateReleasePeriod: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: UpdateReleasePeriodAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: updateReleaseGroup,
    }),
    deleteReleasePeriod: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: DeleteReleasePeriodAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: deleteReleasePeriod,
    })
} as const
