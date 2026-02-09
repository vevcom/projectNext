import { RequireNothing } from '@/auth/authorizer/RequireNothing'

//TODO: Implement proper authorizers
export const imageAuth = {
    create: RequireNothing.staticFields({}),
    createMany: RequireNothing.staticFields({}),
    createSourcelessImage: RequireNothing.staticFields({}),
    read: RequireNothing.staticFields({}),
    readPage: RequireNothing.staticFields({}),
    readSpecial: RequireNothing.staticFields({}),
    update: RequireNothing.staticFields({}),
    destroy: RequireNothing.staticFields({}),
}
