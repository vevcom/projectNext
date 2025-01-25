import { readProfile } from './read'
import { connectStudentCard, registerStudentCardInQueue, update } from './update'
import { create } from './create'
import { ServiceMethod } from '@/services/ServiceMethod'
import { connectUserStudentCardAuther, createUserAuther, readUserAuther, registerStudentCardInQueueAuther, updateUserAuther } from './authers'

export const User = {
    readProfile: ServiceMethod({
        serviceMethodHandler: readProfile,
        hasAuther: true,
        auther: readUserAuther,
        withData: false,
        dynamicFields: ({ params }) => ({ username: params.username })
    }),
    update: ServiceMethod({
        serviceMethodHandler: update,
        hasAuther: true,
        auther: updateUserAuther,
        withData: true,
        dynamicFields: () => ({})
    }),
    create: ServiceMethod({
        serviceMethodHandler: create,
        hasAuther: true,
        auther: createUserAuther,
        withData: true,
        dynamicFields: () => ({}),
    }),
    registerStudentCardInQueue: ServiceMethod({
        serviceMethodHandler: registerStudentCardInQueue,
        hasAuther: true,
        auther: registerStudentCardInQueueAuther,
        withData: false,
        dynamicFields: params => params.params,
    }),
    connectStudentCard: ServiceMethod({
        serviceMethodHandler: connectStudentCard,
        hasAuther: true,
        auther: connectUserStudentCardAuther,
        withData: true,
        dynamicFields: () => ({}),
    })
} as const
