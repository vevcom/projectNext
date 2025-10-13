import type { Shop } from '@prisma/client'
import type { ExtendedProduct } from '@/services/shop/product/types'


export type ExtendedShop = Shop & {
    products: ExtendedProduct[]
}
