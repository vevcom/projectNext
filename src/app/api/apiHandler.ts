import 'server-only'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Auther } from '@/auth/auther/Auther'

abstract class ServerFunction<Params extends object, Data extends object, Return extends object> {
    public abstract runOnUnsecureData(params: Params, data: unknown) : Return
    public abstract run(params: Params, data: Data) : Return
}

type APIHandler<Return, DynamicFields extends object> = {
    permission: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED', DynamicFields>,
    handler: APIHandlerFunction<Return>
}

export function apiHandler<Return, DynamicFields extends object>({
    auther,
    handler
}: {
    auther: Auther<'USER_NOT_REQUIERED_FOR_AUTHORIZED', DynamicFields>,
    handler: ServerFunction
}) {
    return async function handler(req: NextRequest) {
        
    }
}
