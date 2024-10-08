import 'server-only'
import { ServiceMethod } from "@/services/ServiceMethod"
import { create } from "./create"
import { CreateEventTagAuther } from "./Authers"
import { read, readAll } from './read'

export const EventTags = {
    create: ServiceMethod({
        hasAuther: true,
        auther: CreateEventTagAuther,
        dynamicFields: () => ({}),
        withData: true,
        serviceMethodHandler: create,
    }),
    read: ServiceMethod({
        hasAuther: false,
        withData: false,
        serviceMethodHandler: read,
    }),
    readAll: ServiceMethod({
        hasAuther: false,
        withData: false,
        serviceMethodHandler: readAll,
    }),
}