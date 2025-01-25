import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { createShopValidation } from '@/services/shop/validation'
import { createShopAuther } from '../authers'


export const createShop = ServiceMethod({
    auther: () => createShopAuther.dynamicFields({}),
    dataValidation: createShopValidation,
    method: async ({ prisma, data }) => prisma.shop.create({
        data
    })
})
