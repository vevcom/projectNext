import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { createCabinProductAuther } from '@/services/cabin/authers'
import { createCabinProductValidation } from '@/services/cabin/validation'

export const createCabinProduct = ServiceMethod({
    auther: () => createCabinProductAuther.dynamicFields({}),
    dataValidation: createCabinProductValidation,
    method: ({ prisma, data }) => prisma.cabinProduct.create({
        data,
    })
})
