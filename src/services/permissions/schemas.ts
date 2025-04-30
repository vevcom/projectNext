import { Permission } from '@prisma/client'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export namespace PermissionSchemas {
    const permissions = zfd.repeatable(z.nativeEnum(Permission).array())

    export const updateGroupPermissions = z.object({ permissions })
    export const updateDefaultPermissions = z.object({ permissions })
}
