import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissioAndUser } from '@/auth/auther/RequirePermissionAndUser'

export const ReadShops = RequirePermission.staticFields({ permission: 'SHOP_READ' })
export const ReadShop = RequirePermission.staticFields({ permission: 'SHOP_READ' })
export const CreateShop = RequirePermission.staticFields({ permission: 'SHOP_ADMIN' })
export const UpdateShop = RequirePermission.staticFields({ permission: 'SHOP_ADMIN' })

export const ReadProduct = RequirePermission.staticFields({ permission: 'PRODUCT_READ' })
export const CreateProduct = RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' })
export const UpdateProduct = RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' })

export const CreatePurchase = RequirePermissioAndUser.staticFields({ permission: 'PURCHASE_CREATE' })

