import { apiHandler } from '@/app/api/apiHandler'
import { PurchaseMethods } from '@/services/shop/purchase/methods'

export const POST = apiHandler({
    serviceMethod: PurchaseMethods.createByStudentCard,
})
