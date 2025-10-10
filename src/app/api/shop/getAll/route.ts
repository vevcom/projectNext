import { apiHandler } from '@/app/api/apiHandler'
import { shopMethods } from '@/services/shop/shop/methods'

export const GET = apiHandler({
    serviceMethod: shopMethods.readMany,
})
