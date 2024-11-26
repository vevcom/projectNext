import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'


export const readRooms = ServiceMethodHandler({
    withData: false,
    handler: (prisma) => prisma.room.findMany()
})
