import { ServiceMethod } from "@/services/ServiceMethod";
import { ReadInterestGroupAuther } from "./Auther";
import { read, readAll } from "./read";

export const InterestGroups = {
    read: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadInterestGroupAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: read,
    }),
    readAll: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadInterestGroupAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: readAll,
    })
} as const