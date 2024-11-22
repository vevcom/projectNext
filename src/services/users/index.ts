import {
    ConnectUserStudentCardAuther,
    CreateUserAuther,
    ReadUserAuther,
    RegisterStudentCardInQueueAuther,
    UpdateUserAuther } from './Authers'
import { readProfile } from './read'
import { connectStudentCard, registerStudentCardInQueue, update } from './update'
import { create } from './create'
import { ServiceMethod } from '@/services/ServiceMethod'

export const User = {
    readProfile: ServiceMethod({
        serviceMethodHandler: readProfile,
        hasAuther: true,
        auther: ReadUserAuther,
        withData: false,
        dynamicFields: ({ params }) => ({ username: params.username })
    }),
    update: ServiceMethod({
        serviceMethodHandler: update,
        hasAuther: true,
        auther: UpdateUserAuther,
        withData: true,
        dynamicFields: () => ({})
    }),
    create: ServiceMethod({
        serviceMethodHandler: create,
        hasAuther: true,
        auther: CreateUserAuther,
        withData: true,
        dynamicFields: () => ({}),
    }),
    registerStudentCardInQueue: ServiceMethod({
        serviceMethodHandler: registerStudentCardInQueue,
        hasAuther: true,
        auther: RegisterStudentCardInQueueAuther,
        withData: false,
        dynamicFields: params => params.params,
    }),
    connectStudentCard: ServiceMethod({
        serviceMethodHandler: connectStudentCard,
        hasAuther: true,
        auther: ConnectUserStudentCardAuther,
        withData: true,
        dynamicFields: () => ({}),
    })
} as const
