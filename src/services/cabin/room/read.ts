import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import 'server-only'


export const readRooms = ServiceMethodHandler({
    withData: false,
    handler: (prisma) => prisma.room.findMany()
})
