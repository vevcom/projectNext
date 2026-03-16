import { LedgerAccountType } from '@/prisma-generated-pn/enums'
import { z } from 'zod'

const ledgerAcccountSchema = z.object({
    type: z.nativeEnum(LedgerAccountType),
    userId: z.number().optional(),
    groupIds: z.number().array().optional(),
    payoutAccountNumber: z.string().optional(),
    frozen: z.boolean(),
})

export const ledgerAccountSchemas = {
    create: ledgerAcccountSchema.partial().pick({
        type: true,
        userId: true,
        groupIds: true,
        payoutAccountNumber: true,
        frozen: true,
    }).superRefine(({ type, userId, groupIds }, ctx) => {
        if (type === undefined && userId === undefined && groupIds === undefined) {
            ctx.addIssue({
                code: 'custom',
                message: 'Kontotype må være oppgitt dersom verken gruppe ID eller bruker ID er oppgitt.',
                path: ['type'],
            })
        }

        if (type === 'GROUP' && userId !== undefined) {
            ctx.addIssue({
                code: 'custom',
                message: 'Gruppe kontoer kan ikke opprettes med en bruker ID.',
                path: ['userId'],
            })
        }

        if (type === 'USER' && groupIds !== undefined) {
            ctx.addIssue({
                code: 'custom',
                message: 'Bruker kontoer kan ikke opprettes med gruppe ID-er.',
                path: ['groupIds'],
            })
        }
    }),

    update: ledgerAcccountSchema.partial().pick({
        payoutAccountNumber: true,
        userId: true,
        groupIds: true,
        frozen: true,
    })
}
