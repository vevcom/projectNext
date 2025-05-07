import { UserConfig } from '@/services/users/config'

export namespace EventRegistrationConfig {

    export const includer = {
        user: {
            select: UserConfig.filterSelection,
        },
    }
}
