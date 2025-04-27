import { z } from 'zod'

export namespace LedgerAccountSchemas {
    const fields = z.object({
        userId: z.number().optional(),
        groupId: z.number().optional(),
        payoutAccountNumber: z.string().optional(),
    })

    export const create = fields.pick({
        userId: true,
        groupId: true,
        payoutAccountNumber: true,
    }).refine(
        data => (data.userId === undefined) !== (data.groupId === undefined),
        'Bruker- eller gruppe-ID må være satt.'
    )

    // .createValidation({
    //     keys: ['userId', 'groupId', 'payoutAccountNumber'],
    //     transformer: data => data,
    //     refiner: {
    //         // Only one of userId and groupId can be set
    //         fcn: data => (data.userId === undefined) !== (data.groupId === undefined),
    //         message: 'Bruker- eller gruppe-ID må være satt.',
    //     },
    // })

    export const update = fields.partial().pick({
        payoutAccountNumber: true,
    })
}
