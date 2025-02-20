import { apiHandler } from '@/app/api/apiHandler'
import { createPurchaseByStudentCard } from '@/services/shop/purchase/create'


export const POST = apiHandler({
    serviceMethod: createPurchaseByStudentCard,
})
