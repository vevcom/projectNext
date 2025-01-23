import 'server-only'
import {
    CreateProduct,
    CreatePurchaseByStudentCard,
    CreateShop,
    CreateShopProductConnection,
    ReadProduct,
    ReadShop,
    ReadShops,
    UpdateProduct
} from './Authers'
import { readShop, readShops } from './shop/read'
import { createShop } from './shop/create'
import { readProduct, readProductByBarCode, readProducts } from './product/read'
import { createProduct, createProductForShop, createShopProductConnection } from './product/create'
import { createPurchaseByStudentCard } from './purchase/create'
import { updateProduct, updateProductForShop } from './product/update'
import { readUser } from '@/services/users/read'
import { readPermissionsOfUser } from '@/services/permissionRoles/read'
import { ServiceMethod } from '@/services/ServiceMethod'

export const Shop = {
    readShops: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadShops,
        dynamicFields: () => ({}),
        serviceMethodHandler: readShops,
    }),
    readShop: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadShop,
        dynamicFields: () => ({}),
        serviceMethodHandler: readShop,
    }),
    createShop: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateShop,
        dynamicFields: () => ({}),
        serviceMethodHandler: createShop,
    }),
    readProducts: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadProduct,
        dynamicFields: () => ({}),
        serviceMethodHandler: readProducts,
    }),
    readProduct: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadProduct,
        dynamicFields: () => ({}),
        serviceMethodHandler: readProduct,
    }),
    readProductByBarCode: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: ReadProduct,
        dynamicFields: () => ({}),
        serviceMethodHandler: readProductByBarCode,
    }),
    createProduct: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateProduct,
        dynamicFields: () => ({}),
        serviceMethodHandler: createProduct,
    }),
    createProductForShop: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateProduct,
        dynamicFields: () => ({}), // So this doesn't need dynamic field???
        serviceMethodHandler: createProductForShop,
    }),
    updateProduct: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: UpdateProduct,
        dynamicFields: () => ({}),
        serviceMethodHandler: updateProduct,
    }),
    updateProductForShop: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: UpdateProduct,
        dynamicFields: () => ({}),
        serviceMethodHandler: updateProductForShop,
    }),
    createPurchaseByStudentCard: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreatePurchaseByStudentCard,
        dynamicFieldsAsync: async ({ data }) => {
            const user = await readUser({
                studentCard: data.studentCard,
            })
            await readPermissionsOfUser(user.id)
            return { permissions: [] }
        },
        serviceMethodHandler: createPurchaseByStudentCard,
    }),
    createShopProductConnection: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateShopProductConnection,
        dynamicFields: () => ({}),
        serviceMethodHandler: createShopProductConnection,
    }),
} as const
