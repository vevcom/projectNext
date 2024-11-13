import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createShopValidation } from '@/services/shop/validation'


export const createShop = ServiceMethodHandler({
    withData: true,
    validation: createShopValidation,
    wantsToOpenTransaction: true,
    handler: async (prisma, _, data) => prisma.shop.create({
        data
    })
})
