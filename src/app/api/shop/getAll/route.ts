'use server'

import { Shop } from '@/services/shop'
import { apiHandler } from '@/app/api/apiHandler'


export const GET = apiHandler({
    serviceMethod: Shop.readShops,
    params: () => ({}),
})
