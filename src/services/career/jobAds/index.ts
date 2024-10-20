import 'server-only'
import { ServiceMethod } from "@/services/ServiceMethod";
import { CreateJobAdAuther, ReadJobAdAuther, UpdateJobAdAuther } from "./Authers";
import { read, readCurrent } from "./read";
import { create } from './create';
import { update } from './update';

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
    create: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: CreateJobAdAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: create,
    }),
    update: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: UpdateJobAdAuther,
        dynamicFields: () => ({}),
        serviceMethodHandler: update,
    }),
} as const