import { z } from 'zod'

export namespace LockerReservationSchemas {
    const fields = z.object({
        groupId: z.string(),
        indefinateDate: z.string().optional(),
        endDate: z.string().optional()
    })

    export const create = fields.pick({
        groupId: true,
        indefinateDate: true,
        endDate: true,
    }).transform(data => ({
        groupId: data.groupId === 'null' ? null : parseInt(data.groupId, 10),
        indefinateDate: data.indefinateDate ? data.indefinateDate === 'on' : false,
        endDate: data.endDate ? (new Date(data.endDate)) : null
    }))

    export const update = create
}
