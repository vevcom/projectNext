import 'server-only'
import { ServiceMethod } from "../ServiceMethod";
import { CreateDotAuther, ReadDotAuther, ReadDotForUserAuther } from "./Authers";
import { create } from "./create";
import { readForUser, readWrappersForUser } from './read';
import { readPage } from './read';

export const Dots = {
    create: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateDotAuther,
        dynamicFields: ({ params }) => ({ userId: params.accuserId }),
        serviceMethodHandler: create,
    }),
    readForUser: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadDotForUserAuther,
        dynamicFields: ({ params }) => ({ userId: params.userId }),
        serviceMethodHandler: readForUser,
    }),
    readWrapperForUser: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadDotForUserAuther,
        dynamicFields: ({ params }) => ({ userId: params.userId }),
        serviceMethodHandler: readWrappersForUser,
    }),
    readPage: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadDotAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: readPage,
    })
} as const