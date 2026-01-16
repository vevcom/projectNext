import { RequirePermissionAndDynamicPermission } from '@/auth/authorizer/RequirePermissionAndDynamicPermission'


export const purchaseAuth = {
    createByStudentCard: RequirePermissionAndDynamicPermission.staticFields({
        permission: 'PURCHASE_CREATE_ONBEHALF',
        dynamicPermission: 'PURCHASE_CREATE',
        errorMessage: 'Brukeren har ikke lov til å handle i butikker.'
    })
}
