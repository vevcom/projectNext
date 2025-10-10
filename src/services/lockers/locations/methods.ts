import { lockerLocationAuthers } from './authers'
import { lockersSchemas } from '@/services/lockers/schemas'
import { serviceMethod } from '@/services/serviceMethod'

export const lockerLocationMethods = {
    /**
     * Creates a new locker location.
     *
     * @param data - Building and floor of the locker location.
     *
     * @returns The newly created locker location object.
     */
    create: serviceMethod({
        authorizer: () => lockerLocationAuthers.create.dynamicFields({}),
        dataSchema: lockersSchemas.createLocation,
        method: async ({ prisma, data }) => prisma.lockerLocation.create({
            data: {
                building: data.building,
                floor: data.floor
            }
        })
    }),

    /**
     * Reads all locker locations.
     *
     * @returns All locker location objects.
     */
    readAll: serviceMethod({
        authorizer: () => lockerLocationAuthers.readAll.dynamicFields({}),
        method: async ({ prisma }) => prisma.lockerLocation.findMany()
    }),
}
