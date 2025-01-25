import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndDynamicPermission } from '@/auth/auther/RequirePermissionAndDynamicPermission'

export const readShopsAuther = RequirePermission.staticFields({ permission: 'SHOP_READ' })
export const readShopAuther = RequirePermission.staticFields({ permission: 'SHOP_READ' })
export const createShopAuther = RequirePermission.staticFields({ permission: 'SHOP_ADMIN' })
export const updateShopAuther = RequirePermission.staticFields({ permission: 'SHOP_ADMIN' })

export const readProductAuther = RequirePermission.staticFields({ permission: 'PRODUCT_READ' })
export const createProductAuther = RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' })
export const updateProductAuther = RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' })

// export const CreateProductForShop = RequirePermission.staticFields({ permission: ['PRODUCT_READ'] })

export const createPurchaseByStudentCardAuther = RequirePermissionAndDynamicPermission.staticFields({
    permission: 'PURCHASE_CREATE_ONBEHALF',
    dynamicPermission: 'PURCHASE_CREATE',
    errorMessage: 'Brukeren har ikke lov til å handle i butikker.'
})

export const createShopProductConnectionAuther = RequirePermission.staticFields({ permission: 'SHOP_ADMIN' })
