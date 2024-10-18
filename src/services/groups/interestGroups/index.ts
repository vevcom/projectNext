import 'server-only'
import { ServiceMethod } from "@/services/ServiceMethod";
import { CreateInterestGroupAuther, ReadInterestGroupAuther, UpdateInterestGroupAuther } from "./Auther";
import { read, readAll } from "./read";
import { create } from './create';
import { update } from './update';

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
    }),
    update: ServiceMethod({
        withData: true,
        hasAuther: true,
        auther: UpdateInterestGroupAuther,
        dynamicFieldsAsync: async ({ params }) => ({ 
            groupId: (await read.client('NEW').execute(
                { params: { id: params.id }, session: null }
            ).then(interestGroup => interestGroup.groupId))
        }),
        serviceMethodHandler: update,
    }),
} as const