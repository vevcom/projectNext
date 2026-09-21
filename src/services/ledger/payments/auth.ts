import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const paymentAuth = {
    // Called only by createDeposit/createPayout, which already require LEDGER_USE themselves,
    // so this check is free to leave in place.
    create: RequirePermission.staticFields({ permission: 'LEDGER_USE' }),

    // Starts real payment collection. Operates on a paymentId before any ledger entries exist,
    // so there is no account to check ownership against.
    initiate: RequirePermission.staticFields({ permission: 'LEDGER_USE' }),
} as const
