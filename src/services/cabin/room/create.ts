import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createRoomValidation } from '@/services/cabin/validation'


export const createRoom = ServiceMethodHandler({
    withData: true,
    validation: createRoomValidation,
    handler: (prisma, _, data) => prisma.room.create({
        data: {
            name: data.name,
            capacity: data.capacity,
        }
    })
})
