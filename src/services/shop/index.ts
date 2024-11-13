import 'server-only'
import { CreateProduct, CreateShop, ReadProduct, ReadShop, ReadShops } from './Authers'
import { readShop, readShops } from './shop/read'
import { createShop } from './shop/create'
import { readProducts } from './product/read'
import { createProduct } from './product/create'
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
    createProduct: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateProduct,
        dynamicFields: () => ({}),
        serviceMethodHandler: createProduct,
    }),
    // readWrapperForUser: ServiceMethod({
    //     withData: false,
    //     hasAuther: true,
    //     auther: ReadDotForUserAuther,
    //     dynamicFields: ({ params }) => ({ userId: params.userId }),
    //     serviceMethodHandler: readWrappersForUser,
    // }),
    // readPage: ServiceMethod({
    //     withData: false,
    //     hasAuther: true,
    //     auther: ReadDotAuther,
    //     dynamicFields: () => ({}),
    //     serviceMethodHandler: readPage,
    // })
} as const
