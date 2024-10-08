import 'server-only'
import { ServiceMethod } from "@/services/ServiceMethod"
import { create } from "./create"
import { CreateEventTagAuther } from "./Authers"

export const EventTags = {
    create: ServiceMethod({
        hasAuther: true,
        auther: CreateEventTagAuther,
        dynamicFields: () => ({}),
        withData: true,
        serviceMethodHandler: create,
    })
}