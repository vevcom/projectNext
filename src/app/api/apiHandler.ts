import 'server-only'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Permission } from '@prisma/client'

type APIHandler<Return> = (req: NextApiRequest) => Promise<Return>

export function apiHandler<GETReturn, POSTReturn, PUTReturn, DELETEReturn>(
    GET?: {
        permission: Permission,
        handler: APIHandler<GETReturn>
    },
    POST?: {
        permission: Permission,
        handler: APIHandler<POSTReturn>
    },
    PUT?: {
        permission: Permission,
        handler: APIHandler<PUTReturn>
    },
    DELETE?: {
        permission: Permission,
        handler: APIHandler<DELETEReturn>
    }
) {
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
