import 'server-only'
import { updateThemeColorValidation } from './validation'
import { ServiceMethodHandler } from "../ServiceMethodHandler"

export const update = ServiceMethodHandler({
    withData: true,
    validation: updateThemeColorValidation,
    handler: async (prisma, { id }: {id: number}, { name, primaryLight, primaryDark, secondaryLight, secondaryDark, ...data }) => {
        if (primaryLight && !/^#([0-9A-F]{3}){1,2}$/i.test(primaryLight)) {
            throw new Error('Invalid hex color code')
        }
        if (primaryDark && !/^#([0-9A-F]{3}){1,2}$/i.test(primaryDark)) {
            throw new Error('Invalid hex color code')
        }
        if (secondaryLight && !/^#([0-9A-F]{3}){1,2}$/i.test(secondaryLight)) {
            throw new Error('Invalid hex color code')
        }
        if (secondaryDark && !/^#([0-9A-F]{3}){1,2}$/i.test(secondaryDark)) {
            throw new Error('Invalid hex color code')
        }

        const primaryLightR = primaryLight ? parseInt(primaryLight.slice(1, 3), 16) : undefined
        const primaryLightG = primaryLight ? parseInt(primaryLight.slice(3, 5), 16) : undefined
        const primaryLightB =  primaryLight ? parseInt(primaryLight.slice(5, 7), 16) : undefined
        const primaryDarkR = primaryDark ? parseInt(primaryDark.slice(1, 3), 16) : undefined
        const primaryDarkG = primaryDark ? parseInt(primaryDark.slice(3, 5), 16) : undefined
        const primaryDarkB = primaryDark ? parseInt(primaryDark.slice(5, 7), 16) : undefined
        const secondaryLightR = secondaryLight ? parseInt(secondaryLight.slice(1, 3), 16) : undefined
        const secondaryLightG = secondaryLight ? parseInt(secondaryLight.slice(3, 5), 16) : undefined
        const secondaryLightB = secondaryLight ? parseInt(secondaryLight.slice(5, 7), 16) : undefined
        const secondaryDarkR = secondaryDark ? parseInt(secondaryDark.slice(1, 3), 16) : undefined
        const secondaryDarkG = secondaryDark ? parseInt(secondaryDark.slice(3, 5), 16) : undefined
        const secondaryDarkB = secondaryDark ? parseInt(secondaryDark.slice(5, 7), 16) : undefined

        return await prisma.theme.update({
            where: {
                id
            },
            data: {
                ...data,
                primaryLightR,
                primaryLightG,
                primaryLightB,
                primaryDarkR,
                primaryDarkG,
                primaryDarkB ,
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