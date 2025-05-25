import type { Product, PurchaseProduct } from '@prisma/client'

export type ProductList = (
    Pick<Product, 'id'> &
    Pick<PurchaseProduct, 'quantity'>
)[]
