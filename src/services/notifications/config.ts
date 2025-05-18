import type { NotificationMethodGeneral } from './Types'


export namespace NotificationConfig {
    export const methodsDisplayMap = {
        email: 'E-post',
        emailWeekly: 'Ukentlig e-post',
        push: 'Push varslinger'
    } satisfies Record<keyof NotificationMethodGeneral, string>

    export const allMethodsOn: NotificationMethodGeneral = {
        email: true,
        emailWeekly: true,
        push: true,
    }

    export const allMethodsOff: NotificationMethodGeneral = {
        email: false,
        emailWeekly: false,
        push: false,
    }

    export const methodTypes = ['availableMethods', 'defaultMethods'] as const
    export const methods = ['email', 'emailWeekly', 'push'] as const satisfies (keyof NotificationMethodGeneral)[]
}

