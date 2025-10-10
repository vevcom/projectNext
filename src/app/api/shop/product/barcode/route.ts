import { apiHandler } from '@/app/api/apiHandler'
import { productMethods } from '@/services/shop/product/methods'

export const POST = apiHandler({
    serviceMethod: productMethods.readByBarCode,
})
