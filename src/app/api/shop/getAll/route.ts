import { apiHandler } from '@/app/api/apiHandler'
import { shopOperations } from '@/services/shop/shop/operations'

export const GET = apiHandler({
    serviceOperation: shopOperations.readMany,
})
