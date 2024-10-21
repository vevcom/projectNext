import { errorCodes } from '@/services/error'
import type { ActionReturn } from '@/actions/Types'
import type { ErrorCode } from '@/services/error'

/**
 * Function that when thrown ON RENDER will redirect to the error page (error.tsx)
 * The error must be encoded in regular Error object as the custom error type is not supported by Next.js
 * (next.js will convert custom error types to regular Error objects)
 * Thus the error must be encoded in a regular Error object in one string
 * @param
 */
export function redirectToErrorPage(code: ErrorCode, message?: string | undefined): never {
    const defaultMessage = errorCodes.find((error) => error.name === code)?.defaultMessage ?? 'Ukjent feil'
    const httpStatusCode = errorCodes.find((error) => error.name === code)?.httpCode ?? 500
    throw new Error(`${httpStatusCode} - ${message ? message : defaultMessage} (${code})`)
}

/**
 * This function is used on server render to throw user to error page if the action return is not successful
 * If the action return is successful, the data is returned
 * @param actionReturn
 * @returns data if the action return is successful
 * @throws Error if the action return is not successful (ends up on error page - error.tsx)
 */
export function unwrapActionReturn<
    Data,
>(actionReturn: ActionReturn<Data, true>): Data
export function unwrapActionReturn<
    Data,
>(actionReturn: ActionReturn<Data, false>): Data | undefined
export function unwrapActionReturn<
    Data,
    const DataGuarantee extends boolean,
>(actionReturn: ActionReturn<Data, DataGuarantee>): Data | undefined {
    if (!actionReturn.success) {
        redirectToErrorPage(actionReturn.errorCode, actionReturn.error?.length ? actionReturn.error[0].message : undefined)
    }
    return actionReturn.data
}
