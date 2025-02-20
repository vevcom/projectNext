'use server'

import { apiHandler } from '@/app/api/apiHandler'
import { readProductByBarCode } from '@/services/shop/product/read'

export const POST = apiHandler({
    serviceMethod: readProductByBarCode,
})
