import 'server-only'
import { Session } from '@/auth/Session'
import { ServerError, Smorekopp } from '@/services/error'
import type { ServiceMethodReturn, Validation } from '@/services/ServiceMethod'
import type { ErrorCode } from '@/services/error'
import type { SessionNoUser } from '@/auth/Session'
import type { z } from 'zod'

type APIHandler<
    RawParams,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataValidation extends Validation<unknown, unknown> | undefined,
> = {
    serviceMethod: ServiceMethodReturn<boolean, Return, ParamsSchema, DataValidation>,
} & (ParamsSchema extends undefined ? {
    params?: undefined,
} : {
    params: (rawparams: RawParams) => z.infer<NonNullable<ParamsSchema>>,
})

async function apiHandlerGeneric<Return>(req: Request, handle: (session: SessionNoUser) => Promise<Return>) {
    try {
        const authorization = req.headers.get('authorization')
        const session = await Session.fromApiKey(authorization)
        const result = await handle(session)
        return createApiResponse(result)
    } catch (error: unknown) {
        if (error instanceof Smorekopp) {
            return createApiErrorRespone(error.errorCode, error.errors.length ? error.errors[0].message : error.errorCode)
        }
        if (error instanceof Error) {
            return createApiErrorRespone('UNKNOWN ERROR', error.message)
        }
    }
    return createApiErrorRespone('SERVER ERROR', 'Noe veldig uventet skjedde')
}

export function apiHandler<
    RawParams,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataValidation extends Validation<unknown, unknown> | undefined = undefined,
>({ serviceMethod, params }: APIHandler<RawParams, Return, ParamsSchema, DataValidation>) {
    return async (req: Request, { params: rawParams }: { params: RawParams }) =>
        await apiHandlerGeneric<Return>(req, async session => {
            const rawdata = await req.json().catch(console.log)

            if (!serviceMethod.dataValidation) {
                throw new ServerError('SERVER ERROR', 'Tjeneren mottok data, men den mangler validering for dataen.')
            }

            const parse = serviceMethod.dataValidation.typeValidate(rawdata)
            if (!parse.success) throw new ServerError('BAD PARAMETERS', 'Dårlig data')
            const data = parse.data

            return serviceMethod.newClient().executeUnsafe({
                params: params ? params(rawParams) : undefined,
                data,
                session,
            })
        })
}

function createApiErrorRespone(errorCode: ErrorCode, message: string) {
    return new Response(JSON.stringify({
        errorCode,
        message
    }), {
        status: 500 //TODO: todo what johan todo what?????? -p
    })
}

function createApiResponse<Return>(res: Return) {
    return Response.json(JSON.stringify(res), { status: 200 })
}
