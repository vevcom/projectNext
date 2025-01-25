import 'server-only'
import { Session } from '@/auth/Session'
import { getHttpErrorCode, ServerError, Smorekopp } from '@/services/error'
import type { ErrorCode, ErrorMessage } from '@/services/error'
import type { ValidationTypeUnknown } from '@/services/Validation'
import type { ServiceMethodType } from '@/services/ServiceMethod'
import type { SessionNoUser } from '@/auth/Session'
import type { z } from 'zod'

type APIHandler<
    RawParams,
    Return,
    ParamsSchema extends z.ZodTypeAny | undefined,
    DataValidation extends ValidationTypeUnknown | undefined,
> = {
    serviceMethod: ServiceMethodType<boolean, Return, ParamsSchema, DataValidation>,
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
            console.log("heihei", error)
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
    DataValidation extends ValidationTypeUnknown | undefined = undefined,
>({ serviceMethod, params }: APIHandler<RawParams, Return, ParamsSchema, DataValidation>) {
    // TODO: I think I will rewrite this to be easier to read
    return async (req: Request, { params: rawParams }: { params: RawParams }) =>
        await apiHandlerGeneric<Return>(req, async session => {
            const rawdata = await req.json().catch(console.log)

            if (!serviceMethod.dataValidation) {
                throw new ServerError('BAD DATA', 'Tjeneren mottok data, men den mangler validering for dataen.')
            }

            const parse = serviceMethod.dataValidation.typeValidate(rawdata)
            if (!parse.success) throw new ServerError('BAD PARAMETERS', parse.error.errors)
            const data = parse.data

            return serviceMethod.newClient().executeUnsafe({
                params: params ? params(rawParams) : undefined,
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
