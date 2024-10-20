import 'server-only'
import { ServiceMethod } from "@/services/ServiceMethod";
import { ReadJobAdAuther } from "./Authers";
import { read, readCurrent } from "./read";

export const JobAds = {
    read: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadJobAdAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: read,
    }),
    readCurrent: ServiceMethod({
        withData: false,
        hasAuther: true,
        auther: ReadJobAdAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: readCurrent,
    }),
} as const