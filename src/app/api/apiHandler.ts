import '@pn-server-only'
import { Session } from '@/auth/session/Session'
import { getHttpErrorCode, ServerError, Smorekopp } from '@/services/error'
import type { ServiceOperation } from '@/services/serviceOperation'
import type { ErrorCode, ErrorMessage } from '@/services/error'
import type { SessionNoUser } from '@/auth/session/Session'
import type { z } from 'zod'

type APIHandler<
    RawParams,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined = undefined,
    DataSchema extends z.ZodTypeAny | undefined = undefined,
> = {
    serviceOperation: ServiceOperation<boolean, Return, ParamsSchema, DataSchema>,
} & (ParamsSchema extends undefined ? {
    params?: undefined,
} : {
    params: (rawParams: RawParams) => z.input<NonNullable<ParamsSchema>>,
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
>({ serviceOperation, params }: APIHandler<RawParams, Return, ParamsSchema, DataSchema>) {
    // TODO: I think I will rewrite this to be easier to read
    return async (req: Request, { params: rawParams }: { params: Promise<RawParams> }) =>
        await apiHandlerGeneric<Return>(req, async session => {
            let data

            if (serviceOperation.dataSchema) {
                try {
                    data = await req.json()
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        throw new ServerError('BAD DATA', 'The API only accepts valid json data.')
                    }
                    throw error
                }
            }

            return serviceOperation<'UNCHECKED'>({
                params: params ? params(await rawParams) : undefined,
                data,
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
