import { PayoutSchemas } from './schemas'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { ServiceMethod } from '@/services/ServiceMethod'
import { LedgerAccountMethods } from '@/services/ledger/ledgerAccount/methods'
import { ServerError } from '@/services/error'
import { z } from 'zod'

export namespace PayoutMethods {
    export const create = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            accountId: z.number(),
        }),
        dataSchema: PayoutSchemas.create,
        opensTransaction: true,
        method: async ({ prisma, session, params, data }) => prisma.$transaction(async (tx) => {
            const originalBalancee = await LedgerAccountMethods.calculateBalance.client(tx).execute({
                params: {
                    id: params.accountId,
                },
                session,
            })

            const feesToYoink = Math.round((data.amount / originalBalancee.total) * originalBalancee.fees)

            const payout = await tx.transaction.create({
                data: {
                    status: 'SUCCEEDED',
                    type: 'PAYOUT',
                    fee: feesToYoink,
                    fromAccountId: params.accountId,
                    amount: data.amount,
                }
            })

            const newBalancee = await LedgerAccountMethods.calculateBalance.client(tx).execute({
                params: {
                    id: params.accountId,
                },
                session,
            })

            if (newBalancee.total < 0) {
                throw new ServerError('BAD DATA', 'Kontoen har ikke nok penger for å utføre tranaksjonen.')
            }

            if (newBalancee.fees < 0) {
                throw new ServerError('BAD DATA', 'Dette burde ikke være mulig...')
            }

            return payout
        }),
    })
}
