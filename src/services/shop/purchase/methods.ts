import '@pn-server-only'
import { purchaseAuthers } from './authers'
import { purchaseSchemas } from './schemas'
import { ServerError } from '@/services/error'
import { serviceMethod } from '@/services/serviceMethod'
import { userMethods } from '@/services/users/methods'
import { permissionMethods } from '@/services/permissions/methods'
import { userFilterSelection } from '@/services/users/config'
import { PurchaseMethod } from '@prisma/client'

export const purchaseMethods = {
    createByStudentCard: serviceMethod({
        authorizer: async ({ data }) => {
            let user
            try {
                user = await userMethods.read({
                    params: {
                        studentCard: data.studentCard,
                    },
                    bypassAuth: true,
                })
            } catch (e) {
                if (e instanceof ServerError && e.errorCode === 'NOT FOUND') {
                    throw new ServerError('NOT FOUND', 'Ingen brukere er koblet til studentkortet.')
                }
                throw e
            }

            const permissions = await permissionMethods.readPermissionsOfUser({
                bypassAuth: true,
                params: {
                    userId: user.id,
                },
            })

            return purchaseAuthers.createByStudentCard.dynamicFields({
                permissions,
            })
        },
        dataSchema: purchaseSchemas.createFromStudentCard,
        method: async ({ prisma, data }) => {
            if (data.products.length === 0) {
                throw new ServerError('BAD PARAMETERS', 'The list of products to buy cannot be empty')
            }

            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    studentCard: data.studentCard,
                },
                select: userFilterSelection,
            })

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
                throw new ServerError(
                    'BAD PARAMETERS',
                    'The product list contains invalid product ids for the specified shop'
                )
            }

            const productPriceMap = Object.fromEntries(
                productPrices.map(product => ([product.productId, product.price]))
            )

            // TODO: Create money transaction from sourceAccount to the account to the shop
            const productList = data.products.map(product => ({
                productId: product.id,
                quantity: product.quantity,
                price: productPriceMap[product.id] ?? 0
            }))

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
                            data: productList,
                        }
                    }
                }
            })

            // TODO: Return remaining balance in account

            return {
                remainingBalance: 191900,
                user,
                productList,
            }
        }
    })
}
