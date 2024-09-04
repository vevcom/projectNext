import 'server-only'
import { Session, SessionNoUser } from '@/auth/Session'
import type { ServiceMethod } from '@/services/ServiceMethod'
import type { Auther } from '@/auth/auther/Auther'
import { ServerError } from '@/services/error'
import { ActionErrorCode } from '@/actions/Types'

type APIHandler<
    WithValidation extends boolean,
    Return,
    TypeValidationType,
    DetailedValidationType,
    RawParams,
    Params,
    DynamicFields,
    DynamicFieldsGetter extends DynamicFields
> = {
    auther: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED', DynamicFields>,
    serviceMethod: ServiceMethod<WithValidation, TypeValidationType, DetailedValidationType, Params, Return>
    dynamicFields: (dataParams: {params: Params, data: DetailedValidationType}) => DynamicFieldsGetter,
    params: (rawparams: RawParams) => Params
}

async function apiHandlerGeneric<Return>(req: Request, handle: (session: SessionNoUser) => Promise<Return>) {
    try {
        const authorization = req.headers.get('authorization')
        const session = await Session.fromApiKey(authorization)
        const result = await handle(session)
        return createApiResponse(result)
    } catch (error: unknown) {
        if (error instanceof ServerError) {
            return createApiErrorRespone(error.errorCode, error.errors.length ? error.errors[0].message : error.errorCode)
        }
        if (error instanceof Error) {
            return createApiErrorRespone('UNKNOWN ERROR', error.message)
        }
    } 
    return createApiErrorRespone('SERVER ERROR', 'Noe veldig uventet skjedde')
}

export function apiHandler<
    Return,
    TypeValidationType,
    DetailedValidationType,
    RawParams,
    Params,
    DynamicFields,
    DynamicFieldsGetter extends DynamicFields
>({
    auther,
    serviceMethod,
    dynamicFields,
    params
}: APIHandler<true, Return, TypeValidationType, DetailedValidationType, RawParams, Params, DynamicFields, DynamicFieldsGetter>) {
    return async function handler(req: Request, { params: rawParams }: { params: RawParams }) {
        return await apiHandlerGeneric<Return>(req, async session => {
            const rawdata = await req.json().catch(console.log)
            const parse = serviceMethod.typeValidate(rawdata)
            if (!parse.success) throw new ServerError('BAD PARAMETERS', 'Dårlig data')
            const data = parse.data

            const authRes = auther.auth({ session, dynamicFields: dynamicFields({params: params(rawParams), data}) })
            if (!authRes.authorized) throw new Error('ikke autorisert') //TODO: Error handling
            
            return serviceMethod.transaction('NEW_TRANSACTION').execute({ params: params(rawParams), data })
        })
    }
}

export function apiHandlerNoData<
    Return,
    RawParams,
    Params,
    DynamicFields,
    DynamicFieldsGetter extends DynamicFields
>({
    auther,
    serviceMethod,
    dynamicFields,
    params
}: APIHandler<false, Return, void, void, RawParams, Params, DynamicFields, DynamicFieldsGetter>) {
    return async function handler(req: Request, { params: rawParams }: { params: RawParams }) {
        return await apiHandlerGeneric(req, session => {
            const authRes = auther.auth({ session, dynamicFields: dynamicFields({ params: params(rawParams), data: undefined }) })
            if (!authRes.authorized) throw new Error('ikke autorisert')
            return serviceMethod.transaction('NEW_TRANSACTION').execute({ params: params(rawParams) })
        })
    }
}

function createApiErrorRespone(errorCode: ActionErrorCode, message: string) {
    return new Response(JSON.stringify({
        errorCode,
        message
    }), {
        status: 500 //TODO: 
    })
}

function createApiResponse<Return>(res: Return) {
    return Response.json(JSON.stringify(res), { status: 200 })
}