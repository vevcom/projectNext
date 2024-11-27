import 'server-only'
import { CreateBookingPeriodAuther, CreateRoomAuther, ReadAllBookingPeriodsAuther, ReadRoomAuther } from './Authers'
import { createRoom } from './room/create'
import { readRooms } from './room/read'
import { createBookingPeriod } from './bookingPeriod/create'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readAllBookingPeriods } from './bookingPeriod/read'

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
    })
} as const
