import { RequireUserId } from '@/auth/authorizer/RequireUserId'
import { RequireUserIdOrPermission } from '@/auth/authorizer/RequireUserIdOrPermission'

// Creating a Stripe customer, a checkout session or a setup intent all stay strictly
// self-service. None of these may be used to pay, or save a new payment method, on another
// user's behalf, not even by admins. Listing and deleting saved payment methods are exempted
// for LEDGER_ADMIN, so admins can audit or clean up cards without being able to spend them.
export const stripeCustomerAuth = {
    readOrCreate: RequireUserId.staticFields({}),
    createSession: RequireUserId.staticFields({}),
    createSetupIntent: RequireUserId.staticFields({}),

    readSavedPaymentMethods: RequireUserIdOrPermission.staticFields({ permission: 'LEDGER_ADMIN' }),
    deleteSavedPaymentMethod: RequireUserIdOrPermission.staticFields({ permission: 'LEDGER_ADMIN' }),
} as const
