import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequireLedgerAccountAccess } from '@/auth/authorizer/RequireLedgerAccountAccess'

// Reads are exempt from LEDGER_USE, same as ledgerAccountAuth. Mutations require it.
export const ledgerTransactionAuth = {
    // mode: 'ANY' since being party to one side of the transaction is enough to view it.
    read: RequireLedgerAccountAccess.staticFields({ permission: 'LEDGER_ADMIN', mode: 'ANY' }),

    readPage: RequireLedgerAccountAccess.staticFields({ permission: 'LEDGER_ADMIN' }),

    // A system recomputation step, not meant to be called directly by a user. Its real callers
    // (create below, and the Stripe webhook) always pass bypassAuth. LEDGER_ADMIN here is a
    // safety net for any other caller.
    advance: RequirePermission.staticFields({ permission: 'LEDGER_ADMIN' }),

    // Additionally requires ownership of every account the transaction debits.
    create: {
        ledgerUse: RequirePermission.staticFields({ permission: 'LEDGER_USE' }),
        accountAccess: RequireLedgerAccountAccess.staticFields({ permission: 'LEDGER_ADMIN' }),
    },
} as const
