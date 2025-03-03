import { LockerLocationAuthers } from './authers'
import { createLockerLocationValidation } from './validation'
import { ServiceMethod } from '@/services/ServiceMethod'

export namespace LockerLocationMethods {
    /**
     * Creates a new locker location.
     *
     * @param data - Building and floor of the locker location.
     *
     * @returns The newly created locker location object.
     */
    export const create = ServiceMethod({
        auther: () => LockerLocationAuthers.create.dynamicFields({}),
        dataValidation: createLockerLocationValidation,
        method: async ({ prisma, data }) => prisma.lockerLocation.create({
            data: {
                building: data.building,
                floor: data.floor
            }
        })
    })

    /**
     * Reads all locker locations.
     *
     * @returns All locker location objects.
     */
    export const readAll = ServiceMethod({
        auther: () => LockerLocationAuthers.readAll.dynamicFields({}),
        method: async ({ prisma }) => prisma.lockerLocation.findMany()
    })
}
