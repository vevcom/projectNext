import 'server-only'
import {
    CreateBookingPeriodAuther,
    CreateReleaseGroupAuther,
    CreateRoomAuther,
    DeleteReleaseGroupAuther,
    ReadAllBookingPeriodsAuther,
    ReadReleaseGroupsAuther,
    ReadRoomAuther,
    UpdateReleaseGroupAuther
} from './Authers'
import { createRoom } from './room/create'
import { readRooms } from './room/read'
import { createBookingPeriod } from './bookingPeriod/create'
import { readAllBookingPeriods } from './bookingPeriod/read'
import { createReleaseGroup } from './releaseGroup/create'
import { readReleaseGroup, readReleaseGroups } from './releaseGroup/read'
import { updateReleaseGroup, updateReleaseGroupBookingPeriods } from './releaseGroup/update'
import { deleteReleaseGroup } from './releaseGroup/delete'
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
    readReleaseGroup: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadReleaseGroupsAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: readReleaseGroup,
    }),
    updateReleaseGroup: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: UpdateReleaseGroupAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: updateReleaseGroup,
    }),
    updateReleaseGroupBookingPeriods: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: UpdateReleaseGroupAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: updateReleaseGroupBookingPeriods,
    }),
    deleteReleaseGroup: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: DeleteReleaseGroupAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: deleteReleaseGroup,
    })
} as const
