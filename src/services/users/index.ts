import { CreateUserAuther, ReadUserAuther, UpdateUserAuther } from "./Authers";
import { ServiceMethod } from "../ServiceMethod";
import { readProfile } from "./read";
import { update } from "./update";
import { create } from "./create";

export const User = {
    readProfile: ServiceMethod({
        serviceMethodHandler: readProfile,
        auther: ReadUserAuther,
        withData: false,
        dynamicFields: ({ params }) => ({ username: params.username })
    }),
    update: ServiceMethod({
        serviceMethodHandler: update,
        auther: UpdateUserAuther,
        withData: true,
        dynamicFields: () => undefined
    }),
    create: ServiceMethod({
        serviceMethodHandler: create,
        auther: CreateUserAuther,
        withData: true,
        dynamicFields: () => undefined
    })
} as const