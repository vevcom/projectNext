import { AuthorizerFactory } from './Authorizer'
import type { Permission } from '@/prisma-generated-pn-types'

type LedgerAccountOwnership = {
    userId: number | null,
    groupIds: number[],
}

/**
 * Authorized if the session holds `permission`, or passes the ownership check below.
 *
 * `mode: 'ALL'` (default) requires every account in `accounts` to individually pass ownership.
 * Use for a transaction with several debited accounts: all of them must be safe to debit.
 *
 * `mode: 'ANY'` requires only one account in `accounts` to pass. Use when being a party to a
 * single account is enough, e.g. reading a transaction you took part in.
 */
export const RequireLedgerAccountAccess = AuthorizerFactory<
    { permission: Permission, mode?: 'ALL' | 'ANY' },
    { accounts: LedgerAccountOwnership[] },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields, dynamicFields }) => {
    if (session.permissions.includes(staticFields.permission)) {
        return { success: true, session }
    }

    const ownsOrIsMemberOf = (account: LedgerAccountOwnership) =>
        (session.user !== null && session.user.id === account.userId) ||
        session.memberships.some(membership => membership.active && account.groupIds.includes(membership.groupId))

    const success = dynamicFields.accounts.length > 0 && (
        staticFields.mode === 'ANY'
            ? dynamicFields.accounts.some(ownsOrIsMemberOf)
            : dynamicFields.accounts.every(ownsOrIsMemberOf)
    )

    return {
        success,
        session,
        errorMessage: `
            Du trenger tillatelse '${staticFields.permission}' for å få tilgang,
            eller eie (eventuelt være medlem av en gruppe som eier) kontoen/kontoene det gjelder.
        `
    }
})
