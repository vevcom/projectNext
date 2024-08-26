import 'server-only'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Permission } from '@prisma/client'

type APIHandlerFunction<Return> = (req: NextApiRequest) => Promise<Return>
type APIHandler<Return> = {
    permission: Permission,
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
    return async function handler(req: NextApiRequest, res: NextApiResponse) {
        switch (req.method) {
            case 'GET':
                if (GET) {
                    const data = await GET.handler(req)
                    res.json(data)
                } else {
                    res.status(405).end()
                }
                break
            case 'POST':
                if (POST) {
                    const data = await POST.handler(req)
                    res.json(data)
                } else {
                    res.status(405).end()
                }
                break
            case 'PUT':
                if (PUT) {
                    const data = await PUT.handler(req)
                    res.json(data)
                } else {
                    res.status(405).end()
                }
                break
            case 'DELETE':
                if (DELETE) {
                    const data = await DELETE.handler(req)
                    res.json(data)
                } else {
                    res.status(405).end()
                }
                break
            default:
                res.status(405).end()
        }
    }
}
