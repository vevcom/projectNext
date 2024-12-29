import { createZodActionError } from './error'
import { safeServerCall } from './safeServerCall'
import { Session } from '@/auth/Session'
import { Smorekopp } from '@/services/error'
import type { ActionReturn } from './Types'
import type { ServiceMethodReturn } from '@/services/ServiceMethodTypes'

// What a mess... :/

type Action<Params, TakesParams extends boolean, Data, TakesData extends boolean, Return> = TakesParams extends true
    ? (
        TakesData extends true
            ? (params: Params, data: Data | FormData) => Promise<ActionReturn<Return>>
            : (params: Params) => Promise<ActionReturn<Return>>)
    : (
        TakesData extends true
            ? (data: Data | FormData) => Promise<ActionReturn<Return>>
            : () => Promise<ActionReturn<Return>>
        )

export function Action<Params, TakesParams extends boolean, DetailedData, TakesData extends boolean, Return>(
    serviceMethod: ServiceMethodReturn<Params, TakesParams, unknown, DetailedData, TakesData, Return, boolean>
): Action<Params, TakesParams, DetailedData, TakesData, Return>

export function Action<Params, DetailedData, Return>(
    serviceMethod: ServiceMethodReturn<Params, boolean, unknown, DetailedData, boolean, Return, boolean>
): Action<Params, boolean, DetailedData, boolean, Return> {
    const call = async (params?: Params, data?: FormData | DetailedData) => {
        const session = await Session.fromNextAuth()

        if (data) {
            if (!serviceMethod.takesData) {
                throw new Smorekopp('SERVER ERROR', 'Action recieved data, but service method does not take data.')
            }

            if (!serviceMethod.typeValidate) {
                throw new Smorekopp('SERVER ERROR', 'Action recieved data, but service method has no validation.')
            }

            const parse = serviceMethod.typeValidate(data)
            if (!parse.success) return createZodActionError(parse)
            data = parse.data
        }

        return safeServerCall(() => serviceMethod.newClient().execute({ session, params, data }))
    }

    if (serviceMethod.takesParams && serviceMethod.takesData) {
        return (params: Params, data: FormData | DetailedData) => call(params, data)
    }

    if (serviceMethod.takesParams) {
        return (params: Params) => call(params)
    }

    if (serviceMethod.takesData) {
        return (data: FormData | DetailedData) => call(undefined, data)
    }

    return () => call()
}
