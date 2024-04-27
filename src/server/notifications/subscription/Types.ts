import { Prisma } from "@prisma/client"
import { allMethodsOn } from "../Types"


export type Subscription = Prisma.NotificationSubscriptionGetPayload<{
    include: {
        methods: {
            select: typeof allMethodsOn
        },
    }
}>