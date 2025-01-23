import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndDynamicPermission } from '@/auth/auther/RequirePermissionAndDynamicPermission'

export const ReadShops = RequirePermission.staticFields({ permission: 'SHOP_READ' })
export const ReadShop = RequirePermission.staticFields({ permission: 'SHOP_READ' })
export const CreateShop = RequirePermission.staticFields({ permission: 'SHOP_ADMIN' })
export const UpdateShop = RequirePermission.staticFields({ permission: 'SHOP_ADMIN' })

export const ReadProduct = RequirePermission.staticFields({ permission: 'PRODUCT_READ' })
export const CreateProduct = RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' })
export const UpdateProduct = RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' })

// export const CreateProductForShop = RequirePermission.staticFields({ permission: ['PRODUCT_READ'] })

export const CreatePurchaseByStudentCard = RequirePermissionAndDynamicPermission.staticFields({
    permission: 'PURCHASE_CREATE_ONBEHALF',
    dynamicPermission: 'PURCHASE_CREATE',
})

export const CreateShopProductConnection = RequirePermission.staticFields({ permission: 'SHOP_ADMIN' })
