import { z } from 'zod'

export const ledgerMovementSchemas = {
    createDeposit: z.object({
    }),

    // export const createPayoutSchema = z.object({
    //     funds: z.coerce.number().nonnegative(),
    //     fees: z.coerce.number().nonnegative(),
    // }).refine((data) => data.funds || data.fees, "Både beløp og avgifter kan ikke være 0 samtidig.");
}
