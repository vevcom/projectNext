import { z } from 'zod'

const baseSchema = z.object({
    groupId: z.string(),
    indefinateDate: z.string().optional(),
    endDate: z.string().optional()
}).transform(data => ({
    groupId: data.groupId === 'null' ? null : parseInt(data.groupId, 10),
    indefinateDate: data.indefinateDate ? data.indefinateDate === 'on' : false,
    endDate: data.endDate ? (new Date(data.endDate)) : null
}))

export const lockerReservationSchemas = {
    create: baseSchema,
    update: baseSchema,
}
