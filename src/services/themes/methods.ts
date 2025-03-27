import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ThemeSchemas } from './schemas'
import { ThemeAuthers } from './authers'
import { z } from 'zod'

export namespace ThemeMethods {
    export const create = ServiceMethod({
        auther: () => ThemeAuthers.create.dynamicFields({}),
        dataSchema: ThemeSchemas.create,
        method: async ({ data }) => {
            console.log(data)

            if (!/^#([0-9A-F]{3}){1,2}$/i.test(data.primaryLight)) {
                throw new Error('Invalid hex color code')
            }
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(data.primaryDark)) {
                throw new Error('Invalid hex color code')
            }
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(data.secondaryLight)) {
                throw new Error('Invalid hex color code')
            }
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(data.secondaryDark)) {
                throw new Error('Invalid hex color code')
            }

            const primaryLightR = parseInt(data.primaryLight.slice(1, 3), 16)
            const primaryLightG = parseInt(data.primaryLight.slice(3, 5), 16)
            const primaryLightB = parseInt(data.primaryLight.slice(5, 7), 16)
            const primaryDarkR = parseInt(data.primaryDark.slice(1, 3), 16)
            const primaryDarkG = parseInt(data.primaryDark.slice(3, 5), 16)
            const primaryDarkB = parseInt(data.primaryDark.slice(5, 7), 16)
            const secondaryLightR = parseInt(data.secondaryLight.slice(1, 3), 16)
            const secondaryLightG = parseInt(data.secondaryLight.slice(3, 5), 16)
            const secondaryLightB = parseInt(data.secondaryLight.slice(5, 7), 16)
            const secondaryDarkR = parseInt(data.secondaryDark.slice(1, 3), 16)
            const secondaryDarkG = parseInt(data.secondaryDark.slice(3, 5), 16)
            const secondaryDarkB = parseInt(data.secondaryDark.slice(5, 7), 16)

            return await prisma.theme.create({
                data: {
                    name: data.name,
                    primaryLightR,
                    primaryLightG,
                    primaryLightB,
                    primaryDarkR,
                    primaryDarkG,
                    primaryDarkB,
                    secondaryLightR,
                    secondaryLightG,
                    secondaryLightB,
                    secondaryDarkR,
                    secondaryDarkG,
                    secondaryDarkB
                }
            })
        }
    })
    export const update = ServiceMethod({
        auther: () => ThemeAuthers.update.dynamicFields({}),
        dataSchema: ThemeSchemas.update,
        paramsSchema: z.object({
            id: z.number()
        }),
        method: async ({ prisma, data, params }) => {
                if (data.primaryLight && !/^#([0-9A-F]{3}){1,2}$/i.test(data.primaryLight)) {
                    throw new Error('Invalid hex color code')
                }
                if (data.primaryDark && !/^#([0-9A-F]{3}){1,2}$/i.test(data.primaryDark)) {
                    throw new Error('Invalid hex color code')
                }
                if (data.secondaryLight && !/^#([0-9A-F]{3}){1,2}$/i.test(data.secondaryLight)) {
                    throw new Error('Invalid hex color code')
                }
                if (data.secondaryDark && !/^#([0-9A-F]{3}){1,2}$/i.test(data.secondaryDark)) {
                    throw new Error('Invalid hex color code')
                }
        
                const primaryLightR = data.primaryLight ? parseInt(data.primaryLight.slice(1, 3), 16) : undefined
                const primaryLightG = data.primaryLight ? parseInt(data.primaryLight.slice(3, 5), 16) : undefined
                const primaryLightB = data.primaryLight ? parseInt(data.primaryLight.slice(5, 7), 16) : undefined
                const primaryDarkR = data.primaryDark ? parseInt(data.primaryDark.slice(1, 3), 16) : undefined
                const primaryDarkG = data.primaryDark ? parseInt(data.primaryDark.slice(3, 5), 16) : undefined
                const primaryDarkB = data.primaryDark ? parseInt(data.primaryDark.slice(5, 7), 16) : undefined
                const secondaryLightR = data.secondaryLight ? parseInt(data.secondaryLight.slice(1, 3), 16) : undefined
                const secondaryLightG = data.secondaryLight ? parseInt(data.secondaryLight.slice(3, 5), 16) : undefined
                const secondaryLightB = data.secondaryLight ? parseInt(data.secondaryLight.slice(5, 7), 16) : undefined
                const secondaryDarkR = data.secondaryDark ? parseInt(data.secondaryDark.slice(1, 3), 16) : undefined
                const secondaryDarkG = data.secondaryDark ? parseInt(data.secondaryDark.slice(3, 5), 16) : undefined
                const secondaryDarkB = data.secondaryDark ? parseInt(data.secondaryDark.slice(5, 7), 16) : undefined
        
                return await prisma.theme.update({
                    where: {
                        id: params.id
                    },
                    data: {
                        name: data.name,
                        primaryLightR,
                        primaryLightG,
                        primaryLightB,
                        primaryDarkR,
                        primaryDarkG,
                        primaryDarkB,
                        secondaryLightR,
                        secondaryLightG,
                        secondaryLightB,
                        secondaryDarkR,
                        secondaryDarkG,
                        secondaryDarkB,
                    }
                })
            }
        })
    export const read = ServiceMethod({
        auther: () => ThemeAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number()
        }),
        method : async ({ prisma, params }) => await prisma.theme.findUniqueOrThrow({
            where: {
                id: params.id
            }
        })
    })
    export const readAll = ServiceMethod({
        auther: () => ThemeAuthers.readAll.dynamicFields({}),
        method : async ({ prisma }) => await prisma.theme.findMany()
    })
    export const destroy = ServiceMethod({
        auther: () => ThemeAuthers.destroy.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number()
        }),
        method : async ({ prisma, params }) => await prisma.theme.delete({
            where: {
                id: params.id
            }
        })
    })
} 
