import '@pn-server-only'
import { Session } from '@/auth/Session'
import { getHttpErrorCode, ServerError, Smorekopp } from '@/services/error'
import type { ErrorCode, ErrorMessage } from '@/services/error'
import type { ServiceMethodType } from '@/services/ServiceMethod'
import type { SessionNoUser } from '@/auth/Session'
import type { z } from 'zod'

type APIHandler<
    RawParams,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataSchema extends z.ZodTypeAny | undefined,
> = {
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, DataSchema>,
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
            return createApiErrorRespone(error.errorCode, error.errors)
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
    DataSchema extends z.ZodTypeAny | undefined = undefined,
>({ serviceMethod, params }: APIHandler<RawParams, Return, ParamsSchema, DataSchema>) {
    // TODO: I think I will rewrite this to be easier to read
    return async (req: Request, { params: rawParams }: { params: Promise<RawParams> }) =>
        await apiHandlerGeneric<Return>(req, async session => {
            if (serviceMethod.dataSchema) {
                try {
                    const rawdata = await req.json()

                    return serviceMethod.newClient().executeUnsafe({
                        params: params ? params(await rawParams) : undefined,
                        data: rawdata,
                        session,
                    })
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        throw new ServerError('BAD DATA', 'The API only accepts valid json data.')
                    }
                    throw error
                }
            }

            return serviceMethod.newClient().executeUnsafe({
                params: params ? params(await rawParams) : undefined,
                data: undefined,
                session,
            })
        })
}

function createApiErrorRespone(errorCode: ErrorCode, message: string | ErrorMessage[]) {
    const errors: ErrorMessage[] = Array.isArray(message) ? message : [{
        message,
    }]

    return new Response(JSON.stringify({
        errorCode,
        errors,
    }), {
        status: getHttpErrorCode(errorCode)
    })
}

function createApiResponse<Return>(res: Return) {
    const data = res ? JSON.stringify(res) : ''
    return Response.json(data, { status: 200 })
}
