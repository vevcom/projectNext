import type { Product, Shop, ShopProduct } from '@prisma/client'
import type { Pick } from '@prisma/client/runtime/library'


export type ExtendedShop = Shop & {
    products: (Product & Pick<ShopProduct, 'price'>)[]
}
