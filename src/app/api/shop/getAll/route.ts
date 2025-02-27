'use server'

import { apiHandler } from '@/app/api/apiHandler'
import { ShopMethods } from '@/services/shop/shop/methods'

export const GET = apiHandler({
    serviceMethod: ShopMethods.readMany,
})
