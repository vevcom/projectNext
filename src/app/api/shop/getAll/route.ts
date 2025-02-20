import { apiHandler } from '@/app/api/apiHandler'
import { readShops } from '@/services/shop/shop/read'


export const GET = apiHandler({
    serviceMethod: readShops,
})
