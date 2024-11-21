import 'server-only'
import { CreateProduct, CreatePurchaseByStudentCard, CreateShop, CreateShopProductConnection, ReadProduct, ReadShop, ReadShops, UpdateProduct } from './Authers'
import { readShop, readShops } from './shop/read'
import { createShop } from './shop/create'
import { readProductByBarCode, readProducts } from './product/read'
import { createProduct, createProductForShop, createShopProductConnection } from './product/create'
import { createPurchaseByStudentCard } from './purchase/create'
import { ServiceMethod } from '@/services/ServiceMethod'
import { updateProductForShop } from './product/update'

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
        dynamicFields: () => ({}),
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
