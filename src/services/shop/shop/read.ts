import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const readShops = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => prisma.shop.findMany()
})

export const readShop = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { shopId }: { shopId: number }) => {
        console.log(shopId)
        return await prisma.shop.findFirst({
            where: {
                id: shopId
            },
        })
    }
})
