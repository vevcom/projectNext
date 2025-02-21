import { RequireNothing } from '@/auth/auther/RequireNothing'
import { createSourcelessImage } from './methods'

//TODO: Implement authers
export const imageAuthers = {
    create: RequireNothing.staticFields({}),
    createMany: RequireNothing.staticFields({}),
    createSourcelessImage: RequireNothing.staticFields({}),
    readPage: RequireNothing.staticFields({}),
    read: RequireNothing.staticFields({}),
    readSpecial: RequireNothing.staticFields({}),
} as const
