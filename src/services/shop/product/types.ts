import type { Product, ShopProduct } from '@prisma/client'


export type ExtendedProduct = Pick<ShopProduct, 'price' | 'active'> & Product
