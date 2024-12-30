import { createZodActionError } from './error'
import { safeServerCall } from './safeServerCall'
import { Session } from '@/auth/Session'
import { Smorekopp } from '@/services/error'
import type { ActionReturn } from './Types'
import type {
    ExtractDetailedType,
    ServiceMethodParamsDataUnsafe,
    ServiceMethodReturn,
    Validation
} from '@/services/ServiceMethodTypes'
import type { z } from 'zod'

// What a mess... :/ TODO: Refactor maybe?

type Action<
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataValidation extends Validation<unknown, unknown> | undefined = undefined,
> = ParamsSchema extends undefined ? {
    params: (params?: z.infer<NonNullable<ParamsSchema>>) => (
        DataValidation extends undefined
            ? () => Promise<ActionReturn<Return>>
            : (data: ExtractDetailedType<NonNullable<DataValidation>> | FormData) => Promise<ActionReturn<Return>>
    )
} : {
    params: (params?: z.infer<NonNullable<ParamsSchema>>) => (
        DataValidation extends undefined
            ? () => Promise<ActionReturn<Return>>
            : (data: ExtractDetailedType<NonNullable<DataValidation>> | FormData) => Promise<ActionReturn<Return>>
    )
}

export function Action<
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataValidation extends Validation<unknown, unknown> | undefined = undefined,
>(
    serviceMethod: ServiceMethodReturn<boolean, Return, ParamsSchema, DataValidation>
): Action<Return, ParamsSchema, DataValidation>

export function Action<
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataValidation extends Validation<unknown, unknown> | undefined = undefined,
>(
    serviceMethod: ServiceMethodReturn<boolean, Return, ParamsSchema, DataValidation>
) {
    const call = async (args: ServiceMethodParamsDataUnsafe) => {
        const session = await Session.fromNextAuth()

        if (args.data) {
            if (!serviceMethod.dataValidation) {
                throw new Smorekopp('SERVER ERROR', 'Action recieved data, but service method has no validation.')
            }

            const parse = serviceMethod.dataValidation.typeValidate(args.data)
            if (!parse.success) return createZodActionError(parse)
            args.data = parse.data
        }

        return safeServerCall(() => serviceMethod.newClient().executeUnsafe({ session, ...args }))
    }

    type Params = z.infer<NonNullable<ParamsSchema>>
    type Data = ExtractDetailedType<NonNullable<DataValidation>>

    return {
        params: (params?: Params) => (data?: Data | FormData) => call({ params, data })
    }
}

// TODO: Ville vært så kult!!
/*function ActionsFromService<Service extends Record<string, ServiceMethodReturn<any, any, any, any>>>(service: Service) {

}*/
