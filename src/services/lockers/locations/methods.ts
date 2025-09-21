import { LockerLocationAuthers } from './authers'
import { LockersSchemas } from '@/services/lockers/schemas'
import { serviceMethod } from '@/services/serviceMethod'

export namespace LockerLocationMethods {
    /**
     * Creates a new locker location.
     *
     * @param data - Building and floor of the locker location.
     *
     * @returns The newly created locker location object.
     */
    export const create = serviceMethod({
        authorizer: () => LockerLocationAuthers.create.dynamicFields({}),
        dataSchema: LockersSchemas.createLocation,
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
    export const readAll = serviceMethod({
        authorizer: () => LockerLocationAuthers.readAll.dynamicFields({}),
        method: async ({ prisma }) => prisma.lockerLocation.findMany()
    })
}
