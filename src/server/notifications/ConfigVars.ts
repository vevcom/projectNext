import { NotificationMethod } from "./Types";



export const notificationMethodsDisplayMap = {
    email: "Epost",
    emailWeekly: "Ukentlig epost",
    push: "Push varslinger"
} satisfies Record<keyof NotificationMethod, string>;