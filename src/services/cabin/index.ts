import 'server-only'
import {
    CreateBookingPeriodAuther,
    CreateReleaseGroupAuther,
    CreateRoomAuther,
    ReadAllBookingPeriodsAuther,
    ReadReleaseGroupsAuther,
    ReadRoomAuther
} from './Authers'
import { createRoom } from './room/create'
import { readRooms } from './room/read'
import { createBookingPeriod } from './bookingPeriod/create'
import { readAllBookingPeriods } from './bookingPeriod/read'
import { createReleaseGroup } from './releaseGroup/create'
import { readReleaseGroups } from './releaseGroup/read'
import { ServiceMethod } from '@/services/ServiceMethod'

export const Cabin = {
    createRoom: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateRoomAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: createRoom,
    }),
    readRooms: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadRoomAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: readRooms,
    }),
    createBookingPeriod: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateBookingPeriodAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: createBookingPeriod,
    }),
    readAllBookingPeriods: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadAllBookingPeriodsAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: readAllBookingPeriods,
    }),
    createReleaseGroup: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: CreateReleaseGroupAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: createReleaseGroup,
    }),
    readReleaseGroups: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadReleaseGroupsAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: readReleaseGroups,
    }),
} as const
