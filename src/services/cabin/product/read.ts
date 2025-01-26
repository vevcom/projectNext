import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { readCabinProductAuther } from '@/services/cabin/authers'


export const readCabinProducts = ServiceMethod({
    auther: () => readCabinProductAuther.dynamicFields({}),
    method: ({ prisma }) => prisma.cabinProduct.findMany(),
})
