import { minimumAmount } from './config'
import { z } from 'zod'

export namespace DepositSchemas {
    export const create = z.object({
        amount: z.coerce.number().int().positive().gte(minimumAmount, `Innskudd må være på minst ${minimumAmount}.`),
    })
}
