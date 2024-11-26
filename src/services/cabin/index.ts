import 'server-only'
import { CreateRoomAuther, ReadRoomAuther } from './Authers'
import { createRoom } from './room/create'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readRooms } from './room/read'

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
} as const
