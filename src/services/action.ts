import '@pn-server-only'
import { safeServerCall } from './actionError'
import type { ActionReturn } from './actionTypes'
import type { ServiceMethod, ServiceMethodInputUnchecked } from '@/services/serviceMethod'
import type { z } from 'zod'
import { Session } from '@/auth/Session'

type ActionInputUnchecked = (
    {
        data?: unknown,
        params?: unknown,
    } | FormData
)[]

export type ActionInputChecked<
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
> = (
    ParamsSchema extends undefined
        ? DataSchema extends undefined
            ? []
            : [{ data: z.input<NonNullable<DataSchema>> } | FormData]
        : DataSchema extends undefined
            ? [{ params: z.input<NonNullable<ParamsSchema>> }]
            : (
                [{ params: z.input<NonNullable<ParamsSchema>>, data: z.input<NonNullable<DataSchema>> }] |
                [{ params: z.input<NonNullable<ParamsSchema>> }, { data: z.input<NonNullable<DataSchema>> } | FormData]
            )
)

export type ActionOnlyParams<Return, ParamsSchema extends z.ZodTypeAny> = (
    input: { params: z.input<ParamsSchema> }
) => Promise<ActionReturn<Return>>

export type ActionOnlyData<Return, DataSchema extends z.ZodTypeAny> = (
    input: { data: z.input<DataSchema> } | FormData
) => Promise<ActionReturn<Return>>


export type Action<
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
> = (...input: ActionInputChecked<ParamsSchema, DataSchema>) => Promise<ActionReturn<Return>>

/**
 * Turn a service method into suitable function for an action.
 *
 * @param serviceMethod - The service method to create an action for.
 * @returns - A function that takes in data (which may be FormData) and/or/nor parameters and calls the service method.
 */
export function action<
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
>(
    serviceMethod: ServiceMethod<boolean, Return, ParamsSchema, DataSchema>
): Action<Return, ParamsSchema, DataSchema> {
    return async (...args: ActionInputUnchecked) => {
        const session = await Session.fromNextAuth()

        // Merge all arguments into a single input object.
        // Treat FormData as "{ data: FormData }".
        const serviceMethodInput = args.reduce<ServiceMethodInputUnchecked>((acc, arg) => {
            if (arg instanceof FormData) {
                acc.data = arg
            } else if (typeof arg === 'object' && arg !== null) {
                if ('data' in arg) {
                    acc.data = arg.data
                }
                if ('params' in arg) {
                    acc.params = arg.params
                }
            }
            return acc
        }, {})

        // Treat empty form data as undefined. This is required because the form component will always send
        // a FormData instance, even if no data is being sent.
        if (serviceMethodInput.data instanceof FormData && serviceMethodInput.data.entries().next().done) {
            serviceMethodInput.data = undefined
        }

        return safeServerCall(() => serviceMethod<'UNCHECKED'>({
            ...serviceMethodInput,
            session,
        }))
    }
}
