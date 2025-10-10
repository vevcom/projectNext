import { lockerLocationAuthers } from './authers'
import { lockersSchemas } from '@/services/lockers/schemas'
import { defineOperation } from '@/services/serviceOperation'

export const lockerLocationMethods = {
    /**
     * Creates a new locker location.
     *
     * @param data - Building and floor of the locker location.
     *
     * @returns The newly created locker location object.
     */
    create: defineOperation({
        authorizer: () => lockerLocationAuthers.create.dynamicFields({}),
        dataSchema: lockersSchemas.createLocation,
        operation: async ({ prisma, data }) => prisma.lockerLocation.create({
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
    readAll: defineOperation({
        authorizer: () => lockerLocationAuthers.readAll.dynamicFields({}),
        operation: async ({ prisma }) => prisma.lockerLocation.findMany()
    }),
}
