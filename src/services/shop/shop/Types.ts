import type { Shop } from '@prisma/client'
import type { ExtendedProduct } from '@/services/shop/product/Types'


export type ExtendedShop = Shop & {
    products: ExtendedProduct[]
}
