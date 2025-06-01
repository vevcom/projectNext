import type { NotificationMethodGeneral } from './Types'


export namespace NotificationConfig {
    export const methodsDisplayMap = {
        email: 'E-post',
        emailWeekly: 'Ukentlig e-post',
    } satisfies Record<keyof NotificationMethodGeneral, string>

    export const allMethodsOn: NotificationMethodGeneral = {
        email: true,
        emailWeekly: true,
    }

    export const allMethodsOff: NotificationMethodGeneral = {
        email: false,
        emailWeekly: false,
    }

    export const methodTypes = ['availableMethods', 'defaultMethods'] as const
    export const methods = ['email', 'emailWeekly'] as const satisfies (keyof NotificationMethodGeneral)[]
}

