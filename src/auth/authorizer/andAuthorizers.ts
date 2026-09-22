import type { AuthorizerDynamicFieldsBound, UserRequieredOutOpt } from './Authorizer'

/**
 * Requires both bound authorizers to pass. Checks `first` first and returns its result
 * immediately if it fails, without evaluating `second`.
 */
export function andAuthorizers<UserRequieredOut extends UserRequieredOutOpt>(
    first: AuthorizerDynamicFieldsBound<UserRequieredOut>,
    second: AuthorizerDynamicFieldsBound<UserRequieredOut>,
): AuthorizerDynamicFieldsBound<UserRequieredOut> {
    return {
        auth: (session) => {
            const firstResult = first.auth(session)
            return firstResult.authorized ? second.auth(session) : firstResult
        },
    }
}
