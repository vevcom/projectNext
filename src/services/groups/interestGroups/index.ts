import 'server-only'
import { ServiceMethod } from "@/services/ServiceMethod";
import { CreateInterestGroupAuther, ReadInterestGroupAuther } from "./Auther";
import { read, readAll } from "./read";
import { create } from './create';

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
    }),
    create: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateInterestGroupAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: create,
    })
} as const