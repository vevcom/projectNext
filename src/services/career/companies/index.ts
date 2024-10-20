import 'server-only'
import { ServiceMethod } from "@/services/ServiceMethod";
import { CreateCompanyAuther } from "./Authers";
import { create } from "./create";

export const Companies = {
    create: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateCompanyAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: create,
    })
} as const