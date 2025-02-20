import 'server-only'
import { readAllLicensesAuther } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'

export const readAllLicenses = ServiceMethod({
    auther: () => readAllLicensesAuther.dynamicFields({}),
    method: async ({ prisma }) => await prisma.license.findMany()
})
