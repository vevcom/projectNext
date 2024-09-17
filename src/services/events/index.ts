import 'server-only'
import { ServiceMethod } from "../ServiceMethod";
import { CreateEventAuther } from "./Authers";
import { create } from "./create";

export const Events = {
    create: ServiceMethod({
        withData: true,
        serviceMethodHandler: create,
        hasAuther: true,
        auther: CreateEventAuther,
        dynamicFields: () => ({})
    })
} as const