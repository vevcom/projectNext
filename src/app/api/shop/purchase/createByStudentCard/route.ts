import { apiHandler } from '@/app/api/apiHandler'
import { purchaseMethods } from '@/services/shop/purchase/methods'

export const POST = apiHandler({
    serviceMethod: purchaseMethods.createByStudentCard,
})
