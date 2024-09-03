import 'server-only'
import { Session } from '@/auth/Session'
import type { ServiceMethod } from '@/services/ServiceMethod'
import type { NextRequest } from 'next/server'
import type { Auther } from '@/auth/auther/Auther'

type APIHandler<
    Return extends object,
    DynamicFields extends object,
    TypeValidationType,
    DetailedValidationType,
    Params extends object,
> = {
    auther: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED', DynamicFields>,
    serviceMethod: ServiceMethod<TypeValidationType, DetailedValidationType, Params, Return>
}

export function apiHandler<
    Return extends object,
    DynamicFields extends object,
    TypeValidationType,
    DetailedValidationType,
    Params extends object,
>({
    auther,
    serviceMethod,
}: APIHandler<Return, DynamicFields, TypeValidationType, DetailedValidationType, Params>) {
    return async function handler(req: NextRequest) {
        const data = req.body
        console.log(data)

        const authorization = req.headers.get('authorization')
        const session = await Session.fromApiKey(authorization)
        //const authRes = auther.auth({ session })
    }
}
