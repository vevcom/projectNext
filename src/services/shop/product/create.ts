import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createProductValidation } from '@/services/shop/validation'


export const createProduct = ServiceMethodHandler({
    withData: true,
    validation: createProductValidation,
    wantsToOpenTransaction: true,
    handler: async (prisma, _, data) => prisma.product.create({
        data
    })
})
