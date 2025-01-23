import 'server-only'
import { Session } from '@/auth/Session'
import { getHttpErrorCode, Smorekopp } from '@/services/error'
import type { ErrorCode, ErrorMessage } from '@/services/error'
import type { SessionNoUser } from '@/auth/Session'
import type { ServiceMethod } from '@/services/ServiceTypes'

type APIHandler<
    WithValidation extends boolean,
    Return,
    TypeValidationType,
    DetailedValidationType,
    RawParams,
    Params,
    WantsToOpenTransaction extends boolean,
    NoAuther extends boolean
> = {
    serviceMethod: ServiceMethod<
        WithValidation, TypeValidationType, DetailedValidationType, Params, Return, WantsToOpenTransaction, NoAuther
    >
    params: (rawparams: RawParams) => Params
}

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
    Return,
    RawParams,
    Params,
    WantsToOpenTransaction extends boolean,
    NoAuther extends boolean
>(
    config: APIHandler<false, Return, void, void, RawParams, Params, WantsToOpenTransaction, NoAuther>
): (req: Request, paramObject: { params: RawParams }) => Promise<Response>

export function apiHandler<
    Return,
    TypeValidationType,
    DetailedValidationType,
    RawParams,
    Params,
    WantsToOpenTransaction extends boolean,
    NoAuther extends boolean
>({
    serviceMethod,
    params
}: APIHandler<
    true,
    Return,
    TypeValidationType,
    DetailedValidationType,
    RawParams,
    Params,
    WantsToOpenTransaction,
    NoAuther
>): (req: Request, paramObject: { params: RawParams }) => Promise<Response>

export function apiHandler<
    Return,
    TypeValidationType,
    DetailedValidationType,
    RawParams,
    Params,
    WantsToOpenTransaction extends boolean,
    NoAuther extends boolean
>({
    serviceMethod,
    params
}: | APIHandler<
    true, Return, TypeValidationType, DetailedValidationType, RawParams, Params, WantsToOpenTransaction, NoAuther
    >
    | APIHandler<
    false, Return, void, void, RawParams, Params, WantsToOpenTransaction, NoAuther
    >

) {
    // TODO: I think I will rewrite this so it is simpler to read
    if (serviceMethod.withData) {
        return async (req: Request, { params: rawParams }: { params: RawParams }) =>
            await apiHandlerGeneric<Return>(req, async session => {
                const rawdata = await req.json().catch(console.log)
                const parse = serviceMethod.typeValidate(rawdata)
                if (!parse.success) {
                    throw new Smorekopp('BAD PARAMETERS', parse.error.errors)
                }
                const data = parse.data

                return serviceMethod.client('NEW').execute({
                    params: params(rawParams),
                    data,
                    session,
                }, { withAuth: true })
            })
    }

    return async (req: Request, { params: rawParams }: { params: RawParams }) =>
        await apiHandlerGeneric(req, session =>
            serviceMethod.client('NEW').execute({
                params: params(rawParams),
                session
            }, { withAuth: true })
        )
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
