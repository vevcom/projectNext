'use server'

import { apiHandler } from '@/app/api/apiHandler'
import { ProductMethods } from '@/services/shop/product/methods'

export const POST = apiHandler({
    serviceMethod: ProductMethods.readByBarCode,
})
