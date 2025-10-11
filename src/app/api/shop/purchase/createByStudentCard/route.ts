import { apiHandler } from '@/app/api/apiHandler'
import { purchaseOperations } from '@/services/shop/purchase/operations'

export const POST = apiHandler({
    serviceOperation: purchaseOperations.createByStudentCard,
})
