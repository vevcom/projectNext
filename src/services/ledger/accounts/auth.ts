import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequireUserIdOrPermission } from '@/auth/authorizer/RequireUserIdOrPermission'
import { RequireLedgerAccountAccess } from '@/auth/authorizer/RequireLedgerAccountAccess'

// Reads are exempt from LEDGER_USE: users can always see their own accounts even if the ledger
// is otherwise disabled. Mutations require LEDGER_USE, plus ownership whenever they act on a
// specific account.
export const ledgerAccountAuth = {
    create: RequirePermission.staticFields({ permission: 'LEDGER_USE' }),

    read: RequireLedgerAccountAccess.staticFields({ permission: 'LEDGER_ADMIN' }),

    readMany: RequireLedgerAccountAccess.staticFields({ permission: 'LEDGER_ADMIN' }),

    // Its only caller, paymentOperations.initiate, already requires LEDGER_USE, so the account
    // creation this performs stays gated even though this authorizer alone doesn't check it.
    readOrCreate: RequireUserIdOrPermission.staticFields({ permission: 'LEDGER_ADMIN' }),

    // Browses every account with no owner filter, so this is LEDGER_ADMIN only, not exempt.
    readPage: RequirePermission.staticFields({ permission: 'LEDGER_ADMIN' }),

    // Can reassign an account's owner or payout number, so ownership is required too, even
    // though updating doesn't move money.
    update: {
        ledgerUse: RequirePermission.staticFields({ permission: 'LEDGER_USE' }),
        accountAccess: RequireLedgerAccountAccess.staticFields({ permission: 'LEDGER_ADMIN' }),
    },

    calculateBalances: RequireLedgerAccountAccess.staticFields({ permission: 'LEDGER_ADMIN' }),
    calculateBalance: RequireLedgerAccountAccess.staticFields({ permission: 'LEDGER_ADMIN' }),
} as const
