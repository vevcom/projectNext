import 'server-only'
import { Session } from '@/auth/Session'
import type { ServiceMethod } from '@/services/ServiceMethod'
import type { NextRequest } from 'next/server'
import type { Auther } from '@/auth/auther/Auther'

type APIHandler<
    WithValidation extends boolean,
    Return extends object,
    TypeValidationType,
    DetailedValidationType,
    Params extends object,
    DynamicFields extends object | undefined,
> = {
    auther: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED', DynamicFields>,
    serviceMethod: ServiceMethod<WithValidation, TypeValidationType, DetailedValidationType, Params, Return>
}

export function apiHandler<
    WithValidation extends boolean,
    Return extends object,
    TypeValidationType,
    DetailedValidationType,
    Params extends object,
    DynamicFields extends object | undefined,
>({
    auther,
    serviceMethod,
}: APIHandler<WithValidation, Return, TypeValidationType, DetailedValidationType, Params, DynamicFields>) {
    return async function handler(req: NextRequest) {
        const data = req.body
        console.log(data)

        const authorization = req.headers.get('authorization')
        const session = await Session.fromApiKey(authorization)
        //const authRes = auther.auth({ session })
    }
}
