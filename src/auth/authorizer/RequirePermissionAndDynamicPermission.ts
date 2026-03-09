import { AuthorizerFactory } from './Authorizer'
import type { Permission } from '@/prisma-generated-pn-types'

export const RequirePermissionAndDynamicPermission = AuthorizerFactory<
    {
        permission: Permission,
        dynamicPermission: Permission,
        errorMessage?: string
    },
    {
        permissions: Permission[],
    },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields, dynamicFields }) => {
    if (!session.permissions.includes(staticFields.permission)) {
        return {
            success: false,
            session,
            errorMessage: `Du trenger tillatelse '${staticFields.permission}' for å få tilgang`
        }
    }

    const dynamicPermissionsPassed = dynamicFields.permissions.includes(staticFields.dynamicPermission)

    return {
        success: dynamicPermissionsPassed,
        session,
        errorMessage: dynamicPermissionsPassed ? undefined : staticFields.errorMessage
    }
})
