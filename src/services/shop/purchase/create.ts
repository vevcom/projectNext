import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createPurchaseFromStudentCardValidation } from '@/services/shop/validation'
import { ServerError } from '@/services/error'
import { type PrismaClient, PurchaseMethod } from '@prisma/client'
import type { ProductList } from './Types'


export const createPurchaseByStudentCard = ServiceMethodHandler({
    withData: true,
    wantsToOpenTransaction: true,
    validation: createPurchaseFromStudentCardValidation,
    handler: async (prisma, _, data) => {
        await createPurchase(prisma, PurchaseMethod.STUDENT_CARD, data.shopId, 0, data.products)
    }
})

async function createPurchase(
    prisma: PrismaClient,
    method: PurchaseMethod,
    shopId: number,
    sourceAccount: number,
    productList: ProductList
) {
    if (productList.length === 0) throw new ServerError('BAD PARAMETERS', 'The list of product to buy cannot be empty')

    // Find the price of the different products
    const productPrices = await prisma.shopProduct.findMany({
        where: {
            shopId,
            active: true,
            OR: productList.map(product => ({
                productId: product.id,
            }))
        }
    })

    if (productPrices.length !== productList.length) {
        throw new ServerError('BAD PARAMETERS', 'The product list contains invalid product ids for the specified shop')
    }

    const productPriceMap = Object.fromEntries(
        productPrices.map(product => ([product.productId, product.price]))
    )

    // TODO: Create money transaction from sourceAccount to the account to the shop

    await prisma.purchase.create({
        data: {
            shop: {
                connect: {
                    id: shopId,
                },
            },
            method,
            PurchaseProduct: {
                createMany: {
                    data: productList.map(product => ({
                        productId: product.id,
                        quantity: product.quantity,
                        price: productPriceMap[product.id] ?? 0
                    }))
                }
            }
        }
    })

    // TODO: Return remaining balance in account
}
