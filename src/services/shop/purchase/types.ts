import type { Product, PurchaseProduct } from '@/prisma-generated-pn-types'

export type ProductList = (
    Pick<Product, 'id'> &
    Pick<PurchaseProduct, 'quantity'>
)[]
