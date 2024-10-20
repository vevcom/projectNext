import 'server-only'
import { ServiceMethod } from "@/services/ServiceMethod";
import { CreateCompanyAuther, ReadCompanyAuther } from "./Authers";
import { create } from "./create";
import { readPage } from './read'

export const Companies = {
    create: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateCompanyAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: create,
    }),
    readPage: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadCompanyAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: readPage,
    })
} as const