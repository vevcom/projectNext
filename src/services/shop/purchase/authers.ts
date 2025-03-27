import { RequirePermissionAndDynamicPermission } from '@/auth/auther/RequirePermissionAndDynamicPermission'


export namespace PurchaseAuthers {
    export const createByStudentCard = RequirePermissionAndDynamicPermission.staticFields({
        permission: 'PURCHASE_CREATE_ONBEHALF',
        dynamicPermission: 'PURCHASE_CREATE',
        errorMessage: 'Brukeren har ikke lov til å handle i butikker.'
    })
}
