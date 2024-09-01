import 'server-only'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type APIHandlerFunction<Return> = (req: NextRequest) => Promise<Return>
type Auther = { auth: (x: string) => boolean }
type APIHandler<Return> = {
    permission: Auther,
    handler: APIHandlerFunction<Return>
}

export function apiHandler<GETReturn, POSTReturn, PUTReturn, DELETEReturn>({
    GET,
    POST,
    PUT,
    DELETE
}: {
    GET?: APIHandler<GETReturn>,
    POST?: APIHandler<POSTReturn>,
    PUT?: APIHandler<PUTReturn>,
    DELETE?: APIHandler<DELETEReturn>
}) {
    return async function handler(req: NextRequest) {
        switch (req.method) {
            case 'GET':
                if (GET) {
                    const data = await GET.handler(req)
                    NextResponse.json(data, { status: 200 })
                } else {
                    NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
                }
                break
            case 'POST':
                if (POST) {
                    const data = await POST.handler(req)
                    NextResponse.json(data, { status: 200 })
                } else {
                    NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
                }
                break
            case 'PUT':
                if (PUT) {
                    const data = await PUT.handler(req)
                    NextResponse.json(data, { status: 200 })
                } else {
                    NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
                }
                break
            case 'DELETE':
                if (DELETE) {
                    const data = await DELETE.handler(req)
                    NextResponse.json(data, { status: 200 })
                } else {
                    NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
                }
                break
            default:
                NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
        }
    }
}
