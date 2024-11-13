import 'server-only'
import { CreateShop, ReadShop, ReadShops } from './Authers'
import { readShop, readShops } from './shop/read'
import { createShop } from './shop/create'
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
    })
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
