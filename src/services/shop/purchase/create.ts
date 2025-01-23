import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createPurchaseFromStudentCardValidation } from '@/services/shop/validation'
import { ServerError } from '@/services/error'
import { userFilterSelection } from '@/services/users/ConfigVars'
import { PurchaseMethod } from '@prisma/client'


export const createPurchaseByStudentCard = ServiceMethodHandler({
    withData: true,
    wantsToOpenTransaction: false,
    validation: createPurchaseFromStudentCardValidation,
    handler: async (prisma, _, data) => {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                studentCard: data.studentCard,
            },
            select: userFilterSelection
        })

        if (data.products.length === 0) throw new ServerError('BAD PARAMETERS', 'The list of product to buy cannot be empty')

        // Find the price of the different products
        const productPrices = await prisma.shopProduct.findMany({
            where: {
                shopId: data.shopId,
                active: true,
                OR: data.products.map(product => ({
                    productId: product.id,
                }))
            }
        })

        if (productPrices.length !== data.products.length) {
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
                        id: data.shopId,
                    },
                },
                method: PurchaseMethod.STUDENT_CARD,
                PurchaseProduct: {
                    createMany: {
                        data: data.products.map(product => ({
                            productId: product.id,
                            quantity: product.quantity,
                            price: productPriceMap[product.id] ?? 0
                        }))
                    }
                }
            }
        })

        // TODO: Return remaining balance in account

        return {
            remainingBalance: 15100,
            user,
        }
    }
})

