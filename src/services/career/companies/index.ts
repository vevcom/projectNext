import 'server-only'
import { ServiceMethod } from "@/services/ServiceMethod";
import { CreateCompanyAuther, ReadCompanyAuther, UpdateCompanyAuther } from "./Authers";
import { create } from "./create";
import { readPage } from './read'
import { update } from './update';
import { destroy } from './destroy';

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
    }),
    update: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: UpdateCompanyAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: update,
    }),
    destory: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: UpdateCompanyAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: destroy
    })
} as const