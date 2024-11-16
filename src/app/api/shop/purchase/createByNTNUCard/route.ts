import { apiHandler } from '@/app/api/apiHandler'
import { Shop } from '@/services/shop'


export const POST = apiHandler({
    serviceMethod: Shop.createPurchase,
    params: () => ({}),
})
