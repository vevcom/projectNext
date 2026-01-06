import { z } from 'zod'

const ledgerAcccountSchema = z.object({
    userId: z.number().optional(),
    groupId: z.number().optional(),
    payoutAccountNumber: z.string().optional(),
})

export const ledgerAccountSchemas = {
    create: ledgerAcccountSchema.pick({
        userId: true,
        groupId: true,
        payoutAccountNumber: true,
    }).refine(
        data => (data.userId === undefined) !== (data.groupId === undefined),
        'Bruker- eller gruppe-ID må være satt.'
    ),

    update: ledgerAcccountSchema.partial().pick({
        payoutAccountNumber: true,
    })
}
