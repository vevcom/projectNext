import 'server-only'
import { createThemeColorValidation } from './validation'
import { ServiceMethodHandler } from '../ServiceMethodHandler'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createThemeColorValidation,
    handler: async (prisma, _, { primaryLight, primaryDark, secondaryLight, secondaryDark, ...data }) => {
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(primaryLight)) {
            throw new Error('Invalid hex color code')
        }
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(primaryDark)) {
            throw new Error('Invalid hex color code')
        }
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(secondaryLight)) {
            throw new Error('Invalid hex color code')
        }
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(secondaryDark)) {
            throw new Error('Invalid hex color code')
        }

        const primaryLightR = parseInt(primaryLight.slice(1, 3), 16)
        const primaryLightG = parseInt(primaryLight.slice(3, 5), 16)
        const primaryLightB = parseInt(primaryLight.slice(5, 7), 16)
        const primaryDarkR = parseInt(primaryDark.slice(1, 3), 16)
        const primaryDarkG = parseInt(primaryDark.slice(3, 5), 16)
        const primaryDarkB = parseInt(primaryDark.slice(5, 7), 16)
        const secondaryLightR = parseInt(secondaryLight.slice(1, 3), 16)
        const secondaryLightG = parseInt(secondaryLight.slice(3, 5), 16)
        const secondaryLightB = parseInt(secondaryLight.slice(5, 7), 16)
        const secondaryDarkR = parseInt(secondaryDark.slice(1, 3), 16)
        const secondaryDarkG = parseInt(secondaryDark.slice(3, 5), 16)
        const secondaryDarkB = parseInt(secondaryDark.slice(5, 7), 16)

        return await prisma.theme.create({
            data: {
                ...data,
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
