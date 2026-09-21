import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequireLedgerAccountAccess } from '@/auth/authorizer/RequireLedgerAccountAccess'
import { andAuthorizers } from '@/auth/authorizer/andAuthorizers'
import type { PaymentProvider } from '@/prisma-generated-pn-types'

export const ledgerMovementAuth = {
    /**
     * A deposit credits the account rather than debiting it, so LEDGER_USE alone is enough.
     * MANUAL deposits additionally require LEDGER_ADMIN, since they mark themselves SUCCEEDED
     * immediately with a caller supplied fee and no real payment ever collected.
     */
    createDeposit: (provider: PaymentProvider) => {
        const ledgerUse = RequirePermission.staticFields({ permission: 'LEDGER_USE' }).dynamicFields({})

        if (provider !== 'MANUAL') return ledgerUse

        return andAuthorizers(
            ledgerUse,
            RequirePermission.staticFields({ permission: 'LEDGER_ADMIN' }).dynamicFields({}),
        )
    },

    // A payout debits the account, so ownership is required in addition to LEDGER_USE.
    createPayout: {
        ledgerUse: RequirePermission.staticFields({ permission: 'LEDGER_USE' }),
        accountAccess: RequireLedgerAccountAccess.staticFields({ permission: 'LEDGER_ADMIN' }),
    },
} as const
