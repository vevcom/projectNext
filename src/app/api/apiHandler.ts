import 'server-only'
import type { NextRequest } from 'next/server'
import type { Auther } from '@/auth/auther/Auther'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'
import { Session } from '@/auth/Session'

type APIHandler<
    Return extends object, 
    DynamicFields extends object,
    TypeValidation extends z.ZodRawShape,
    DetailedValidation extends z.ZodRawShape,
    Params extends object,
> = {
    permission: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED', DynamicFields>,
    serviceMethod: ServiceMethod<TypeValidation, DetailedValidation, Params, Return>
}

export function apiHandler<
    Return extends object, 
    DynamicFields extends object,
    TypeValidation extends z.ZodRawShape,
    DetailedValidation extends z.ZodRawShape,
    Params extends object,
>({
    auther,
    serviceMethod,
}: {
    auther: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED', DynamicFields>,
    serviceMethod: ServiceMethod<TypeValidation, DetailedValidation, Params, Return>
}) {
    return async function handler(req: NextRequest) {
        const data = req.body
        console.log(data)

        const authorization = req.headers.get('authorization')
        const session = await Session.fromApiKey(authorization)
        //const authRes = auther.auth({ session })
    }
}
