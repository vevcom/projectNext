import 'server-only'
import { ServiceMethod } from "../ServiceMethod";
import { CreateDotAuther, ReadDotAuther } from "./Authers";
import { create } from "./create";
import { readActive } from './read';

export const Dots = {
    create: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateDotAuther,
        dynamicFields: ({ params }) => ({ userId: params.accuserId }),
        serviceMethodHandler: create,
    }),
    readActive: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadDotAuther,
        dynamicFields: ({ params }) => ({ userId: params.userId }),
        serviceMethodHandler: readActive,
    }),
} as const