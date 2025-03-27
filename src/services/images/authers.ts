import { RequireNothing } from '@/auth/auther/RequireNothing'

//TODO: Implement proper authers
export namespace ImageAuthers {
    export const create = RequireNothing.staticFields({})
    export const createMany = RequireNothing.staticFields({})
    export const createSourcelessImage = RequireNothing.staticFields({})
    export const read = RequireNothing.staticFields({})
    export const readPage = RequireNothing.staticFields({})
    export const readSpecial = RequireNothing.staticFields({})
    export const update = RequireNothing.staticFields({})
    export const destroy = RequireNothing.staticFields({})
}
