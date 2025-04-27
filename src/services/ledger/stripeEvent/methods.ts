import { RequireNothing } from '@/auth/auther/RequireNothing'
import { ServiceMethod } from '@/services/ServiceMethod'

export namespace StripeEventMethods {
    export const handleEvent = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        // TODO: Find out to how to validate stripe data
        method: async ({}) => {
        }
    })
}
