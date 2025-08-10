import '@pn-server-only'
import { PermissionAuthers } from './auther'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { z } from 'zod'


export namespace PermissionMethods {

    export const readDefaultPermissions = ServiceMethod({
        auther: () => PermissionAuthers.readDefaultPermissions.dynamicFields({}),
        method: async ({ prisma }) =>
            (await prisma.defaultPermission.findMany()).map(perm => perm.permission)
    })

    export const readPermissionsOfUser = ServiceMethod({
        auther: ServerOnlyAuther,
        paramsSchema: z.object({
            userId: z.number(),
        }),
        method: async ({ prisma, session, params }) => {
            const [defaultPermissions, groupPermissions] = await Promise.all([
                readDefaultPermissions.client(prisma).execute({
                    bypassAuth: true,
                    session,
                }),
                prisma.membership.findMany({
                    where: {
                        userId: params.userId,
                        active: true,
                    },
                    select: {
                        group: {
                            select: {
                                permissions: true
                            }
                        }
                    }
                })
            ])


            const groupPermsFlatten = groupPermissions.map(group =>
                group.group.permissions.map(permission => permission.permission)
            ).flat()
            const ret = defaultPermissions.concat(groupPermsFlatten)

            return ret.filter((permission, i) => ret.indexOf(permission) === i)
        }
    })

    export const readPermissionsOfGroup = ServiceMethod({
        auther: () => PermissionAuthers.readGroupPermissions.dynamicFields({}),
        paramsSchema: z.object({
            groupId: z.number()
        }),
        method: async ({ prisma, params }) => (await prisma.groupPermission.findMany({
            where: {
                groupId: params.groupId
            }
        })).map(permission => permission.permission)
    })
}
