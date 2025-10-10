import { apiHandler } from '@/app/api/apiHandler'
import { productOperations } from '@/services/shop/product/operations'

export const POST = apiHandler({
    serviceMethod: productOperations.readByBarCode,
})
