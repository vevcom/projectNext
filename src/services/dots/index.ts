import 'server-only'
import { ServiceMethod } from "../ServiceMethod";
import { CreateDotAuther } from "./Authers";
import { create } from "./create";

export const Dots = {
    create: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateDotAuther,
        dynamicFields: ({ params }) => ({ userId: params.accuserId }),
        serviceMethodHandler: create,
    })
} as const